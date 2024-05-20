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
import { useLocalStorage } from "@/util/useLocalStorage";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useLocalStorage("", "role");
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [refreshJwt, setRefreshJwt] = useLocalStorage("", "refreshJwt");

  const checkFormFocus = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = () => {
    const authData = {
      email: email,
      password: password,
    };

    ajax("post", "/api/v1/auth/signin", authData, null)
      .then(async (response) => {
        setJwt(response.data.token);
        setRefreshJwt(response.data.refreshToken);
        setRole(response.data.role);
        window.location.href = "/profile";
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Ôi không! Có lỗi xảy ra 😥",
          description: "Thông tin tài khoản không đúng",
        });
      });
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-[url('/background.jpg')] bg-cover py-16">
      <div className="lg:w-2/3 md:w-3/4 sm:w-full place-items-center gap-y-2.5 h-max rounded-2xl p-8 grid sm:grid-cols-2 bg-white bg-opacity-60">
        <div className="w-full aspect-square bg-cover bg-[url('/cat.jpg')] rounded-xl max-sm:hidden"></div>
        <div className="w-full flex items-center justify-center">
          <Card className="mx-auto max-w-sm bg-transparent border-0 shadow-none">
            <CardHeader className="space-y-1 items-center">
              <CardTitle className="lg:text-6xl text-4xl font-black mb-4">
                Đăng nhập
              </CardTitle>
              <CardDescription className="lg:text-md text-md">
                Nhập email và mật khẩu để truy cập vào tài khoản
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="relative space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link
                      className="ml-auto inline-block text-sm underline"
                      href="#"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <PasswordInput
                    className="focus:bg-border focus-visible:ring-0"
                    onKeyDown={checkFormFocus}
                    id="password"
                    placeholder="Nhập mật khẩu tại đây"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="password"
                  />
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  onClick={() => handleLogin()}
                >
                  Đăng nhập
                </Button>
                <div className="mt-4 text-center text-sm">
                  Chưa có tài khoản?{" "}
                  <Link className="underline" href="/signup">
                    Đăng ký ngay
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
