import { useEffect, useState } from "react";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import Radio from "../components/Radio";

const RINGS = [
  {
    order: 1,
    styles: "order-1 w-28 h-8 ",
    stylesTopView: "w-20 h-20 z-40",
    color: "bg-tertiary",
  },
  {
    order: 2,
    styles: "order-2 w-44 h-8",
    stylesTopView: "w-32 h-32 z-30",
    color: "bg-primary",
  },
  {
    order: 3,
    styles: "order-3 w-60 h-8",
    stylesTopView: "w-44 h-44 z-20",
    color: "bg-quaternary",
  },
  {
    order: 4,
    styles: "order-4 w-72 h-8",
    stylesTopView: "w-56 h-56 z-10",
    color: "bg-accent/90",
  },
];

const LEVEL_RING = [3, 4];

export default function SortPage() {
  const [towers, setTowers] = useState({ 0: [], 1: [], 2: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [openRing, setOpenRing] = useState(false);
  const [notify, setNotify] = useState(false);
  const [isTopView, setIsTopView] = useState(false);

  const [tempRing, setTempRing] = useState(null);

  const [selected, setSelected] = useState(null);
  const [ringNumber, setRingNumber] = useState();

  useEffect(() => {
    const sortLocal = localStorage.getItem("sort");
    if (!sortLocal) {
      setRingNumber(LEVEL_RING[0]);
      resetTowers(LEVEL_RING[0]);
    } else {
      const data = JSON.parse(sortLocal);
      setTowers((prev) => {
        setRingNumber(data.ringNumber);
        setIsTopView(data.isTopView);
        return data.towers;
      });
    }
  }, []);

  const resetTowers = (number) => {
    setTowers((prev) => {
      const obj = { 0: [], 1: [], 2: [] };
      obj[0] = RINGS.slice(0, number ?? ringNumber);
      setLocalStorage({ towers: obj, ringNumber: number ?? ringNumber });
      return obj;
    });
  };

  const clickTower = (ev, id, item) => {
    ev.preventDefault();
    if (!item.length && selected === null) return;
    if (selected === id) {
      setSelected(null);
      return;
    }
    if (selected === null) {
      setSelected(id);
    } else {
      setTowers((prev) => {
        const obj = { ...prev };
        const objFirst = obj[selected].slice(0, 1);
        setSelected(null);
        if (!(obj[id].length && obj[id]?.[0].order < objFirst?.[0].order)) {
          obj[selected].splice(0, 1);
          obj[id] = [...objFirst, ...obj[id]].sort((a, b) => a.order - b.order);
        }
        setLocalStorage({
          towers: obj,
          ringNumber: ringNumber,
          isTopView: false,
        });

        return obj;
      });
    }
  };

  useEffect(() => {
    if (towers[2].length === ringNumber) {
      toggleOpenRing();
      setNotify(true);
    }
  }, [towers]);

  const setLocalStorage = ({ towers, ringNumber, isTopView }) => {
    const sortLocal = localStorage.getItem("sort");
    localStorage.setItem(
      "sort",
      JSON.stringify({
        ...(sortLocal ? JSON.parse(sortLocal) : {}),
        ...(towers ? { towers } : {}),
        ...(ringNumber ? { ringNumber } : {}),
        ...(isTopView ? { isTopView } : {}),
      })
    );
  };

  const retryGame = () => {
    setSelected(null);
    setNotify(false);
    resetTowers();
    setOpenDialog(false);
  };

  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const toggleOpenRing = () => {
    setNotify(false);
    setOpenRing((prev) => {
      setTempRing(!prev ? ringNumber : null);
      return !prev;
    });
  };

  const changeTempRing = (ev) => {
    const value = +ev.target.value;
    setTempRing(value);
  };

  const changeRing = () => {
    if (tempRing !== ringNumber || notify) {
      setRingNumber(tempRing);
      setLocalStorage({ ringNumber: tempRing });
      resetTowers(tempRing);
      setSelected(null);
    }
    toggleOpenRing();
  };

  const toggleView = () => {
    setIsTopView((prev) => {
      setLocalStorage({ isTopView: !prev });
      return !prev;
    });
  };

  return (
    <div className="flex flex-1 relative">
      <div className="absolute w-full top-0 -mt-[52px] right-0">
        <div className="flex items-center justify-between">
          <div className="pl-11">
            <Button
              onClick={toggleView}
              className="bg-primary text-white p-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-7 h-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
          </div>
          <h3 className="text-phudu font-bold">Tháp Hà Nội</h3>
          <div className="flex gap-2">
            <Button
              onClick={toggleOpenRing}
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
      <div className="flex flex-1 flex-col gap-8 items-center relative">
        {Object.values(towers).map((item, index) => (
          <Button
            key={index}
            onClick={(ev) => clickTower(ev, index, item)}
            className={
              isTopView
                ? "flex flex-1 w-full items-center justify-center relative"
                : "flex flex-1 flex-col justify-end items-center"
            }
          >
            {ringNumber &&
              item.map((ele, indexEle) => (
                <div
                  key={ele.order}
                  style={
                    indexEle === 0 && selected === index
                      ? isTopView
                        ? { border: "4px solid white" }
                        : { marginBottom: "8px" }
                      : {}
                  }
                  className={
                    isTopView
                      ? `${ele.stylesTopView} ${ele.color} rounded-3xl absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 shadow-md`
                      : `${ele.styles} ${ele.color} rounded-lg`
                  }
                ></div>
              ))}
            {isTopView ? (
              <div className="flex h-full bg-white justify-center relative">
                <div className="absolute bg-white w-8 h-8 rounded-xl z-[45] top-1/2 -translate-y-1/2"></div>
                <div className="flex w-80 bg-accent/20 rounded-3xl bottom-full z-0"></div>
              </div>
            ) : (
              <div className="order-last flex bg-white justify-center relative">
                <div className="w-80 h-8 bg-accent/20 rounded-lg"></div>
                <div className="absolute w-8 h-48 bg-accent/20 rounded-t-lg bottom-full -mb-8 -z-10"></div>
              </div>
            )}
          </Button>
        ))}
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
            className="px-4 py-2 text-2xl font-semibold w-full mx-auto rounded-lg bg-quaternary/80 text-white"
          >
            Đóng
          </Button>
        </div>
      </Dialog>
      <Dialog open={openRing} classDialog={"!max-w-[280px]"}>
        <div className="flex flex-col h-[220px] w-[200px] m-auto text-center justify-evenly text-phudu">
          {notify && (
            <>
              <h3 className="text-3xl text-brand-gradient font-bold">
                Chúc mừng
              </h3>
              <h3 className="text-xl text-accent font-bold">
                Bạn có muốn tiếp tục chơi?
              </h3>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 w-max m-auto">
            {LEVEL_RING.map((item) => (
              <Radio
                key={item}
                onChange={changeTempRing}
                id={item}
                name="rings"
                checked={tempRing === item}
                value={item}
              >
                {item}
              </Radio>
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              onClick={changeRing}
              className="px-4 py-2 text-lg font-semibold w-full mx-auto rounded-lg bg-tertiary/80 text-white"
            >
              Đồng ý
            </Button>
            <Button
              onClick={toggleOpenRing}
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
