import { useEffect, useState } from "react";
import Dialog from "../components/Dialog";
import Button from "../components/Button";

export default function MainPage() {
  const maxRow = 10;
  const arrGuess = Object.assign({}, [
    ...new Array(maxRow).fill({ guess: [], number: "", position: "" }),
  ]);
  const [data, setData] = useState(arrGuess);
  const [number, setNumber] = useState([...Array(maxRow).keys()]);
  const [guessing, setGuessing] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(0);
  const [finished, setFinished] = useState(null);
  const [finalGuess, setFinalGuess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem("guess"));

    if (!dataLocal) randomNumberInRange();
    else {
      if (
        dataLocal.data[dataLocal.currentGuess]?.position ===
        dataLocal.finalGuess.length
      )
        retryGame();
      else {
        setData(dataLocal.data);
        setCurrentGuess(dataLocal.currentGuess);
        setFinalGuess(dataLocal.finalGuess);
      }
    }
  }, []);

  const randomNumberInRange = (rowNumber = 4) => {
    let guess = "";
    const arr = [...Array(maxRow).keys()];
    for (let i = 0; i < rowNumber; i++) {
      const test = Math.floor(Math.random() * 10 - i);
      guess = guess + arr.splice(test, 1).join("").toString();
    }
    console.log(guess);
    setFinalGuess(guess);
  };

  const enterNumber = (ev) => {
    ev.preventDefault();
    if (guessing.includes(ev.target.value)) return;
    if (guessing.length < 4) setGuessing((prev) => [...prev, ev.target.value]);
  };

  const deleteNumber = (ev) => {
    ev.preventDefault();
    if (guessing.length > 0)
      setGuessing((prev) => prev.slice(0, prev.length - 1));
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (guessing.length !== finalGuess.length) return;
    const objGuess = {
      guess: guessing,
      number: guessing.reduce(
        (accumulator, currentValue) =>
          accumulator + (finalGuess.includes(currentValue) ? 1 : 0),
        0
      ),
      position: guessing.reduce(
        (accumulator, currentValue, index) =>
          accumulator + (finalGuess[index] === currentValue ? 1 : 0),
        0
      ),
    };

    const dataTemp = { ...data };
    dataTemp[currentGuess] = objGuess;
    setData(() => {
      saveLocal({ data: dataTemp });
      return dataTemp;
    });
    checkGuess(dataTemp);
  };

  const saveLocal = ({ data, currentGuess }) => {
    const dataLocal = JSON.parse(localStorage.getItem("guess"));

    localStorage.setItem(
      "guess",
      JSON.stringify({
        ...dataLocal,
        ...(finalGuess && { finalGuess }),
        ...(currentGuess && { currentGuess }),
        ...(data && { data }),
      })
    );
  };

  const checkGuess = (dataTemp) => {
    if (dataTemp[currentGuess].position === finalGuess.length)
      setFinished(true);
    else if (currentGuess === maxRow - 1) setFinished(false);
    else {
      setCurrentGuess((prev) => {
        const value = prev + 1;
        saveLocal({ currentGuess: value });
        return value;
      });
      setGuessing([]);
    }
  };

  const retryGame = () => {
    setData(arrGuess);
    randomNumberInRange();
    setFinished(null);
    setCurrentGuess(0);
    setGuessing([]);
    setOpenDialog(false);
    localStorage.removeItem("guess");
  };

  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-full justify-between m-auto relative">
      <div className="absolute w-full top-0 -mt-[52px] right-0">
        <div className="flex items-center justify-between">
          <p></p>
          <h3 className="pl-10 text-phudu font-bold">Đoán số</h3>
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
      <div className="h-full">
        <table className="w-full h-full text-center text-black bg-accent/10 rounded-lg">
          <thead className="text-sm">
            <tr>
              <th className="w-3/5 text-xl border border-white">
                Dự đoán của bạn
              </th>
              <th className="w-1/5 border border-white">Các số đúng</th>
              <th className="w-1/5 border border-white">Các vị trí đúng</th>
            </tr>
          </thead>
          <tbody className="border-collapse border border-white">
            {Object.values(data).map(({ guess, number, position }, index) => (
              <tr key={index} className="h-[10%]">
                <td className="border-collapse border border-white">
                  <div>{guess.join("")}</div>
                </td>
                <td className="border-collapse border border-white">
                  <div>{number}</div>
                </td>
                <td className="border-collapse border border-white">
                  <div>{position}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white">
        {finished !== null ? (
          <div className="flex flex-col gap-2 text-center h-[184px] justify-evenly pt-12">
            <h3 className="text-3xl text-brand-gradient font-bold">
              {finished ? "Chúc mừng" : "Thất bại"}
            </h3>
            <h3 className="text-3xl text-brand-gradient font-bold">
              {finalGuess}
            </h3>
            <Button
              onClick={retryGame}
              className="px-4 py-2 text-2xl font-semibold w-full w-max mx-auto rounded-lg bg-secondary/70 text-white"
            >
              Chơi lại
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center text-3xl p-2 mx-auto">
              <p className="h-9">{guessing.join("")}</p>
            </div>
            <div className="flex flex-col gap-2 w-full mx-auto">
              <div className="flex justify-stretch text-center items-center gap-2 py-2">
                {number.slice(0, 5).map((value) => (
                  <Button
                    key={value}
                    onClick={enterNumber}
                    value={value}
                    className="flex-1 bg-accent/10 rounded-md p-2"
                  >
                    {value}
                  </Button>
                ))}
                <Button
                  onClick={deleteNumber}
                  className="flex-1 bg-secondary/70 text-white rounded-md p-2 h-[46px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 m-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
                    />
                  </svg>
                </Button>
              </div>
              <div className="flex justify-stretch text-center items-center gap-2 py-2">
                {number.slice(5).map((value) => (
                  <Button
                    key={value}
                    onClick={enterNumber}
                    value={value}
                    className="flex-1 bg-accent/10 rounded-md p-2"
                  >
                    {value}
                  </Button>
                ))}
                <Button
                  onClick={onSubmit}
                  className="flex-1 bg-tertiary/90 text-white rounded-md p-2 h-[46px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-7 h-7 m-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
