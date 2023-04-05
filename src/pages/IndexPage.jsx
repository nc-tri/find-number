import { Link } from "react-router-dom";

export default function IndexPage() {
  return (
    <div className="flex flex-col text-phudu text-center h-screen justify-evenly ">
      <span className="font-bold text-4xl">find number</span>
      <img
        className="w-32 h-32 mx-auto"
        src={new URL("../../public/vite.svg", import.meta.url)}
        alt="logo"
      />
      <Link to="main">
        <button className="px-4 py-2 text-3xl font-semibold w-full w-max mx-auto rounded-lg bg-secondary/70 text-white">
          play
        </button>
      </Link>
    </div>
  );
}
