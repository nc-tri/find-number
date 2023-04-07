import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import Sound from "react-sound";
import { useEffect, useState } from "react";

export default function Layout() {
  console.log(new URL("../assets/bg-sound.mp3", import.meta.url).href);
  const [control, setControl] = useState({
    playStatusMusic: Sound.status.PLAYING,
  });

  useEffect(() => {
    const soundLocal = JSON.parse(localStorage.getItem("sound"));
    if (!soundLocal) return;
    else {
      setControl((prev) => ({ ...prev, ...soundLocal }));
    }
  }, []);

  return (
    <div className="flex flex-col h-screen gap-2 p-4 pb-12 max-w-[380px] w-full sm:max-w-full sm:w-[380px] mx-auto">
      <Sound
        url={new URL("../assets/bg-sound.mp3", import.meta.url).href}
        playStatus={control.playStatusMusic}
        playFromPosition={0}
        volume={50}
        loop
      />
      <div className="py-2 w-fit z-50">
        <Menu />
      </div>
      <Outlet />
    </div>
  );
}
