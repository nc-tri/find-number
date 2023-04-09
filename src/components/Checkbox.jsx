const tapSound = new URL("../assets/tap-sound.wav", import.meta.url).href;
import { useContext } from "react";
import useSound from "use-sound";
import { EffectContext } from "./EffectContext";

export default function Checkbox(props) {
  const [play] = useSound(tapSound);
  const { effect } = useContext(EffectContext);

  const handleClick = (ev) => {
    if (props.onClick) props.onClick(ev);
    if (effect) play();
  };
  return (
    <input type="checkbox" {...props} onClick={handleClick}>
      {props.children}
    </input>
  );
}
