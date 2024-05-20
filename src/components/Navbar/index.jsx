import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/util/useLocalStorage";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useLocalStorage("", "role");
  const [jwt, setJwt] = useLocalStorage("", "jwt");
  const [refreshJwt, setRefreshJwt] = useLocalStorage("", "refreshJwt");

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    setRole(null);
    setJwt(null);
    setRefreshJwt(null);
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-16 relative top-0 left-0 border-b-2 flex items-center justify-between px-12">
      <Button variant="ghost" onClick={handleGoBack}>
        <ArrowLeftIcon className="mr-2.5" />
        Quay lại
      </Button>
      <Button onClick={handleLogout}>Đăng xuất</Button>
    </div>
  );
}
