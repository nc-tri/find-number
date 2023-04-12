const tapSound = new URL("../assets/tap-sound.wav", import.meta.url).href;
import { useContext } from "react";
import useSound from "use-sound";
import { EffectContext } from "./EffectContext";

export default function Checkbox({
  children,
  id,
  checked,
  disabled,
  values = [],
  ...props
}) {
  const [play] = useSound(tapSound);
  const { effect } = useContext(EffectContext);

  const handleClick = (ev) => {
    if (props.onClick) props.onClick(ev);
    if (effect) play();
  };

  const handleChange = (ev) => {
    if (props.onChange) props.onChange(ev);
  };
  return !children ? (
    <input type="checkbox" {...props} onClick={handleClick} />
  ) : (
    <div className="relative w-max">
      <input
        className="peer hidden"
        id={id}
        name={id}
        checked={checked}
        disabled={disabled}
        onClick={handleClick}
        onChange={handleChange}
        type="checkbox"
      />
      <label
        htmlFor={id}
        {...props}
        className={`${
          disabled ? "opacity-30 bg-black/30" : ""
        } inline-flex items-center justify-between w-full px-4 py-2 border-2 border-gray-200 rounded-lg peer-checked:border-primary`}
      >
        <span>{children}</span>
      </label>
    </div>
  );
}
