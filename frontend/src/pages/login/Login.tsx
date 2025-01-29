import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setUserInfos, userInfos } from "../../redux/userInfos";
import { MdClose } from "react-icons/md";
import { CiLogin, CiUser } from "react-icons/ci";
import logo from "/assets/logo.png";
import $ from "jquery";
import "jquery-mask-plugin";
function LoginPage() {
   const navigate = useNavigate();

   const [user, setUser] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const login = () => {
      if (!password || !user || isLoading) return;

      setIsLoading(true);

      axios
         .post("http://localhost:2311/login", {
            user: user,
            password: password,
         })
         .then((res) => {
            localStorage.setItem("user", user);
            localStorage.setItem("x-access-token", res.data["x-access-token"]);
            localStorage.setItem("email", res.data.personData.email);
            localStorage.setItem("id", res.data.personData.id_logins);
            localStorage.setItem("nome", res.data.personData.nome);
            localStorage.setItem("role", res.data.personData.role);
            localStorage.setItem("cpfCnpj", res.data.personData.cpfCnpj);

            userInfos.dispatch(
               setUserInfos({
                  username: user,
                  role: res.data.role,
                  saldo: res.data.valor,
               })
            );
            navigate("/");
         })
         .catch((err) => {
            console.error(err);
            toast.error("Usuário ou senha incorretos");
         })
         .finally(() => {
            setIsLoading(false);
         });
   };

   return (
      <>
         <ToastContainer />
         {modalVisible && (
            <dialog className="z-20 bg-[var(--background-secound-color)] backdrop-blur-xl flex justify-center items-center lg:bg-transparent h-full w-full absolute py-20 top-0 overflow-y-auto">
               <div className="flex flex-col max-w-xl   items-center justify-center bg-[var(--background-secound-color)] lg:border-2 border-[var(--border-color2)]">
                  <div className="flex w-full text-[var(--title-primary-color)] items-center justify-between px-4 py-6 border-b border-[var(--border-color2)]">
                     <span className="text-[18px] font-semibold">
                        Recuperar Senha
                     </span>
                     <div
                        className="cursor-pointer"
                        onClick={() => {
                           setModalVisible(false);
                        }}
                     >
                        <MdClose className="text-[26px] " />
                     </div>
                  </div>

                  <div className="w-full flex flex-col items-center ">
                     <div className="w-[90%] flex flex-col py-4 gap-4 border-b-2 border-[var(--border-color)] ">
                        <span className=" text-[var(--title-primary-color)] text-[18px] font-semibold">
                           Clique no botão abaixo para ser redirecionado pra
                           nosso Whatsapp ou Clique em recuperar conta
                        </span>
                        <span className="text-[15px] text-[var(--title-primary-color)]">
                           Pediremos algumas informações para confirmar sua
                           identidade
                        </span>

                        <div className="flex">
                           <div
                              onClick={() => {
                                 setModalVisible(false);
                              }}
                              className="flex w-[full] gap-2 cursor-pointer items-center text-[#2c80ff]"
                           >
                              <IoMdArrowRoundBack /> Voltar
                           </div>
                        </div>
                     </div>
                     <div className="w-[90%] flex justify-between py-5 gap-4 ">
                        <a
                           href="https://wa.me/+551151984043"
                           target="_blank"
                           className=" transition flex gap-2 items-center justify-center h-10 hover:text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-transparent hover:bg-[var(--primary-color)] border-2 border-[var(--primary-color)] hover:border-2 text-[var(--primary-color)]"
                        >
                           {isLoading ? "carregando..." : "Suporte"}
                        </a>
                        <NavLink
                           state={{ user: user }}
                           to="/recuperar-conta"
                           className=" transition flex gap-2 items-center justify-center h-10 text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-[var(--primary-color)] hover:bg-transparent hover:border-[var(--primary-color)] hover:border-2 hover:text-[var(--primary-color)]"
                        >
                           {isLoading ? "carregando..." : "Recuperar Conta"}
                        </NavLink>
                     </div>
                  </div>
               </div>
            </dialog>
         )}
         <form
            className="min-[1000px]:bg-gray-200 w-full items-center py-5 justify-center flex "
            onSubmit={(e) => {
               e.preventDefault();
               login();
            }}
         >
            <div className="min-[1000px]:shadow-lg text-gray-800 bg-white  w-[160vh] rounded-lg grid lg:grid-cols-2 h-[90vh]">
               <div className="max-[1000px]:hidden  bg-[url('/assets/business-people-office.jpg')]  bg-cover bg-no-repeat rounded-l-lg h-[90vh]"></div>
               <div className="  flex flex-col gap-10 items-center justify-between py-10 ">
                  <div></div>
                  <div className="flex flex-col gap-6 items-center justify-between w-full ">
                     <img
                        src={logo}
                        alt="b2b login"
                        className="w-32 drop-shadow-lg"
                     />
                     <div></div>
                     <div className="mt-10 flex  flex-col w-[80%] gap-5">
                        <div className="w-full border-[var(--background-secound-color)] rounded pl-2 py-2  active:border-blue-600 hover:border-blue-600 border flex gap-3 items-center active:text-blue-border-blue-600 hover:text-blue-600 ">
                           <CiUser size={20} />
                           <input
                              type="text"
                              className="w-full bg-transparent  placeholder:active:text-blue-border-blue-600 placeholder:hover:text-blue-600 "
                              placeholder="Usuário"
                              autoFocus
                              onInput={(e) => {
                                 setUser(e.currentTarget.value);
                              }}
                           />
                        </div>
                        <div className="w-full border-[var(--background-secound-color)] rounded pl-2 py-2  active:border-blue-600 hover:border-blue-600 border flex gap-3 items-center active:text-blue-border-blue-600 hover:text-blue-600 ">
                           <CiUser size={20} />
                           <input
                              className="w-full bg-transparent  placeholder:active:text-blue-border-blue-600 placeholder:hover:text-blue-600 "
                              type="password"
                              placeholder="********"
                              autoComplete="current-password"
                              onInput={(e) => {
                                 setPassword(e.currentTarget.value);
                              }}
                           />
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <button
                           className="w-[200px] h-[40px] px-4 py-2 text-center text-sm font-medium  rounded-full bg-[#1849c0] hover:bg-[#003366] focus:outline-none text-gray-200"
                           type="submit"
                           disabled={isLoading}
                        >
                           {isLoading ? "Entrando..." : "Entrar"}
                        </button>
                        {/* <span
                              onClick={() => {
                                 setModalVisible(true);
                              }}
                              className="text-center cursor-pointer text-sm hover:text-blue-600 transition"
                           >
                              Esqueci minha senha
                           </span> */}
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <span className="flex text-sm">
                        Ainda não tem uma conta?
                        <NavLink
                           className="ml-2 text-[var(--primary-color)] hover:opacity-80 transition"
                           to="/abertura-de-contas"
                        >
                           Clique aqui!
                        </NavLink>
                     </span>
                  </div>
               </div>
            </div>
         </form>
      </>
   );
}
export default LoginPage;
