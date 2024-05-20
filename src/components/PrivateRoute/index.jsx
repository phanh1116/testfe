import { useToast } from "@/components/ui/use-toast";
import ajax from "@/services/fetchServices";
import { useLocalStorage } from "@/util/useLocalStorage";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children }) {
  const { toast } = useToast();
  const [role, setRole] = useLocalStorage("", "role");
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [refreshJwt, setRefreshJwt] = useLocalStorage("", "refreshJwt");

  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const { exp } = jwtDecode(jwt);
  const expirationTime = exp * 1000;

  const handleLogout = () => {
    setJwt(null);
    setRefreshJwt(null);
    setRole(null);
    window.location.href = "/login";
  };

  const refreshToken = () => {
    ajax("post", "/api/v1/auth/refresh", { token: refreshJwt }, null)
      .then((response) => {
        if (response) {
          setJwt(response.data.token);
          setRefreshJwt(response.data.refreshToken);
          setRole(response.data.role);
          setRefreshed(true);
        } else {
          handleLogout();
        }
      })
      .catch((error) => {
        handleLogout();
      });
  };

  if (jwt) {
    ajax("get", `/api/v1/auth/token?token=${jwt}`, null, null)
      .then((response) => {
        setIsValid(response.data);
        setIsLoading(false);
        if (response.status === 403) {
          handleLogout();
        }
      })
      .catch((error) => {
        handleLogout();
      });

    if (Date.now() >= expirationTime - 60000) {
      toast({
        title: "Cảnh báo",
        description: "Phiên làm việc của bạn sắp hết!",
        action: (
          <ToastAction altText="Làm mới phiên" onClick={refreshToken}>
            Làm mới phiên
          </ToastAction>
        ),
      });

      setTimeout(() => {
        handleLogout();
      }, Date.now() - expirationTime);
    }
  } else {
    return <Navigate to="/login" />;
  }

  return isLoading ? (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="border-secondary h-20 w-20 animate-spin rounded-full border-8 border-t-foreground" />
    </div>
  ) : isValid ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
}
