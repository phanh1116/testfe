import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/util/useLocalStorage";
import { Link, Navigate } from "react-router-dom";

export default function Home() {
  const [jwt, setJwt] = useLocalStorage("", "jwt");

  return !jwt || jwt === "" ? (
    <div className="bg-background text-foreground flex flex-col items-center gap-12 justify-center w-full h-[100vh]">
      <div className="text-[4rem] font-black">
        Student management web application
      </div>
      <Link to="/login">
        <Button size="lg">Log in</Button>
      </Link>
    </div>
  ) : (
    <Navigate to="/dashboard" />
  );
}
