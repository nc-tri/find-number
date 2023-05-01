import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import { LEVEL_PUZZLE } from "../helper/constants";
import Radio from "../components/Radio";
const tapSound = new URL("../assets/tap-sound.wav", import.meta.url).href;

const ROWS = 5;
const COLS = 4;
const POS_RESULT = [13, 14, 17, 18];

export default function PuzzlePage() {
  const [play] = useSound(tapSound);
  const [sizeCell, setSizeCell] = useState({ width: 0, height: 0, edge: 0 });
  const [temp, setTemp] = useState({ x: 0, y: 0, top: 0, left: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [notify, setNotify] = useState(false);
  const [level, setLevel] = useState(0);
  const [levelTemp, setLevelTemp] = useState(0);

  const [elements, setElements] = useState([]);

  useEffect(() => {
    const puzzleLocal = localStorage.getItem("puzzle");
    if (puzzleLocal)
      setElements((prev) => {
        const { level: levelLocal, elements: elementsLocal } =
          JSON.parse(puzzleLocal);
        setLevel(levelLocal);
        return (
          elementsLocal || JSON.parse(JSON.stringify(LEVEL_PUZZLE[levelLocal]))
        );
      });
    else resetElements();
  }, []);

  // useEffect(() => {
  //   const levelPuzzle = JSON.parse(JSON.stringify(LEVEL_PUZZLE[level]));
  //   const puzzleLocal = localStorage.getItem("puzzle");
  //   // setElements(levelPuzzle);
  //   console.log();
  //   // localStorage.setItem("puzzle", JSON.stringify({ level: level }));
  // }, [level]);

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

  const elementCell = (id, arrEle = elements) => {
    if (!arrEle[id]) return [];
    const { size, pos } = arrEle[id];
    const arr = [];
    for (let i = 0; i < size.height; i++) {
      for (let j = 0; j < size.width; j++) {
        arr.push((pos.top + i) * COLS + pos.left + j);
      }
    }
    return arr;
  };

  const onEnd = (ev) => {
    ev.stopPropagation();
    play();
    setTimeout(() =>
      setTemp((preTemp) => {
        setElements((prev) => {
          const { id } = ev.target;
          const arrElement = [...prev];
          arrElement[id].pos = {
            top: Math.round(preTemp.top[id]),
            left: Math.round(preTemp.left[id]),
          };

          localStorage.setItem(
            "puzzle",
            JSON.stringify({
              elements: arrElement,
              level: level,
            })
          );
          return arrElement;
        });
        return null;
      })
    );

    // ev.preventDefault();
    // const { id } = ev.target;
    // const { clientY, clientX } = ev.changedTouches[0];

    // setTemp((prev) => {
    //   if (prev === null) return null;
    //   const valueY = clientY - prev.y;
    //   const valueX = clientX - prev.x;
    //   setElements((prev) => {
    //     const prevElement = JSON.parse(JSON.stringify([...prev]));
    //     const arrElement = [...prev];
    //     const { top, left } = arrElement[id].pos;
    //     const { width, height } = arrElement[id].size;
    //     const maxTop = ROWS - 1 * height;
    //     const maxLeft = COLS - 1 * width;

    //     let posNew = { ...arrElement[id].pos };
    //     if (Math.abs(valueY) > Math.abs(valueX)) {
    //       let topNew =
    //         valueY > sizeCell.edge / 3
    //           ? top + 1
    //           : valueY < -sizeCell.edge / 3
    //           ? top - 1
    //           : top;
    //       posNew = {
    //         ...posNew,
    //         top: topNew < 0 ? 0 : topNew > maxTop ? maxTop : topNew,
    //       };
    //     } else {
    //       const leftNew =
    //         valueX > sizeCell.edge / 3
    //           ? left + 1
    //           : valueX < -sizeCell.edge / 3
    //           ? left - 1
    //           : left;

    //       posNew = {
    //         ...posNew,
    //         left: leftNew < 0 ? 0 : leftNew > maxLeft ? maxLeft : leftNew,
    //       };
    //     }
    //     arrElement[id].pos = posNew;

    //     const arr = arrElement.reduce(
    //       (prev, cur, index) => [...prev, ...(index ? elementCell(index) : [])],
    //       elementCell(0)
    //     );
    //     const checkDuplicated = arr.some(
    //       (item, index) => arr.indexOf(item) !== index
    //     );
    //     play();

    //     return checkDuplicated ? prevElement : arrElement;
    //   });
    //   return null;
    // });
  };

  const onMove = (ev) => {
    ev.stopPropagation();
    const { id } = ev.target;
    const { clientY, clientX } = ev.changedTouches[0];

    setTemp((prev) => {
      if (prev === null) return null;
      const valueY = clientY - prev.y;
      const valueX = clientX - prev.x;
      let maxTop = ROWS - 1 * prev.height;
      let minTop = 0;
      let maxLeft = COLS - 1 * prev.width;
      let minLeft = 0;
      if (prev.isHor === undefined)
        return { ...prev, isHor: !(Math.abs(valueY) > Math.abs(valueX)) };
      let objTemp;
      let topNew;
      let leftNew;
      const test = elements.filter((_, index) => +id !== index);
      let arr = test.reduce(
        (prev, cur, index) => [
          ...prev,
          ...(index ? elementCell(index, test) : []),
        ],
        elementCell(0, test)
      );
      if (!prev.isHor) {
        topNew = elements[id].pos.top + valueY / sizeCell.edge;

        for (let i = 0; i < prev.width; i++) {
          const cell = elements[id].pos.top * COLS + elements[id].pos.left + i;

          arr.forEach((item) => {
            const itemTop = Math.floor(item / COLS);
            const cellTop = Math.floor(cell / COLS);
            if (
              item % COLS === cell % COLS &&
              itemTop + 1 <= cellTop &&
              minTop <= itemTop + 1 &&
              elements[id].pos.top >= itemTop + 1
            ) {
              minTop = itemTop + 1;
            }
            if (
              item % COLS === cell % COLS &&
              itemTop - prev.height >= cellTop &&
              maxTop >= itemTop - prev.height &&
              elements[id].pos.top <= itemTop - prev.height
            ) {
              maxTop = itemTop - prev.height;
            }
          });
        }
        topNew = topNew < minTop ? minTop : topNew > maxTop ? maxTop : topNew;
        objTemp = { ...prev, top: { [id]: topNew } };
      } else {
        leftNew = elements[id].pos.left + valueX / sizeCell.edge;
        for (let i = 0; i < prev.height; i++) {
          const cell =
            (elements[id].pos.top + i) * COLS + elements[id].pos.left;
          arr.forEach((item) => {
            const itemLeft = item % COLS;
            const cellLeft = cell % COLS;
            if (
              Math.floor(item / COLS) === Math.floor(cell / COLS) &&
              itemLeft + 1 <= cellLeft &&
              minLeft <= itemLeft + 1 &&
              elements[id].pos.left >= itemLeft + 1
            ) {
              minLeft = itemLeft + 1;
            }
            if (
              Math.floor(item / COLS) === Math.floor(cell / COLS) &&
              itemLeft - prev.width >= cellLeft &&
              maxLeft >= itemLeft - prev.width &&
              elements[id].pos.left <= itemLeft - prev.width
            ) {
              maxLeft = itemLeft - prev.width;
            }
          });
        }
        leftNew =
          leftNew < minLeft ? minLeft : leftNew > maxLeft ? maxLeft : leftNew;
        objTemp = { ...prev, left: { [id]: leftNew } };
      }
      // const test = elements.filter((item, index) => {
      //   console.log(id, index);
      //   return +id !== index;
      // });
      // console.log(test);
      // const { pos, size } = elements[id];
      // if (pos.left > leftNew) {
      //   const arrTest = test.reduce(
      //     (prev, cur, index) => [
      //       ...prev,
      //       ...(index ? elementCell(index, test) : []),
      //     ],
      //     elementCell(0)
      //   );
      //   const cellTemp = [];
      //   for (let i = 0; i < prev.height; i++) {
      //     for (let j = 0; j < prev.width; j++) {
      //       cellTemp.push((prev.top[id] + i) * COLS + prev.left[id] + j);
      //     }
      //   }
      //   console.log(arrTest, cellTemp, Math.floor(leftNew));

      // const arrSort = [
      //   ...arrTest,
      //   ...cellTemp.map((item) => Math.floor(item)),
      // ];

      // console.log(arrSort);

      //   const check = arrTest;
      //   return objTemp;
      // }
      return objTemp;
      // setElements((prevEle) => {
      //   const prevElement = JSON.parse(JSON.stringify([...prevEle]));
      //   const arrElement = [...prevEle];
      //   const { top, left } = arrElement[id].pos;
      //   const { width, height } = arrElement[id].size;
      //   const maxTop = ROWS - 1 * height;
      //   const maxLeft = COLS - 1 * width;

      //   let posNew = { ...arrElement[id].pos };
      //   if (!prev.isHor) {
      //     let topNew = prev.top[id] + valueY / sizeCell.edge;
      //     posNew = {
      //       ...posNew,
      //       top: topNew < 0 ? 0 : topNew > maxTop ? maxTop : topNew,
      //     };
      //   } else {
      //     let leftNew = prev.left[id] + valueX / sizeCell.edge;
      //     posNew = {
      //       ...posNew,
      //       left: leftNew < 0 ? 0 : leftNew > maxLeft ? maxLeft : leftNew,
      //     };
      //   }
      //   arrElement[id].pos = posNew;

      //   const arr = arrElement.reduce(
      //     (prev, cur, index) => [...prev, ...(index ? elementCell(index) : [])],
      //     elementCell(0)
      //   );

      //   const test = arr.map((item) =>
      //     item < Math.round(item) ? Math.trunc(item) : Math.ceil(item)
      //   );
      //   console.log(test);
      //   const checkDuplicated = test.some(
      //     (item, index) => test.indexOf(item) !== index
      //   );

      //   // console.log(checkDuplicated);

      //   return checkDuplicated ? prevElement : arrElement;
      // });
      return prev;
    });
  };

  const onStart = (ev, { top, left }, { width, height }) => {
    ev.stopPropagation();
    const { clientY, clientX } = ev.touches[0];
    const { id } = ev.target;
    setTemp({
      x: clientX,
      y: clientY,
      top: { [id]: top },
      left: { [id]: left },
      width,
      height,
    });
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
    setNotify((prev) => {
      if (!prev) toggleDialog();
      localStorage.setItem(
        "puzzle",
        JSON.stringify({
          level: level,
        })
      );
      return false;
    });
  };

  const nextLevel = (_, value) => {
    if (value === level) return;
    setNotify(false);
    setLevel((prev) => {
      const newLevel = value ?? prev + 1;
      const levelPuzzle = JSON.parse(JSON.stringify(LEVEL_PUZZLE[newLevel]));
      setElements(levelPuzzle);
      localStorage.setItem(
        "puzzle",
        JSON.stringify({
          level: newLevel,
        })
      );
      return newLevel;
    });
  };

  const selectLevel = (ev) => {
    const value = +ev.target.value;
    setLevelTemp(value);
  };

  const toggleOpenMenu = () => {
    setOpenMenu((prev) => {
      if (!prev) setLevelTemp(level);
      return !prev;
    });
  };

  const changeLevel = () => {
    nextLevel(null, levelTemp);
    toggleOpenMenu();
  };

  return (
    <div className="flex flex-col flex-1 gap-4 justify-evenly relative">
      <div className="absolute w-full top-0 -mt-[52px] right-0">
        <div className="flex items-center justify-between">
          <p></p>
          <h3 className="pl-20 text-phudu font-bold">Giải đố</h3>
          <div className="flex gap-2">
            <Button
              onClick={toggleOpenMenu}
              className="bg-tertiary text-white p-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            </Button>
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
                  top: (temp?.top[index] ?? pos?.top) * sizeCell.edge,
                  left: (temp?.left[index] ?? pos?.left) * sizeCell.edge,
                  width: `${widthCell(width)}px`,
                  height: `${heightCell(height)}px`,
                }}
                onTouchStart={(ev) => onStart(ev, pos, { width, height })}
                onTouchMove={onMove}
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
        className={`flex justify-between gap-4 ${
          !notify ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        <Button
          onClick={retryGame}
          className="px-4 py-2 text-2xl w-full font-semibold rounded-lg bg-accent/90 text-white"
        >
          Chơi lại
        </Button>
        <Button
          onClick={nextLevel}
          className={`px-4 py-2 text-2xl w-full font-semibold rounded-lg bg-tertiary/90 text-white ${
            level < Object.keys(LEVEL_PUZZLE).length - 1 ? "" : "hidden"
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
      <Dialog
        open={openMenu}
        classDialog={"h-screen max-w-[100vw] m-0 rounded-none"}
      >
        <div className="flex flex-col h-full w-[380px] px-4 mx-auto text-center justify-between text-phudu">
          <h3>Menu</h3>
          <div className="h-full w-full my-4 px-2 overflow-auto">
            <div className="grid grid-cols-4 w-full gap-4 items-center mx-auto">
              {Object.keys(LEVEL_PUZZLE).map((item) => (
                <Radio
                  key={item}
                  id={"level_" + item}
                  checked={levelTemp === +item}
                  value={item}
                  onChange={selectLevel}
                  className="!w-full"
                  classLabel="!justify-center py-[30%]"
                  name="level"
                >
                  <p className="text-3xl">{+item + 1}</p>
                </Radio>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={changeLevel}
              className="px-4 py-2 text-lg font-semibold w-full mx-auto rounded-lg bg-tertiary/80 text-white"
            >
              Đồng ý
            </Button>
            <Button
              onClick={toggleOpenMenu}
              className="px-4 py-2 text-lg font-semibold w-full mx-auto rounded-lg bg-quaternary/80 text-white"
            >
              Hủy
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
