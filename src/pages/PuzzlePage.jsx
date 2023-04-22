import { useEffect, useMemo, useRef, useState } from "react";
import useSound from "use-sound";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import { LEVEL_PUZZLE } from "../helper/constants";
const tapSound = new URL("../assets/tap-sound.wav", import.meta.url).href;

const ROWS = 5;
const COLS = 4;
const POS_RESULT = [13, 14, 17, 18];

export default function PuzzlePage() {
  const [play] = useSound(tapSound);
  const [sizeCell, setSizeCell] = useState({ width: 0, height: 0, edge: 0 });
  const [temp, setTemp] = useState({ x: 0, y: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [notify, setNotify] = useState(false);
  const [level, setLevel] = useState(0);

  const [elements, setElements] = useState([]);

  useEffect(() => {
    resetElements();
  }, []);

  useEffect(() => {
    const levelPuzzle = JSON.parse(JSON.stringify(LEVEL_PUZZLE[level]));
    setElements(levelPuzzle);
  }, [level]);

  const resetElements = () => {
    const levelPuzzle = JSON.parse(JSON.stringify(LEVEL_PUZZLE[level]));
    setElements(levelPuzzle);
  };

  useEffect(() => {
    const findIndex = elements.findIndex(
      ({ size }) => size.width * size.height === 4
    );
    const arr = elementCell(findIndex);
    const check = POS_RESULT.every((item, index) => item === arr[index]);
    if (check) {
      setNotify(true);
    }
  }, [elements]);

  const bodyRef = useRef(null);

  useEffect(() => {
    const { clientHeight, clientWidth } = bodyRef.current;
    setSizeCell({
      width: clientWidth,
      height: clientHeight,
      edge: clientHeight / ROWS,
    });
  }, [bodyRef?.current]);

  const elementCell = (id) => {
    if (!elements[id]) return [];
    const { size, pos } = elements[id];
    const arr = [];
    for (let i = 0; i < size.height; i++) {
      for (let j = 0; j < size.width; j++) {
        arr.push((pos.top + i) * COLS + pos.left + j);
      }
    }
    return arr;
  };

  const onEnd = (ev) => {
    const { id } = ev.target;
    const { clientY, clientX } = ev.changedTouches[0];

    setTemp((prev) => {
      if (prev === null) return null;
      const valueY = clientY - prev.y;
      const valueX = clientX - prev.x;
      setElements((prev) => {
        const prevElement = JSON.parse(JSON.stringify([...prev]));
        const arrElement = [...prev];
        const { top, left } = arrElement[id].pos;
        const { width, height } = arrElement[id].size;
        const maxTop = ROWS - 1 * height;
        const maxLeft = COLS - 1 * width;

        let posNew = { ...arrElement[id].pos };
        if (Math.abs(valueY) > Math.abs(valueX)) {
          let topNew =
            valueY > sizeCell.edge / 3
              ? top + 1
              : valueY < -sizeCell.edge / 3
              ? top - 1
              : top;
          posNew = {
            ...posNew,
            top: topNew < 0 ? 0 : topNew > maxTop ? maxTop : topNew,
          };
        } else {
          const leftNew =
            valueX > sizeCell.edge / 3
              ? left + 1
              : valueX < -sizeCell.edge / 3
              ? left - 1
              : left;

          posNew = {
            ...posNew,
            left: leftNew < 0 ? 0 : leftNew > maxLeft ? maxLeft : leftNew,
          };
        }
        arrElement[id].pos = posNew;

        const arr = arrElement.reduce(
          (prev, cur, index) => [...prev, ...(index ? elementCell(index) : [])],
          elementCell(0)
        );
        const checkDuplicated = arr.some(
          (item, index) => arr.indexOf(item) !== index
        );
        play();

        return checkDuplicated ? prevElement : arrElement;
      });
      return null;
    });
  };

  const onStart = (ev) => {
    const { clientY, clientX } = ev.touches[0];
    setTemp({ x: clientX, y: clientY });
  };

  const colorCell = ({ width, height }) => {
    const value = width * height;

    switch (value) {
      case 1:
        return "bg-tertiary/80";
      case 2:
        return "bg-accent/90";
      case 4:
        return "bg-quaternary/90";
    }
  };

  const colorCellResult = ({ row, col }) => {
    const value = row * COLS + col;
    return POS_RESULT.includes(value) ? "bg-quaternary/20" : "";
  };

  const widthCell = (width) => width * sizeCell?.edge;
  const heightCell = (height) => height * sizeCell?.edge;

  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const retryGame = () => {
    resetElements();
    toggleDialog();
    setNotify(false);
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col flex-1 gap-4 justify-evenly relative">
      <div className="absolute w-full top-0 -mt-[52px] right-0">
        <div className="flex items-center justify-between">
          <p></p>
          <h3 className="pl-10 text-phudu font-bold">Giải đố</h3>
          <Button
            onClick={toggleDialog}
            className="bg-primary text-white p-1 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 013.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 00-4.392-4.392 49.422 49.422 0 00-7.436 0A4.756 4.756 0 003.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 101.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 013.01-3.01c1.19-.09 2.392-.135 3.605-.135zm-6.97 6.22a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 004.392 4.392 49.413 49.413 0 007.436 0 4.756 4.756 0 004.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 00-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 01-3.01 3.01 47.953 47.953 0 01-7.21 0 3.256 3.256 0 01-3.01-3.01 47.759 47.759 0 01-.1-1.759L6.97 15.53a.75.75 0 001.06-1.06l-3-3z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>
      <h3 className="text-4xl text-black/90 font-bold text-center">
        level {level + 1}
      </h3>
      <div
        className={`bg-black/10 rounded-lg relative after:block after:pb-[125%]`}
      >
        <div className="w-full h-full absolute">
          <table className="w-full h-full relative">
            <tbody ref={bodyRef} className="h-full">
              {[...new Array(ROWS)].fill(null).map((_, row) => (
                <tr key={row} className="">
                  {[...new Array(COLS)].fill(null).map((_, col) => (
                    <td
                      key={`${row + col}`}
                      className={`border-collapse border border-white rounded-lg ${colorCellResult(
                        { row, col }
                      )}`}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
            {elements.map(({ pos, size: { width, height } }, index) => (
              <thead
                id={index}
                key={index}
                style={{
                  top: pos?.top * sizeCell.edge,
                  left: pos?.left * sizeCell.edge,
                  width: `${widthCell(width)}px`,
                  height: `${heightCell(height)}px`,
                }}
                onTouchStart={onStart}
                onTouchEnd={onEnd}
                className={`absolute rounded-lg border ${colorCell({
                  width,
                  height,
                })} ${notify ? "pointer-events-none" : ""}`}
              ></thead>
            ))}
          </table>
        </div>
      </div>
      <div
        className={`flex justify-between gap-4 ${!notify ? "opacity-0" : ""}`}
      >
        <Button className="px-4 py-2 text-2xl w-full font-semibold rounded-lg bg-accent/90 text-white">
          Menu
        </Button>
        <Button
          onClick={nextLevel}
          className={`px-4 py-2 text-2xl w-full font-semibold rounded-lg bg-tertiary/90 text-white ${
            level < LEVEL_PUZZLE.length - 1 ? "" : "hidden"
          }`}
        >
          Tiếp
        </Button>
      </div>
      <Dialog open={openDialog} classDialog={"!max-w-[280px]"}>
        <div className="flex flex-col h-[200px] w-[200px] m-auto text-center justify-evenly text-phudu">
          <h3 className="text-3xl text-accent font-bold">Chơi lại?</h3>

          <Button
            onClick={retryGame}
            className="px-4 py-2 text-2xl font-semibold w-full mx-auto rounded-lg bg-tertiary/80 text-white"
          >
            Đồng ý
          </Button>
          <Button
            onClick={toggleDialog}
            className={`px-4 py-2 text-2xl font-semibold w-full mx-auto rounded-lg bg-quaternary/80 text-white`}
          >
            Đóng
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
