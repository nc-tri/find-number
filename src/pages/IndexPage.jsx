import { useState } from "react";
import Button from "../components/Button";
import Dialog from "../components/Dialog";

export default function IndexPage() {
  const [openDialog, setOpenDialog] = useState(false);

  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  return (
    <div className="flex flex-col text-phudu text-center h-screen justify-evenly ">
      <span className="font-bold text-4xl">find number</span>
      <img
        className="w-32 h-32 mx-auto"
        src={new URL("../../public/vite.svg", import.meta.url)}
        alt="logo"
      />
      <div>
        <div className="mx-auto inline-flex flex-col gap-2">
          <Button
            to="main"
            className="px-4 py-2 text-3xl font-semibold w-auto rounded-lg bg-secondary/70 text-white"
          >
            Đoán Số
          </Button>
          <Button
            onClick={toggleDialog}
            className="px-4 py-2 text-3xl font-semibold w-auto rounded-lg bg-tertiary/90 text-white"
          >
            Phép Tính
          </Button>
          <Button
            to="sort"
            className="px-4 py-2 text-3xl font-semibold w-auto rounded-lg bg-primary/90 text-white"
          >
            Tháp Hà Nội
          </Button>
          <Button
            to="puzzle"
            className="px-4 py-2 text-3xl font-semibold w-auto rounded-lg bg-quaternary/90 text-white"
          >
            Giải đố
          </Button>
        </div>
        <Dialog open={openDialog}>
          <div className="flex gap-4">
            <Button
              to="calculate"
              className="flex-1 px-4 py-2 text-lg font-semibold w-auto rounded-lg bg-primary/90 text-white"
            >
              Cơ bản
            </Button>
            <Button
              to="logic"
              className="flex-1 px-4 py-2 text-lg font-semibold w-auto rounded-lg bg-secondary/90 text-white"
            >
              Nâng cao
            </Button>
          </div>
          <Button
            onClick={toggleDialog}
            className="px-4 py-2 text-lg font-semibold w-full mx-auto rounded-lg bg-quaternary/80 text-white"
          >
            Đóng
          </Button>
        </Dialog>
      </div>
    </div>
  );
}
