import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/use-toast";
import ajax from "@/services/fetchServices";
import { useState } from "react";

export default function Signup() {
  const { toast } = useToast();

  const [signupInfo, setSignupInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const checkFormFocus = (event) => {
    if (event.key === "Enter") {
      handleSignup();
    }
  };

  const handleChangeSignupInfo = (prop, value) => {
    setSignupInfo((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const handleSignup = () => {
    for (const [key, value] of Object.entries(signupInfo)) {
      if (value === "") {
        toast({
          variant: "destructive",
          title: "Ôi không! Có lỗi xảy ra 😥",
          description: "Vui lòng không để trống thông tin!",
        });
        return;
      }
    }

    if (!validateEmail(signupInfo.email)) {
      toast({
        variant: "destructive",
        title: "Ôi không! Có lỗi xảy ra 😥",
        description: "Vui lòng nhập một email hợp lệ!",
      });
      return;
    }

    ajax("post", "/api/v1/auth/signup", { ...signupInfo }, null)
      .then((response) => {
        if (response.status === 200) {
          toast({
            title: "Đăng ký tài khoản thành công 😊",
            description: "Vui lòng đăng nhập lại để truy cập hệ thống!",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 4000);
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Ôi không! Có lỗi xảy ra 😥",
          description: "Không thể đăng ký tài khoản! Vui lòng thử lại sau!",
        });
      });
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-[url('/background.jpg')] bg-cover py-16">
      <div className="w-[36rem] h-max rounded-2xl p-8 bg-white bg-opacity-60">
        <div className="w-full flex items-center justify-center">
          <Card className="mx-auto bg-transparent border-0 shadow-none w-full">
            <CardHeader className="space-y-1 items-center">
              <CardTitle className="lg:text-6xl text-4xl font-black mb-4">
                Đăng ký
              </CardTitle>
              <CardDescription className="lg:text-md text-md">
                Điền các thông tin cần thiết để đăng ký tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="focus:bg-border focus-visible:ring-0"
                    onKeyDown={checkFormFocus}
                    id="email"
                    placeholder="Nhập email tại đây"
                    required
                    value={signupInfo.email}
                    onChange={(e) =>
                      handleChangeSignupInfo("email", e.target.value)
                    }
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Tên họ</Label>
                  <Input
                    className="focus:bg-border focus-visible:ring-0"
                    onKeyDown={checkFormFocus}
                    id="firstName"
                    placeholder="Nhập tên họ tại đây"
                    required
                    value={signupInfo.firstName}
                    onChange={(e) =>
                      handleChangeSignupInfo("firstName", e.target.value)
                    }
                    autoComplete="firstName"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên đệm và tên chính</Label>
                  <Input
                    className="focus:bg-border focus-visible:ring-0"
                    onKeyDown={checkFormFocus}
                    id="lastName"
                    placeholder="Nhập tên đệm và tên chính tại đây"
                    required
                    value={signupInfo.lastName}
                    onChange={(e) =>
                      handleChangeSignupInfo("lastName", e.target.value)
                    }
                    autoComplete="lastName"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <PasswordInput
                    className="focus:bg-border focus-visible:ring-0"
                    onKeyDown={checkFormFocus}
                    id="password"
                    placeholder="Nhập mật khẩu tại đây"
                    required
                    value={signupInfo.password}
                    onChange={(e) =>
                      handleChangeSignupInfo("password", e.target.value)
                    }
                    autoComplete="password"
                  />
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  onClick={() => handleSignup()}
                >
                  Đăng ký
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
