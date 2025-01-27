import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { clearUserInfos, userInfos } from "../../redux/userInfos";
import { IoReload } from "react-icons/io5";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import { HiEye, HiEyeOff } from "react-icons/hi";
interface info {
  pathInicial?: string;
  pathMiddle?: string;
  pathFinal?: string;
  pathAdtional?: string;
  username: string;
  saldo: string;
  reloadBalance: () => void;
  toggleHidden: () => void;
  isHidden: boolean;
}
function Header(props: info) {
  const navigate = useNavigate();

  return (
    <>
      <header className="text-[var(--title-primary-color)] bg-[var(--background-secound-color)] w-full py-6 px-[5%] flex justify-between items-center">
        <ToastContainer />
        <div className="w-full justify-between flex gap-5 items-center">
          <div className="flex gap-2">
            <div className=" flex gap-4 text-gray-200 cursor-pointer">
              <IoReload
                size={20}
                onClick={() => {
                  props.reloadBalance();
                }}
              />
              <div className="text-sm flex w-32 ">
                {props.saldo ? (
                  <span> R$ {props.isHidden ? "****" : props.saldo}</span>
                ) : (
                  <span>...</span>
                )}
              </div>
            </div>
            <div className="flex">
              {props.isHidden ? (
                <HiEyeOff
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={props.toggleHidden}
                />
              ) : (
                <HiEye
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={props.toggleHidden}
                />
              )}
            </div>
          </div>
          <div className="flex gap-3 capitalize items-center text-sm cursor-pointer max-[1000px]:hidden">
            <span>
              {props.isHidden ? "*****" : props.username || "Desconhecido"}
            </span>
          </div>
          <div className=" cursor-pointer">
            <CiLogout
              size={20}
              onClick={() => {
                localStorage.removeItem("x-access-token");
                userInfos.dispatch(clearUserInfos());
                navigate("/login");
              }}
            />
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
