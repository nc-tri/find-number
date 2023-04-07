const tapSound = new URL("../assets/tap-sound.wav", import.meta.url).href;
import { useContext } from "react";
import { Link } from "react-router-dom";
import useSound from "use-sound";
import { EffectContext } from "./EffectContext";

export default function Button(props) {
  const [play] = useSound(tapSound);
  const { effect } = useContext(EffectContext);

  const handleClick = (ev) => {
    if (props.onClick) props.onClick(ev);
    if (effect) play();
  };
  return props.to ? (
    <Link {...props} onClick={handleClick}>
      {props.children}
    </Link>
  ) : (
    <button {...props} onClick={handleClick}>
      {props.children}
    </button>
  );
}
