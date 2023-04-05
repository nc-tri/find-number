import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen gap-2 p-4 pb-12 max-w-[380px] w-full sm:max-w-full sm:w-[380px] mx-auto">
      <div className="py-2 w-fit z-50">
        <Menu />
      </div>
      <Outlet />
    </div>
  );
}
