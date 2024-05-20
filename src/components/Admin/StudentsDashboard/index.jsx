import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { INFO_MAPPER } from "@/constants/infoMapper";
import { cn } from "@/lib/utils";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { DialogClose } from "@radix-ui/react-dialog";
import { Plus, Search, Trash2, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import DatePickerInput from "@/components/ui/date-picker-input";

export default function StudentsDashboard() {
  const { toast } = useToast();

  const rowsPerPage = 10;
  const compulsoryUserInfo = {
    name: "",
    studentId: "",
    class: "",
    dob: "",
    gpa: "",
  };

  const [jwt, setJwt] = useLocalStorage("", "jwt");

  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [currentChangedUser, setCurrentChangedUser] =
    useState(compulsoryUserInfo);

  const getAllUsers = () => {
    ajax("get", "/api/v1/admin/allStudent", null, jwt).then((response) => {
      setUsers(response.data);
    });
  };

  const handleCreateUser = () => {
    ajax(
      "post",
      "api/v1/admin/create",
      {
        ...Object.fromEntries(
          Object.keys(currentChangedUser).map((key) => {
            if (key === "dob") {
              var date = new Date(currentChangedUser[key]);
              date = new Date(
                date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
              );
              return [
                INFO_MAPPER[key],
                date.toISOString().toString().substring(0, 10),
              ];
            } else {
              return [INFO_MAPPER[key], currentChangedUser[key]];
            }
          })
        ),
      },
      jwt
    ).then((response) => {
      if (response.status === 404) {
        toast({
          variant: "destructive",
          title: "Cập nhật người dùng",
          description: "Thêm người dùng thất bại, mã sinh viên đã tồn tại 🥲",
        });
      } else {
        toast({
          title: "Cập nhật người dùng",
          description: "Thêm người dùng thành công 😊",
        });
        getAllUsers();
      }
    });
  };

  const handleUpdateUser = (oldStudentId) => {
    ajax(
      "put",
      `/api/v1/admin/update/${oldStudentId}`,
      {
        ...Object.fromEntries(
          Object.keys(currentChangedUser).map((key) => {
            if (key === "dob") {
              var date = new Date(currentChangedUser[key]);
              date = new Date(
                date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
              );
              return [
                INFO_MAPPER[key],
                date.toISOString().toString().substring(0, 10),
              ];
            } else {
              return [INFO_MAPPER[key], currentChangedUser[key]];
            }
          })
        ),
      },
      jwt
    )
      .then((response) => {
        if (response.status === 200) {
          toast({
            title: "Cập nhật người dùng",
            description: "Sửa thông tin thành công 😊",
          });
          getAllUsers();
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Cập nhật người dùng",
          description: "Sửa thông tin thất bại 🥲",
        });
      });
  };

  const handleDeleteUser = (toDeleteId) => {
    ajax("delete", `/api/v1/admin/delete?msv=${toDeleteId}`, null, jwt)
      .then((response) => {
        if (response.status === 200) {
          toast({
            title: "Cập nhật người dùng",
            description: "Xóa sinh viên thành công 😊",
          });
          getAllUsers();
        } else {
          toast({
            variant: "destructive",
            title: "Cập nhật người dùng",
            description: "Xóa sinh viên thất bại 🥲",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Cập nhật người dùng",
          description: "Xóa sinh viên thất bại 🥲",
        });
      });
  };

  const handleInitUserChange = (user) => {
    setCurrentChangedUser({
      ...Object.fromEntries(
        Object.keys(currentChangedUser).map((key) => [
          key,
          user[INFO_MAPPER[key]],
        ])
      ),
    });
  };

  const handleStoreChanges = (prop, value) => {
    setCurrentChangedUser((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="w-full h-full bg-background container flex flex-col gap-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-4xl">Danh sách sinh viên</h1>
        <div
          className={cn(
            "flex h-10 items-center rounded-md border border-input bg-background pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2"
          )}
        >
          <Search />
          <Input
            className="p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
            placeholder="Nhập msv cần tìm"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
      </div>
      {users?.length > 0 ? (
        <>
          <ul className="w-full grid grid-cols-1 gap-y-2.5 mt-4">
            {users
              .filter((user) => user.msv.includes(searchId))
              .slice(startIndex, endIndex)
              .map((user, index) => (
                <li
                  className="w-full flex items-center gap-2.5"
                  key={`user-${index}`}
                >
                  <div className="flex w-full justify-between items-center px-10 py-4 bg-muted rounded-md border">
                    <div className="flex items-center gap-6">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          user.demofile
                            ? `data:image/png;base64,${user.demofile}`
                            : "/default_pfp.png"
                        }
                        alt=""
                      />
                      <div className="flex flex-col gap-1.5 ">
                        <div className="text-base opacity-90">
                          Sinh viên {user.hoTen}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            onClick={() => handleInitUserChange(user)}
                          >
                            <Wrench className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sửa thông tin người dùng</DialogTitle>
                            <div className="px-[5%]">
                              <div className="w-full flex flex-col">
                                <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                                  <Label
                                    className="lg:col-span-2 font-semibold"
                                    htmlFor="name"
                                  >
                                    Họ và tên
                                  </Label>
                                  <Input
                                    id="name"
                                    className="lg:col-span-5 max-lg:col-span-1"
                                    value={currentChangedUser.name}
                                    onChange={(e) =>
                                      handleStoreChanges("name", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                                  <Label
                                    className="lg:col-span-2 font-semibold"
                                    htmlFor="studentId"
                                  >
                                    Mã sinh viên
                                  </Label>

                                  <Input
                                    id="studentId"
                                    className="lg:col-span-5 max-lg:col-span-1"
                                    value={currentChangedUser.studentId}
                                    onChange={(e) =>
                                      handleStoreChanges(
                                        "studentId",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                                  <Label
                                    className="lg:col-span-2 font-semibold"
                                    htmlFor="dob"
                                  >
                                    Ngày sinh
                                  </Label>
                                  <div className="lg:col-span-5">
                                    <DatePickerInput
                                      prop="dob"
                                      value={currentChangedUser.dob}
                                      action={handleStoreChanges}
                                    />
                                  </div>
                                </div>
                                <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                                  <Label
                                    className="lg:col-span-2 font-semibold"
                                    htmlFor="class"
                                  >
                                    Lớp
                                  </Label>
                                  <Input
                                    id="class"
                                    className="lg:col-span-5 max-lg:col-span-1"
                                    value={currentChangedUser.class}
                                    onChange={(e) =>
                                      handleStoreChanges(
                                        "class",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center py-6">
                                  <Label
                                    className="lg:col-span-2 font-semibold"
                                    htmlFor="gpa"
                                  >
                                    Điểm tích lũy
                                  </Label>
                                  <Input
                                    id="gpa"
                                    className="lg:col-span-5 max-lg:col-span-1"
                                    value={currentChangedUser.gpa}
                                    onChange={(e) =>
                                      handleStoreChanges("gpa", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </DialogHeader>
                          <div className="flex items-center justify-between">
                            <Button onClick={() => handleUpdateUser(user.msv)}>
                              Xác nhận
                            </Button>
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setCurrentChangedUser(compulsoryUserInfo)
                                }
                              >
                                Hủy
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Bạn chuẩn bị xóa một người dùng
                            </DialogTitle>
                            <DialogDescription>
                              Toàn bộ dữ liệu của người dùng sẽ bị xóa vĩnh
                              viễn! Bạn đã chắc chưa?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-between">
                            <DialogClose asChild>
                              <Button
                                onClick={() => handleDeleteUser(user.msv)}
                              >
                                Xác nhận
                              </Button>
                            </DialogClose>
                            <DialogClose>
                              <Button variant="outline">Hủy</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          <div className="my-4 w-full flex items-center justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setCurrentChangedUser(compulsoryUserInfo)}
                >
                  Thêm mới
                  <Plus className="ml-2.5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm mới người dùng</DialogTitle>
                  <div className="px-[5%]">
                    <div className="w-full flex flex-col">
                      <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                        <Label
                          className="lg:col-span-2 font-semibold"
                          htmlFor="name"
                        >
                          Họ và tên
                        </Label>
                        <Input
                          id="name"
                          className="lg:col-span-5 max-lg:col-span-1"
                          value={currentChangedUser.name}
                          onChange={(e) =>
                            handleStoreChanges("name", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                        <Label
                          className="lg:col-span-2 font-semibold"
                          htmlFor="studentId"
                        >
                          Mã sinh viên
                        </Label>

                        <Input
                          id="studentId"
                          className="lg:col-span-5 max-lg:col-span-1"
                          value={currentChangedUser.studentId}
                          onChange={(e) =>
                            handleStoreChanges("studentId", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                        <Label
                          className="lg:col-span-2 font-semibold"
                          htmlFor="dob"
                        >
                          Ngày sinh
                        </Label>
                        <DatePickerInput
                          id="dob"
                          prop="dob"
                          value={currentChangedUser.dob}
                          action={handleStoreChanges}
                        />
                      </div>
                      <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center border-b py-6">
                        <Label
                          className="lg:col-span-2 font-semibold"
                          htmlFor="class"
                        >
                          Lớp
                        </Label>
                        <Input
                          id="class"
                          className="lg:col-span-5 max-lg:col-span-1"
                          value={currentChangedUser.class}
                          onChange={(e) =>
                            handleStoreChanges("class", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full grid lg:grid-cols-7 gap-2.5 grid-cols-1 items-center py-6">
                        <Label
                          className="lg:col-span-2 font-semibold"
                          htmlFor="gpa"
                        >
                          Điểm tích lũy
                        </Label>
                        <Input
                          id="gpa"
                          className="lg:col-span-5 max-lg:col-span-1"
                          value={currentChangedUser.gpa}
                          onChange={(e) =>
                            handleStoreChanges("gpa", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex items-center justify-between">
                  <Button onClick={handleCreateUser}>Xác nhận</Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentChangedUser(compulsoryUserInfo)}
                    >
                      Hủy
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Pagination className="mb-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={`cursor-pointer ${
                    startIndex === 0
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    setStartIndex(startIndex - rowsPerPage);
                    setEndIndex(endIndex - rowsPerPage);
                  }}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  className={`cursor-pointer ${
                    endIndex >= users.length
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    setStartIndex(startIndex + rowsPerPage);
                    setEndIndex(endIndex + rowsPerPage);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <div className="text-sm font-semibold">No user found</div>
      )}
    </div>
  );
}
