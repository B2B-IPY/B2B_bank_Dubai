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
   const [a2fa, setA2fa] = useState<boolean>(false);
   const [secret, setSecret] = useState<string>("");
   const [A2FAativada, setA2FAativada] = useState<boolean>();
   const [base64, setBase64] = useState<string>("");
   const [code, setCode] = useState<string>("");
   $(() => {
      $(".TOTP").mask("000 000");
   });
   const login = () => {
      if (!password || !user || isLoading) return;

      setIsLoading(true);

      axios
         .post("https://api.noutbank.com.br/login", {
            user: user,
            password: password,
         })
         .then((res) => {
            console.log(res.data);

            if (res.data.required_2fa) {
               setA2FAativada(res.data.A2fa_Ativada);
               setBase64(res.data.qrCode);
               setSecret(res.data.new_secret);
               setA2fa(true);
               return;
            }
            localStorage.setItem("user", user);
            localStorage.setItem("x-access-token", res.data["x-access-token"]);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("cpfCnpj", res.data.cpfCnpj);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("admin", res.data.admin);

            localStorage.setItem("required_2fa", res.data.required_2fa);
            localStorage.setItem("chavePix", "");

            localStorage.setItem(
               "dadosBancarios",
               JSON.stringify(res.data.dadosBancarios)
            );
            localStorage.setItem("taxas", res.data.taxas);
            userInfos.dispatch(
               setUserInfos({
                  username: user,
                  role: res.data.role,
                  saldo: res.data.saldo / 100,
                  dadosBancarios: res.data.dadosBancarios,
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

   const login2fa = () => {
      setIsLoading(true);

      axios
         .post("https://api.noutbank.com.br/login2fa", {
            secret: secret,
            user: user,
            password: password,
            code: code,
         })
         .then((res) => {
            console.log(res.data);
            localStorage.setItem("user", user);
            localStorage.setItem("x-access-token", res.data["x-access-token"]);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("cpfCnpj", res.data.cpfCnpj);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("admin", res.data.admin);
            localStorage.setItem("required_2fa", res.data.required_2fa);
            localStorage.setItem(
               "dadosBancarios",
               JSON.stringify(res.data.dadosBancarios)
            );
            localStorage.setItem("taxas", res.data.taxas);
            userInfos.dispatch(
               setUserInfos({
                  username: user,
                  role: res.data.role,
                  saldo: res.data.saldo / 100,
                  dadosBancarios: res.data.dadosBancarios,
               })
            );
            navigate("/");
         })
         .catch((err) => {
            console.error(err);
            toast.error("Codigo invalido");
         })
         .finally(() => {
            setTimeout(() => {
               setIsLoading(false);
            }, 1000);
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
         {!a2fa ? (
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
         ) : (
            <div className="bg-gray-200 w-full flex justify-center items-center shadow">
               {!A2FAativada ? (
                  <div className="flex max-[1000px]:w-[80%] flex-col bg-white p-5 max-[500px]:h-full max-[500px]:w-full min-[500px]:rounded-xl ">
                     <div className="flex pb-4">
                        <button
                           onClick={() => {
                              setA2fa(false);
                           }}
                           className="flex border rounded-lg border-t-transparent border-r-transparent border-l-transparent  border-b-[#1849c0] transtion hover:border-[#1849c0] hover:text-[#1849c0]  py-1.5  items-center gap-1 text-gray-800 text-sm  px-5 font-semibold hover:opacity-80 transition duration-300"
                        >
                           <IoMdArrowRoundBack />
                           Voltar
                        </button>
                     </div>
                     <div className="flex flex-col h-full max-[600px]:justify-center">
                        <div className="flex py-4 flex-col gap-6 items-center">
                           <img src={base64} alt="" />
                        </div>
                        <div className="flex gap-4 flex-col rounded-r-xl justify-center items-center ">
                           <span className=" min-[500px]:w-[80%] text-center mb-5 text-[#000000] font-semibold">
                              Leia o QR Code com o Google Authenticator e
                              coloque o codigo abaixo para ativar a autenticação
                              de dois fatores
                           </span>
                           <input
                              className="w-[70%] py-2 px-4 rounded-full bg-gray-200 required"
                              type="text"
                              placeholder="000000"
                              required
                              onInput={(e) => {
                                 setCode(e.currentTarget.value);
                              }}
                           />
                           <button
                              onClick={() => {
                                 setIsLoading(true);
                                 axios
                                    .post(
                                       "https://api.noutbank.com.br/secret/set",
                                       {
                                          user: user,
                                          password: password,
                                          code: code,
                                          new_secret: secret,
                                       }
                                    )
                                    .then((res) => {
                                       const token = res.data.token;
                                       localStorage.setItem(
                                          "x-access-token",
                                          token
                                       );
                                       toast.success(
                                          "Autenticação de dois fatores ativada com sucesso!"
                                       );

                                       setA2fa(false);
                                    })
                                    .catch((err) => {
                                       console.error(err);
                                       toast.error(
                                          "Problemas ao ativar a autenticação de dois fatores"
                                       );
                                    })
                                    .finally(() => {
                                       setIsLoading(false);
                                    });
                              }}
                              className="w-[70%] bg-[#1849c0] rounded-full py-2 text-white font-semibold"
                           >
                              {!isLoading ? "Confirmar" : "Carregando..."}
                           </button>
                           <span className="text-sm min-[500px]:w-[80%] text-center mt-5 text-[#000000] font-semibold">
                              Baixar Google Authenticator
                           </span>
                           <div className="flex items-center gap-2 ">
                              <div className="flex flex-col h-[90px] justify-between">
                                 <a
                                    href="https://apps.apple.com/br/app/google-authenticator/id388497605"
                                    target="_blank"
                                 >
                                    <img
                                       src="/assets/app-store.svg"
                                       alt=""
                                       className="w-[60px] cursor-pointer hover:opacity-70 transition"
                                    />
                                 </a>
                                 <span className="text-center">IOS</span>
                              </div>
                              <div className="flex flex-col h-[90px] items-center justify-between">
                                 <a
                                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pcampaignid=web_share"
                                    target="_blank"
                                 >
                                    <img
                                       src="/assets/play-store.svg"
                                       alt=""
                                       className="w-[50px] mt-1 cursor-pointer hover:opacity-70 transition"
                                    />
                                 </a>
                                 <span className="">Android</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="flex shadow-lg flex-col bg-white min-[500px]:rounded-xl shadow">
                     <div className="flex py-5 px-5 pb-4">
                        <button
                           onClick={() => {
                              setA2fa(false);
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
                           login2fa();
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
                              onInput={(e) => {
                                 setCode(e.currentTarget.value);
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
                                 <CiLogin
                                    size={30}
                                    className="hover:text-[var(--primary-color)] transition cursor-pointer"
                                 />
                              </button>
                           )}
                        </div>
                     </form>
                  </div>
               )}
            </div>
         )}
      </>
   );
}
export default LoginPage;
