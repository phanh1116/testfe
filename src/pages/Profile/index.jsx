import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/components/ui/use-toast";
import { INFO_MAPPER } from "@/constants/infoMapper";
import ajax, { fileAjax } from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { useEffect, useState } from "react";

export default function Profile() {
  const [role, setRole] = useLocalStorage("", "role");
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [refreshJwt, setRefreshJwt] = useLocalStorage("", "refreshJwt");

  const [changedInfo, setChangedInfo] = useState(null);
  const [disableInfo, setDisableInfo] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [userInfo, setUserInfo] = useState({
    id: "",
    studentId: "",
    email: "",
    name: "",
    dob: null,
    class: "",
    gpa: "",
    phoneNum: "",
    address: "",
    socialId: "",
    insurance: "",
    dadName: "",
    dadPhoneNum: "",
    dadYob: "",
    momName: "",
    momPhoneNum: "",
    momYob: "",
    demofile: "",
  });

  const external = [
    "phoneNum",
    "address",
    "socialId",
    "insurance",
    "dadName",
    "dadPhoneNum",
    "dadYob",
    "momName",
    "momPhoneNum",
    "momYob",
    "demofile",
  ];

  const getInfo = () => {
    ajax("get", "/api/v1/user/myinfor", null, jwt)
      .then((response) => response.data)
      .then((data) => {
        const infoData = {
          ...Object.fromEntries(
            Object.keys(userInfo).map((key) => {
              if (!(key in external)) {
                if (key === "dob") {
                  return [key, Date.parse(data[INFO_MAPPER[key]])];
                } else {
                  return [key, data[INFO_MAPPER[key]]];
                }
              } else {
                if (!key == "demofile") {
                  return [
                    key,
                    data[INFO_MAPPER[key]] ? data[INFO_MAPPER[key]] : "",
                  ];
                } else {
                  return [key, ""];
                }
              }
            })
          ),
        };
        setUserInfo({ ...infoData });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong 😥",
          description: error,
        });
      });
  };

  const getImage = () => {
    ajax("get", "api/v1/user/image", null, jwt)
      .then((response) => response.data)
      .then((data) => {
        const blob = new Blob([data], { type: "image/png" });
        return blob;
      })
      .then((blob) => {
        setUserInfo((prev) => ({
          ...prev,
          demofile: URL.createObjectURL(blob),
        }));
      });
  };

  useEffect(() => {
    getInfo();
    getImage();
  }, []);

  const handleStoreChanges = (prop, value) => {
    setChangedInfo((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const handleChangeUserInfo = () => {
    setChangedInfo({ ...userInfo });
    setDisableInfo(false);
  };

  const handleCommitChange = () => {
    const formData = new FormData();
    Object.entries(changedInfo).forEach(([key, value]) => {
      if (external.includes(key)) {
        formData.append(INFO_MAPPER[key], value);
      }
    });

    fileAjax("put", "/api/v1/user/myinfor", formData, jwt)
      .then((response) => {
        setChangedInfo(null);
        setDisableInfo(true);
        window.location.reload();
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong 😥",
          description: "Cannot upload file",
        });
      });
  };

  const handleCancelChange = () => {
    setChangedInfo(null);
    setDisableInfo(true);
  };

  const handleChangePassword = () => {
    if (newPassword === "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong 😥",
        description: "New password cannot be empty!",
      });
    } else if (newPassword !== repeatPassword) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong 😥",
        description: "New password and repeated password are not the same!",
      });
    } else {
      ajax(
        "post",
        "/api/v1/user/changepassword",
        { newPass: newPassword, repeatPass: repeatPassword },
        jwt
      ).then((response) => {
        if (response.data === "Password has been changed!") {
          toast({
            title: "Success 😊!",
            description: "Password has been changed! Please login again!",
          });
          setNewPassword("");
          setRepeatPassword("");

          setTimeout(() => {
            setRole(null);
            setJwt(null);
            setRefreshJwt(null);
            window.location.href = "/login";
          }, 3000);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full items-start justify-center space-y-4 pb-8">
      <div className="relative flex max-md:h-[8vh] md:h-[18vh] lg:h-[25vh] w-full items-end justify-between border-b-2 px-[5%] pb-8">
        <div className="flex gap-4 h-full w-[78%] items-end">
          <div className="h-full aspect-square relative rounded-full">
            <img
              className="w-full h-full rounded-full"
              src={
                changedInfo?.demofile
                  ? changedInfo?.demofile === userInfo?.demofile
                    ? `data:image/png;base64,${userInfo?.demofile}`
                    : URL.createObjectURL(changedInfo?.demofile)
                  : userInfo?.demofile
                  ? `data:image/png;base64,${userInfo?.demofile}`
                  : "/default_pfp.png"
              }
              alt="User's avatar"
            />
          </div>
          <span className="max-md:text-lg md:text-[3.2rem] lg:text-[5.1rem] font-semibold text-ellipsis overflow-hidden text-nowrap">
            {userInfo.name !== "" ? userInfo.name : "Không có"}
          </span>
        </div>

        <div>
          <Button variant="outline" className="rounded-full mr-2.5">
            <label
              htmlFor="pfpFile"
              className="cursor-pointer"
              onClick={handleChangeUserInfo}
            >
              Thay ảnh
            </label>
            <input
              type="file"
              id="pfpFile"
              name="pfpFile"
              accept="image/png"
              onChange={(e) =>
                handleStoreChanges("demofile", e.target.files[0])
              }
              hidden
            />
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleChangeUserInfo}
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Accordion className="w-full border-b-[1.5px]" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-[5%] text-lg font-semibold text-muted-foreground">
            Thông tin bắt buộc
          </AccordionTrigger>
          <AccordionContent className="px-[5%] mt-4">
            <div className="w-full flex flex-col">
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label className="lg:col-span-1 font-semibold" htmlFor="name">
                  Họ và tên
                </Label>
                <span id="name">
                  {userInfo.name != "" ? userInfo.name : "Không có"}
                </span>
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label
                  className="lg:col-span-1 font-semibold"
                  htmlFor="studentId"
                >
                  Mã sinh viên
                </Label>
                <span id="studentId">
                  {userInfo.studentId != "" ? userInfo.studentId : "Không có"}
                </span>
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label className="lg:col-span-1 font-semibold" htmlFor="email">
                  Email
                </Label>
                <span id="email">
                  {userInfo.email != "" ? userInfo.email : "Không có"}
                </span>
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label className="lg:col-span-1 font-semibold" htmlFor="dob">
                  Ngày sinh
                </Label>
                <DatePicker
                  id="dob"
                  prop="dob"
                  value={userInfo.dob}
                  action={null}
                />
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label className="lg:col-span-1 font-semibold" htmlFor="class">
                  Lớp
                </Label>
                <span id="class">
                  {userInfo.class != "" ? userInfo.class : "Không có"}
                </span>
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                <Label className="lg:col-span-1 font-semibold" htmlFor="gpa">
                  Điểm tích lũy
                </Label>
                <span id="gpa">
                  {userInfo.gpa != "" ? userInfo.gpa : "Không có"}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion className="w-full border-b-[1.5px]" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-[5%] text-lg font-semibold text-muted-foreground">
            Thông tin bổ sung
          </AccordionTrigger>
          <AccordionContent className="px-[5%] mt-4">
            <div className="w-full flex flex-col">
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label
                  className="lg:col-span-1 font-semibold"
                  htmlFor="phoneNum"
                >
                  SĐT
                </Label>
                <Input
                  id="phoneNum"
                  className="lg:col-span-2 max-lg:col-span-1"
                  disabled={disableInfo}
                  value={disableInfo ? userInfo.phoneNum : changedInfo.phoneNum}
                  onChange={(e) =>
                    handleStoreChanges("phoneNum", e.target.value)
                  }
                />
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label
                  className="lg:col-span-1 font-semibold"
                  htmlFor="address"
                >
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  className="lg:col-span-2 max-lg:col-span-1"
                  disabled={disableInfo}
                  value={disableInfo ? userInfo.address : changedInfo.address}
                  onChange={(e) =>
                    handleStoreChanges("address", e.target.value)
                  }
                />
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label
                  className="lg:col-span-1 font-semibold"
                  htmlFor="socialId"
                >
                  CCCD
                </Label>
                <Input
                  id="socialId"
                  className="lg:col-span-2 max-lg:col-span-1"
                  disabled={disableInfo}
                  value={disableInfo ? userInfo.socialId : changedInfo.socialId}
                  onChange={(e) =>
                    handleStoreChanges("socialId", e.target.value)
                  }
                />
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label
                  className="lg:col-span-1 font-semibold"
                  htmlFor="insurance"
                >
                  Bảo hiểm
                </Label>
                <Input
                  id="insurance"
                  className="lg:col-span-2 max-lg:col-span-1"
                  disabled={disableInfo}
                  value={
                    disableInfo ? userInfo.insurance : changedInfo.insurance
                  }
                  onChange={(e) =>
                    handleStoreChanges("insurance", e.target.value)
                  }
                />
              </div>
              <div className="w-full flex lg:flex-row max-lg:flex-col">
                <div className="lg:w-1/2 max-lg:w-full flex flex-col">
                  <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                    <Label
                      className="lg:col-span-1 font-semibold"
                      htmlFor="dadName"
                    >
                      Họ tên bố
                    </Label>
                    <Input
                      id="dadName"
                      className="lg:col-span-4 max-lg:col-span-1"
                      disabled={disableInfo}
                      value={
                        disableInfo ? userInfo.dadName : changedInfo.dadName
                      }
                      onChange={(e) =>
                        handleStoreChanges("dadName", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                    <Label
                      className="lg:col-span-1 font-semibold"
                      htmlFor="dadPhoneNum"
                    >
                      SĐT bố
                    </Label>
                    <Input
                      id="dadPhoneNum"
                      className="lg:col-span-4 max-lg:col-span-1"
                      disabled={disableInfo}
                      value={
                        disableInfo
                          ? userInfo.dadPhoneNum
                          : changedInfo.dadPhoneNum
                      }
                      onChange={(e) =>
                        handleStoreChanges("dadPhoneNum", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                    <Label
                      className="lg:col-span-1 font-semibold"
                      htmlFor="gpdadYoba"
                    >
                      Năm sinh bố
                    </Label>
                    <Input
                      id="dadYob"
                      className="lg:col-span-4 max-lg:col-span-1"
                      disabled={disableInfo}
                      value={disableInfo ? userInfo.dadYob : changedInfo.dadYob}
                      onChange={(e) =>
                        handleStoreChanges("dadYob", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="lg:w-1/2 max-lg:w-full flex flex-col">
                  <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                    <Label
                      className="lg:col-span-1 font-semibold"
                      htmlFor="momName"
                    >
                      Họ tên mẹ
                    </Label>
                    <Input
                      id="momName"
                      className="lg:col-span-4 max-lg:col-span-1"
                      disabled={disableInfo}
                      value={
                        disableInfo ? userInfo.momName : changedInfo.momName
                      }
                      onChange={(e) =>
                        handleStoreChanges("momName", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                    <Label
                      className="lg:col-span-1 font-semibold"
                      htmlFor="momPhoneNum"
                    >
                      SĐT mẹ
                    </Label>
                    <Input
                      id="momPhoneNum"
                      className="lg:col-span-4 max-lg:col-span-1"
                      disabled={disableInfo}
                      value={
                        disableInfo
                          ? userInfo.momPhoneNum
                          : changedInfo.momPhoneNum
                      }
                      onChange={(e) =>
                        handleStoreChanges("momPhoneNum", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                    <Label
                      className="lg:col-span-1 font-semibold"
                      htmlFor="momYob"
                    >
                      Năm sinh mẹ
                    </Label>
                    <Input
                      id="momYob"
                      className="lg:col-span-4 max-lg:col-span-1"
                      disabled={disableInfo}
                      value={disableInfo ? userInfo.momYob : changedInfo.momYob}
                      onChange={(e) =>
                        handleStoreChanges("momYob", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion className="w-full border-b-[1.5px]" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-[5%] text-lg font-semibold text-muted-foreground">
            Đổi mật khẩu
          </AccordionTrigger>
          <AccordionContent className="px-[5%] mt-4">
            <div className="w-full flex flex-col">
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center border-b py-6">
                <Label
                  className="lg:col-span-1 font-semibold"
                  htmlFor="newPassword"
                >
                  Mật khẩu mới
                </Label>
                <PasswordInput
                  id="newPassword"
                  className="lg:col-span-2 max-lg:col-span-1"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="w-full grid lg:grid-cols-6 gap-2.5 grid-cols-1 items-center py-6">
                <Label
                  className="lg:col-span-1 font-semibold"
                  htmlFor="repeatPassword"
                >
                  Nhập lại mật khẩu
                </Label>
                <PasswordInput
                  id="repeatPassword"
                  className="lg:col-span-2 max-lg:col-span-1"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {newPassword !== "" ? (
                <div className="mt-4">
                  <Button
                    className="rounded-full"
                    onClick={handleChangePassword}
                  >
                    Đổi mật khẩu
                  </Button>
                </div>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {!disableInfo ? (
        <div className="w-full flex px-[5%] items-center justify-between">
          <Button onClick={handleCommitChange}>Lưu chỉnh sửa</Button>
          <Button variant="destructive" onClick={handleCancelChange}>
            Hủy bỏ
          </Button>
        </div>
      ) : null}
    </div>
  );
}
