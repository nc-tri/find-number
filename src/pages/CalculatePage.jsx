import { useEffect, useState } from "react";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Dialog from "../components/Dialog";
import { CALCULATE } from "../helper/constants";

const OPERATIONS = [
  {
    id: "plus",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    ),
  },
  {
    id: "minus",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
      </svg>
    ),
  },
  {
    id: "multiply",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  {
    id: "divide",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
        />
      </svg>
    ),
  },
];

export default function CalculatePage() {
  const { COLS, ROWS, NUMBER_CAL, SCOPE, TIMEOUT } = CALCULATE;
  const [selected, setSelected] = useState(null);
  const [operation, setOperation] = useState(["plus"]);
  const [tempOperation, setTempOperation] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openOperation, setOpenOperation] = useState(false);
  const [point, setPoint] = useState({ right: 0, wrong: 0 });
  const [notify, setNotify] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentOperation, setCurrentOperation] = useState("plus");
  const [arrNumber, setArrNumber] = useState([
    ...Array.from({ length: ROWS * COLS }, () => {
      return {
        value: "",
        isDisplay: true,
      };
    }),
  ]);

  const [calculationNumber, setCalculationNumber] = useState([]);

  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const strOperation = (value) => {
    return OPERATIONS.find((item) => item.id === value).svg;
  };

  // useEffect(() => {
  //   resetArrNumber();
  // }, []);

  const resetArrNumber = () => {
    const arr = [
      ...Array.from({ length: ROWS * COLS }, () => {
        return {
          value: Math.floor(Math.random() * (currentLevel * SCOPE * 2 + 1)),
          isDisplay: true,
        };
      }),
    ];
    const random = Math.floor(Math.random() * (ROWS * COLS));
    const arrCal = resetCalNumber();
    const randomOperation =
      operation[Math.floor(Math.random() * operation.length)];
    const data = finalResultOperation(randomOperation, arrCal);
    setSelected(null);

    arr[random] = { ...arr[random], value: data };
    console.log(data, arrCal, arr[random].value);
    setArrNumber(arr);
    return { arr, curOperation: randomOperation, selected: random, arrCal };
  };

  const finalResultOperation = (operation, arrCal) => {
    let data;
    switch (operation) {
      case "plus":
        data = arrCal.reduce((prev, cur) => prev + cur);
        break;
      case "minus":
        data = arrCal.reduce((prev, cur) => prev - cur);
        break;
      case "multiply":
        data = arrCal.reduce((prev, cur) => prev * cur);
        break;
      case "divide":
        data = arrCal.reduce((prev, cur) => prev / cur);
        break;
    }
    return data;
  };

  const resetCalNumber = () => {
    const arrCal = [
      ...Array.from({ length: NUMBER_CAL }, () => {
        return Math.floor(Math.random() * SCOPE * currentLevel);
      }),
    ].sort((a, b) => b - a);
    // console.log(arrCal);
    setCalculationNumber(arrCal);
    return arrCal;
  };

  const enterNumber = (ev, { value, index }) => {
    ev.preventDefault();
    setSelected(index);
  };

  useEffect(() => {
    // const arrSelected = selected.map((item) => arrNumber[item].value);
    if (selected !== null) {
      const answer = finalResultOperation(currentOperation, calculationNumber);
      setTimeout(() => {
        const strAnswer =
          answer?.toFixed(0) === arrNumber[selected].value?.toFixed(0)
            ? "right"
            : "wrong";
        const notify =
          answer?.toFixed(0) === arrNumber[selected].value?.toFixed(0)
            ? "Chính xác"
            : "Sai rồi";
        setNotify(notify);
        setPoint((prev) => {
          let level = currentLevel;
          if (prev.right >= currentLevel * SCOPE - 1) {
            level = level + 1;
            setCurrentLevel((prev) => prev + 1);
          }
          const { arr, curOperation, arrCal } = resetArrNumber();
          const point = { ...prev, [strAnswer]: prev[strAnswer] + 1 };
          setCurrentOperation(curOperation);
          localStorage.setItem(
            "logic",
            JSON.stringify({
              calculationNumber: arrCal,
              operation: operation,
              currentOperation: curOperation,
              point,
              arrNumber: arr,
              currentLevel: level,
            })
          );
          return point;
        });
      }, TIMEOUT);
    }
  }, [selected]);

  useEffect(() => {
    const calculateLocal = localStorage.getItem("logic");
    if (calculateLocal) {
      const data = JSON.parse(calculateLocal);
      setPoint((prev) => ({ ...prev, ...data.point }));
      setCurrentLevel(data.currentLevel);
      setCurrentOperation(data.currentOperation || currentOperation);
      setOperation(data.operation || operation);
      setCalculationNumber((prev) => {
        setArrNumber(data.arrNumber);
        return data.calculationNumber;
      });
    } else {
      resetArrNumber();
    }
  }, []);

  useEffect(() => {
    if (notify) setTimeout(() => setNotify(""), TIMEOUT * 2);
  }, [notify]);

  const retryGame = () => {
    resetArrNumber();
    setCurrentLevel(1);
    setPoint({ right: 0, wrong: 0 });
    localStorage.removeItem("logic");
    setOpenDialog(false);
  };

  const toggleOpenOperation = () => {
    setOpenOperation((prev) => {
      setTempOperation(!prev ? operation : []);
      return !prev;
    });
  };

  const changeOperation = () => {
    setTempOperation((prev) => {
      if (prev.length) {
        setOperation(prev);
        const calculateLocal = localStorage.getItem("logic");
        if (calculateLocal)
          localStorage.setItem(
            "logic",
            JSON.stringify({
              ...JSON.parse(calculateLocal),
              operation: prev,
            })
          );
      }
      // resetArrNumber();
      toggleOpenOperation();
      return [];
    });
  };

  const changeTempOperation = (ev) => {
    const name = ev.target.name;
    setTempOperation((prev) => {
      const arr = prev.includes(name)
        ? [...prev.filter((item) => item !== name)]
        : [...prev, name];
      return arr;
    });
  };

  return (
    <div className="flex flex-col justify-between h-full gap-2 relative">
      <div className="absolute w-full top-0 -mt-[52px] right-0">
        <div className="flex items-center justify-between">
          <p></p>
          <h3 className="pl-20 text-phudu font-bold">Phép tính</h3>
          <div className="flex gap-2">
            <Button
              onClick={toggleOpenOperation}
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
      <div className="flex flex-col gap-2 text-center">
        <table className="w-full h-full text-center text-white font-semibold rounded-lg overflow-hidden">
          <thead className="text-phudu">
            <tr>
              <th className="w-1/5 border border-white bg-primary overflow-hidden">
                Đúng
              </th>
              <th className="w-1/5 border border-white bg-quaternary">Sai</th>
            </tr>
          </thead>
          <tbody className="border-collapse border border-white">
            <tr className="h-[10%]">
              <td className="border-collapse border border-white bg-primary">
                <div>{point.right}</div>
              </td>
              <td className="border-collapse border border-white bg-quaternary">
                <div>{point.wrong}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col flex-auto justify-center text-4xl font-semibold py-4 border-2 rounded-lg">
        <div className="flex flex-col flex-1 items-center justify-center">
          <p
            className={`${
              !notify ? "text-black" : "text-white bg-secondary/70"
            } px-4 py-2 rounded-lg`}
          >
            {notify || `level ${currentLevel}`}
          </p>
        </div>
        <div className="flex flex-1 gap-2 justify-center items-center text-center relative">
          <div className="flex gap-2 justify-center items-center rounded-lg">
            <p className="text-black bg-accent/10 rounded-lg h-16 w-16 p-3">
              {calculationNumber[0] ?? ""}
            </p>
            <p>{strOperation(currentOperation)}</p>
            <p className="text-black bg-accent/10 rounded-lg h-16 w-16 p-3">
              {calculationNumber[1] ?? ""}
            </p>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </p>
            <p className="text-black bg-accent/10 rounded-lg h-16 min-w-[64px] p-3">
              {arrNumber[selected]?.value?.toFixed(0) ?? ""}
            </p>
          </div>
        </div>
      </div>
      <div className={`grid grid-cols-4 gap-2`}>
        {arrNumber.map((item, index) => (
          <div key={index}>
            <Button
              onClick={(ev) => enterNumber(ev, { value: item, index })}
              disabled={["", null, undefined].includes(item.value)}
              className={`p-2 w-full disabled:pointe-events-none h-[52px] text-2xl bg-accent/10 font-semibold rounded-lg ${
                item.isDisplay
                  ? selected === index
                    ? "bg-secondary/80 text-white"
                    : ""
                  : "invisible"
              }`}
            >
              {item?.value}
            </Button>
          </div>
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
      <Dialog open={openOperation} classDialog={"!max-w-[280px]"}>
        <div className="flex flex-col h-[240px] w-[200px] m-auto text-center justify-evenly text-phudu">
          <div className="grid grid-cols-2 gap-4 w-max m-auto">
            {OPERATIONS.map(({ id, svg }) => (
              <Checkbox
                key={id}
                id={id}
                disabled={id === "divide"}
                checked={tempOperation.includes(id)}
                onChange={changeTempOperation}
              >
                {svg}
              </Checkbox>
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              onClick={changeOperation}
              className="px-4 py-2 text-lg font-semibold w-full mx-auto rounded-lg bg-tertiary/80 text-white"
            >
              Đồng ý
            </Button>
            <Button
              onClick={toggleOpenOperation}
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
