import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import $ from "jquery";
import "jquery-mask-plugin";
import { CiUser } from "react-icons/ci";
import logo from "/assets/logo.png";

import { BiSend } from "react-icons/bi";

function RecuperarConta() {
   const location = useLocation();
   $(() => {
      $(".TOTP").mask("000 000");
   });
   const state = location.state;

   const stateUser = state ? (state.user as string) : "";
   const [user, setUser] = useState<string>("");
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [totp, setTotp] = useState<string>("");
   const [modalSuccess, setModalSuccess] = useState<boolean>(false);

   const solicitarSenhaNova = () => {
      setIsLoading(true);

      axios
         .post("https://api.binbank.com.br/recuperar-conta", {
            user: user,
            totp: totp,
         })
         .then(() => {
            setModalVisible(false);
            setModalSuccess(true);
         })
         .catch((err) => {
            console.error(err);
            toast.error(err.response.data.status || "Ocorreu um erro");
         })
         .finally(() => {
            setIsLoading(false);
         });
   };

   return (
      <>
         <ToastContainer />
         {modalSuccess && (
            <dialog className="z-20 bg-[var(--background-secound-color)] backdrop-blur-xl flex justify-center items-center lg:bg-transparent h-full w-full absolute py-20 top-0 overflow-y-auto">
               <div className="flex flex-col max-w-4xl   items-center justify-center bg-[var(--background-secound-color)] lg:border-2 border-[var(--border-color2)]">
                  <div className="flex w-full text-[var(--title-primary-color)] items-center justify-between px-4 py-6 border-b border-[var(--border-color2)]">
                     <span className="text-[18px] font-semibold">
                        E-mail enviado
                     </span>
                  </div>

                  <div className="w-full flex flex-col items-center ">
                     <div className="w-[90%] flex flex-col py-4 gap-4 border-b-2 border-[var(--border-color)] ">
                        <span className=" text-[var(--title-primary-color)] text-[18px] font-semibold">
                           Informamos que sua senha foi trocada com sucesso. A
                           nova senha foi enviada para o e-mail cadastrado em
                           sua conta. Por favor, verifique sua caixa de entrada
                           e a pasta de spam para localizar o e-mail.
                        </span>
                        <span className="text-[15px] text-[var(--title-primary-color)]">
                           Se você tiver qualquer dúvida ou precisar de mais
                           informações, entre em contato com a nossa equipe de
                           suporte.
                        </span>

                        <div className="flex">
                           <NavLink
                              to="/login"
                              className="flex w-[full] gap-2 cursor-pointer items-center text-[#2c80ff]"
                           >
                              <IoMdArrowRoundBack /> Voltar
                           </NavLink>
                        </div>
                     </div>
                     <div className="w-[90%] flex justify-end py-5 gap-4">
                        <a
                           href="https://wa.me/+551151984043"
                           target="_blank"
                           className=" transition flex gap-2 items-center justify-center h-10 hover:text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-transparent hover:bg-[var(--primary-color)] border-2 border-[var(--primary-color)] hover:border-2 text-[var(--primary-color)]"
                        >
                           {isLoading ? "carregando..." : "Suporte"}
                        </a>
                        <NavLink
                           to="/login"
                           className=" transition flex gap-2 items-center justify-center h-10 text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-[var(--primary-color)] hover:bg-transparent hover:border-[var(--primary-color)] hover:border-2 hover:text-[var(--primary-color)]"
                        >
                           {isLoading ? "carregando..." : "Entendido"}
                        </NavLink>
                     </div>
                  </div>
               </div>
            </dialog>
         )}
         {modalVisible && (
            <dialog className="z-20  flex justify-center items-center bg-gray-200  h-full w-full absolute py-20 top-0 overflow-y-auto">
               <div className=" flex justify-center items-center ">
                  <div className="min-[500px]:rounded-xl flex shadow-lg flex-col bg-white  ">
                     <div className="flex py-5 px-5 pb-4">
                        <button
                           onClick={() => {
                              setModalVisible(false);
                           }}
                           className="flex border rounded-lg border-t-transparent border-r-transparent border-l-transparent  border-b-[#1849c0] transtion hover:border-[#1849c0] hover:text-[#1849c0]  py-1.5  items-center gap-1 text-gray-800 text-sm  px-5 font-semibold hover:opacity-80 transition duration-300"
                        >
                           <IoMdArrowRoundBack />
                           Voltar
                        </button>
                     </div>
                     <form
                        onSubmit={(e) => {
                           e.preventDefault();
                           solicitarSenhaNova();
                        }}
                        className="flex flex-col max-[500px]:h-[calc(100vh-72px)] justify-center py-20 px-10"
                     >
                        <div className="flex gap-4 flex-col  justify-center items-center ">
                           <span className=" text-center w-[80%] mb-5 text-[#000000] font-semibold ">
                              Digite o código de 6 dígitos fornecido pelo seu
                              GOOGLE AUTHENTICATOR
                           </span>
                           <input
                              className="TOTP no-arrows w-[70%] py-2 px-4 rounded-full bg-gray-200 appearance-none"
                              type="text"
                              placeholder="000 000"
                              required
                              onInput={(e) => {
                                 setTotp(e.currentTarget.value);
                              }}
                           />
                           {isLoading ? (
                              <img
                                 src="https://i.pinimg.com/originals/72/66/03/7266036c9f3383d21730484150602f01.gif"
                                 className="w-32"
                                 alt=""
                              />
                           ) : (
                              <button>
                                 <BiSend
                                    size={30}
                                    className="hover:text-[var(--primary-color)] transition cursor-pointer"
                                 />
                              </button>
                           )}
                        </div>
                     </form>
                  </div>
               </div>
            </dialog>
         )}

         <form
            className="bg-gray-200  h-screen w-full items-center justify-center flex"
            onSubmit={(e) => {
               e.preventDefault();
               setModalVisible(true);
            }}
         >
            <div className="shadow-lg text-gray-800 bg-white  w-[1000px] rounded-lg grid lg:grid-cols-2">
               <div className="max-[1000px]:hidden  bg-[url('https://useargo.com/wp-content/uploads/2022/06/gestao-de-despesas-e-viagens-corporativas.jpg')]  bg-contain ">
                  <div className="backdrop-blur-lg w-full h-full flex justify-center items-center ">
                     <img
                        src={logo}
                        alt="b2b recuperar conta"
                        className="w-64 drop-shadow-lg"
                     />
                  </div>
               </div>
               <div className="  pl-4  flex flex-col gap-10 items-center justify-between py-10 pt-5">
                  <div className="w-full">
                     <NavLink
                        to="/login"
                        className="flex w-24 border rounded-lg border-t-transparent border-r-transparent border-l-transparent  border-b-[#1849c0] transtion hover:border-[#1849c0] hover:text-[#1849c0]  py-1.5  items-center gap-1 text-gray-800 text-sm  px-5 font-semibold hover:opacity-80 transition duration-300"
                     >
                        <IoMdArrowRoundBack />
                        Voltar
                     </NavLink>
                  </div>
                  <div className="px-[10%] flex flex-col gap-10 items-center justify-between w-full py-20">
                     <h1 className="font-bold text-2xl">Recuperar Conta</h1>
                     <div></div>
                     <div className="mt-10 flex flex-col gap-8 w-full">
                        <div className="w-full border-[var(--background-secound-color)] rounded pl-2 py-2  active:border-blue-600 hover:border-blue-600 border flex gap-3 items-center active:text-blue-border-blue-600 hover:text-blue-600 ">
                           <CiUser size={20} />
                           <input
                              type="text"
                              className="w-full bg-transparent  placeholder:active:text-blue-border-blue-600 placeholder:hover:text-blue-600 "
                              placeholder="Usuário"
                              defaultValue={stateUser}
                              autoFocus
                              required
                              onInput={(e) => {
                                 setUser(e.currentTarget.value);
                              }}
                           />
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <button
                           className="w-[200px] h-[40px] px-4 py-2 text-center text-sm font-medium rounded-full bg-[#1849c0] hover:bg-[#003366] focus:outline-none text-gray-200"
                           type="submit"
                           disabled={isLoading}
                        >
                           {isLoading ? "Entrando..." : "Continuar"}
                        </button>
                        <a
                           href=""
                           className="text-center cursor-pointer text-sm hover:text-blue-600 transition"
                        >
                           Falar com o suporte
                        </a>
                     </div>
                  </div>
                  <div className="flex justify-end text-sm opacity-50">
                     <span>é necessário ter o 2FA ativado</span>
                  </div>
               </div>
            </div>
         </form>
      </>
   );
}
export default RecuperarConta;
