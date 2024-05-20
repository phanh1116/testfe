import PowerBIDashboard from "@/components/Admin/PowerBIDashboard";
import StudentsDashboard from "@/components/Admin/StudentsDashboard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Admin() {
  const [component, setComponent] = useState("student");

  return (
    <div className="w-full flex flex-col items-center justify-center text-foreground">
      <Breadcrumb className="w-full px-[5%] my-4">
        <BreadcrumbList>
          <BreadcrumbItem
            className={`hover:text-foreground text-base cursor-pointer font-semibold ${
              component === "student" ? "text-foreground" : ""
            }`}
            onClick={() => setComponent("student")}
          >
            Students dashboard
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem
            className={`hover:text-foreground text-base cursor-pointer font-semibold ${
              component === "powerbi" ? "text-foreground" : ""
            }`}
            onClick={() => setComponent("powerbi")}
          >
            Statistics dashboard
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {component === "student" ? <StudentsDashboard /> : <PowerBIDashboard />}
    </div>
  );
}
