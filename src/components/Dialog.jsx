export default function Dialog({ children, open, className, classDialog }) {
  return (
    // <div className="flex text-phudu z-50">
    <div
      className={`${
        open ? "" : "hidden"
      } fixed h-screen w-screen bg-black/20 inset-0 z-[1000]  ${
        className ? className : ""
      }`}
    >
      <dialog
        open={open}
        className={`flex flex-col text-center gap-4 border border-black/10 rounded-lg max-w-[320px] w-auto top-1/2 -translate-y-1/2 drop-shadow-lg px-2 z-[1000] ${
          classDialog ? classDialog : ""
        }`}
      >
        {children}
      </dialog>
    </div>
    // </div>
  );
}
