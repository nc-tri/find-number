import { useState } from "react";
import { Link } from "react-router-dom";
import Dialog from "./Dialog";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [openRule, setOpenRule] = useState(false);
  const toggleDialog = () => {
    setOpen((prev) => !prev);
  };

  const toggleDialogRule = () => {
    setOpenRule((prev) => !prev);
  };

  return (
    <div className="flex text-phudu z-50">
      <button
        onClick={toggleDialog}
        className="justify-center bg-black/50 rounded-full p-1 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 m-auto"
        >
          <path
            fillRule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Dialog open={open}>
        <div className="flex gap-4 justify-between">
          <button
            className={`p-4 text-2xl font-semibold rounded-lg ${
              true ? "bg-primary/90" : "bg-quaternary/80"
            } text-white`}
          >
            {true ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
              </svg>
            )}
          </button>
          <button
            className={`p-4 text-2xl font-semibold rounded-lg ${
              true ? "bg-primary/90" : "bg-quaternary/80"
            } text-white`}
          >
            {true ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z"
                  clip-rule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM20.57" />
                <path
                  fill-rule="evenodd"
                  d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <button className="flex text-xl font-semibold rounded-lg text-white overflow-hidden">
          <p className="flex-auto p-2 bg-accent/80">Ban đêm</p>
          {true ? (
            <p className="flex-none p-2 bg-tertiary/90">Bật</p>
          ) : (
            <p className="flex-none p-2 bg-accent/70">Tắt</p>
          )}
        </button>
        <Link
          to={"/"}
          onClick={toggleDialog}
          className="px-4 py-2 text-xl font-semibold rounded-lg bg-secondary/80 text-white"
        >
          Trang chính
        </Link>
        <button
          onClick={toggleDialogRule}
          className="px-4 py-2 text-xl font-semibold rounded-lg bg-tertiary/90 text-white"
        >
          Cách chơi
        </button>
        <button
          onClick={toggleDialog}
          className="px-4 py-2 text-xl font-semibold rounded-lg bg-quaternary/90 text-white"
        >
          Đóng
        </button>
      </Dialog>
      <Dialog
        open={openRule}
        classDialog={"bg-black text-white px-2 border-none"}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold">Cách chơi</h3>
          <ul className="list-disc list-inside text-base font-semibold space-y-2 text-left bg-primary/50 p-2 rounded-lg">
            <li>Đoán số bí mật dựa trên sự liên quan</li>
            <li>Bạn chỉ có 10 lần đoán</li>
            <li>
              Sau khi gửi mỗi lần đoán, bạn sẽ nhận được các gợi ý liên quan của
              số đó
            </li>
            <li>Số bí mật là số có 4 chữ số không trùng nhau từ hệ thống</li>
            {/* <li>Hãy tìm còn số từ hệ thống đưa ra</li>
            <li>
              ban sẽ nhận các gợi ý con số đúng và vị trí đúng sau mỗi lần trả
              lời
            </li> */}
          </ul>
          <h3 className="text-2xl font-semibold">Ví dụ</h3>
          <div className="text-black bg-white rounded-lg overflow-hidden">
            <table className="w-full h-full text-center text-barlow bg-accent/10">
              <thead className="text-xs">
                <tr>
                  <th className="w-3/5 text-lg border border-white">
                    Dự đoán của bạn
                  </th>
                  <th className="w-1/5 border border-white">Các số đúng</th>
                  <th className="w-1/5 border border-white">Các vị trí đúng</th>
                </tr>
              </thead>
              <tbody className="border-collapse border border-white">
                <tr className="h-[10%]">
                  <td className="border-collapse border border-white">
                    <div>1234</div>
                  </td>
                  <td className="border-collapse border border-white">
                    <div>2</div>
                  </td>
                  <td className="border-collapse border border-white">
                    <div>1</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-left">
            <ul className="list-disc list-inside text-base font-semibold text-left">
              <li>Số bí mật là 7438</li>
              <li>3 và 4 là các số đúng</li>
              <li>3 là số có vị trí đúng</li>
            </ul>
          </div>
        </div>
        <button
          onClick={toggleDialogRule}
          className="px-4 py-2 text-xl font-semibold rounded-lg bg-quaternary/90 text-white"
        >
          Đóng
        </button>
      </Dialog>
    </div>
  );
}
