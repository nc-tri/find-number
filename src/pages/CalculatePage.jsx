import { useEffect, useState } from "react";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import { CALCULATE } from "../helper/constants";

export default function CalculatePage() {
  const { COLS, ROWS, NUMBER_CAL, MAX_NUMBER, TIMEOUT } = CALCULATE;
  const [selected, setSelected] = useState(
    [...new Array(NUMBER_CAL)].fill(null)
  );
  const [finalResult, setFinalResult] = useState();
  const [operation, setOperation] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [point, setPoint] = useState({ right: 0, wrong: 0 });
  const [arrNumber, setArrNumber] = useState([
    ...Array.from({ length: ROWS * COLS }, () => {
      return {
        value: "",
        isDisplay: true,
      };
    }),
  ]);

  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  const strOperation = (value) => {
    switch (value) {
      case 0:
        return "+";
    }
  };

  useEffect(() => {
    const foundEmpty = selected.findIndex((item) =>
      [undefined, null, ""].includes(item)
    );

    if (foundEmpty < 0) {
      const answer = selected.reduce(
        (prev, cur) => +prev + +arrNumber[cur]?.value,
        0
      );

      setTimeout(() => {
        const strAnswer = answer === finalResult ? "right" : "wrong";
        setPoint((prev) => {
          const { arr, final } = resetArrNumber();
          const point = { ...prev, [strAnswer]: prev[strAnswer] + 1 };
          localStorage.setItem(
            "calculate",
            JSON.stringify({
              point,
              arrNumber: arr,
              finalResult: final,
            })
          );
          return point;
        });
      }, TIMEOUT);
    }
  }, [selected]);

  useEffect(() => {
    const calculateLocal = localStorage.getItem("calculate");
    if (calculateLocal) {
      const data = JSON.parse(calculateLocal);
      setPoint((prev) => ({ ...prev, ...data.point }));
      setFinalResult((prev) => {
        setArrNumber(data.arrNumber);
        return data.finalResult;
      });
    } else {
      resetArrNumber();
    }
  }, []);

  useEffect(() => {
    resetSelected();
  }, [arrNumber]);

  const randomResult = (arrNumber) => {
    const arrIsDisplay = arrNumber.filter((item) => item.isDisplay);
    const arr = [];
    for (let i = 0; i < NUMBER_CAL; i++) {
      const random = Math.floor(Math.random() * arrIsDisplay.length);
      arr.push(arrIsDisplay.splice(random, 1)[0].value);
    }
    const finalResult = arr.reduce((prev, cur) => prev + cur, 0);
    setFinalResult(finalResult);
    return finalResult;
  };

  const resetSelected = async () => {
    setSelected([...new Array(2)].fill(null));
  };

  const resetArrNumber = () => {
    const arr = [
      ...Array.from({ length: ROWS * COLS }, () => {
        return {
          value: Math.floor(Math.random() * MAX_NUMBER),
          isDisplay: true,
        };
      }),
    ];
    setArrNumber(arr);
    const final = randomResult(arr);
    return { arr, final };
  };

  const enterNumber = (ev, { value, index }) => {
    ev.preventDefault();
    const foundEmpty = selected.findIndex((item) =>
      [undefined, null, ""].includes(item)
    );

    if (selected.includes(index)) {
      setSelected((prev) => {
        const selected = [...prev];
        const foundIndex = selected.findIndex((item) => item === index);

        selected[foundIndex] = null;
        return selected;
      });
    } else
      setSelected((prev) => {
        const selected = [...prev];
        selected[foundEmpty > 0 ? foundEmpty : 0] = index;
        return selected;
      });
  };

  const retryGame = () => {
    resetSelected();
    resetArrNumber();
    setPoint({ right: 0, wrong: 0 });
    localStorage.removeItem("calculate");
    setOpenDialog(false);
  };

  return (
    <div className="flex flex-col justify-between h-full gap-2 relative">
      <div className="absolute w-full top-0 -mt-[52px] right-0">
        <div className="flex items-center justify-between">
          <p></p>
          <h3 className="pl-10 text-phudu font-bold">Phép tính</h3>
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
      <div className="flex justify-center text-4xl font-semibold py-4 ">
        <div className="flex gap-2 justify-center text-center relative">
          <p className="text-tertiary w-10">
            {arrNumber[selected[0]]?.value ?? "_"}
          </p>
          <p>{strOperation(operation)}</p>
          <p className="text-tertiary w-10">
            {arrNumber[selected[1]]?.value ?? "_"}
          </p>
          <p>=</p>
          <p className="text-brand-gradient w-10">{finalResult ?? "?"}</p>
        </div>
      </div>
      <div className={`grid grid-cols-${COLS ?? 4} gap-2`}>
        {arrNumber.map((item, index) => (
          <div key={index}>
            <Button
              onClick={(ev) => enterNumber(ev, { value: item, index })}
              disabled={["", null, undefined].includes(item.value)}
              className={`p-2 w-full disabled:pointe-events-none h-[52px] text-2xl border-2 border-accent/10 font-semibold rounded-lg ${
                item.isDisplay
                  ? selected.includes(index)
                    ? "bg-tertiary/80 text-white"
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
    </div>
  );
}
