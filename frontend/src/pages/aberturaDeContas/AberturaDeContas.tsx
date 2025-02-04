import axios from "axios";
import $ from "jquery";
import "jquery-mask-plugin";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";
import logo from "/assets/icon.png";
import { MdClose } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { validarCnpj, validarCpf } from "../../functions/validarDoc";
import { Taxas_representante } from "../../interfaces/taxas";
import { decodificarPayload } from "../../functions/payload";
import { BRLtoNumber } from "../../functions/moeda";

interface Request {
   user: string;
   nome: string;
   cpfCnpj: string;
   email: string;
   taxas_representante: Taxas_representante[];
}

function AberturaDeContas() {
   $(() => {
      $(".TEL").mask("(00) 00000-0000");
      $(".CPF").mask("000.000.000-00");
      $(".CNPJ").mask("00.000.000/0000-00");
      $(".MONEY").mask("#.##0,00", { reverse: true });
      $(".CEP").mask("00000-000");
   });

   const [representantesList, setRepresentantesList] = useState<
      Taxas_representante[]
   >([]);

   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   let paramString = queryParams.get("params");

   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [isChecked, setIsChecked] = useState<boolean>(false);
   const [modalSuccess, setModalSuccess] = useState<boolean>(false);
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [modalConfirm, setModalConfirm] = useState<boolean>(false);
   const [request, setRequest] = useState<Request>({
      user: "",
      nome: "",
      cpfCnpj: "",
      email: "",
      taxas_representante: [],
   });
   useEffect(() => {
      if (paramString) {
         paramString = paramString.trim();

         const param = decodificarPayload(paramString);
         if (param) {
            const json = JSON.parse(param);
            setRepresentantesList(json);
            setRequest((prev) => {
               return {
                  ...prev,
                  taxas_representante: json,
               };
            });
            console.log(json);
         }
      }
   }, []);

   // function criarSubconta() {
   //    console.log(request);

   //    setIsLoading(true);
   //    axios
   //       .post("https://api.binbank.com.br/accounts/criar", {
   //          user: request.user,
   //          nome: request.nome,
   //          email: request.email,
   //          cpfCnpj: request.cpfCnpj,
   //          tel: request.tel,
   //       })
   //       .then(({ data }) => {
   //          setModalConfirm(true);
   //          console.log(data);
   //          toast.success("Conta solicitada com sucesso");
   //       })
   //       .catch((err) => {
   //          console.log(err);
   //          if (err.response.data.description)
   //             return toast.error(`${err.response.data.description}`);
   //          toast.error(`Ocorreu um erro ao solicitar a abertura de conta`);
   //       })
   //       .finally(() => {
   //          setIsLoading(false);
   //       });
   // }
   return (
      <>
         <ToastContainer />
         <div className="grid min-[1000px]:grid-cols-2 w-full h-screen overflow-y-auto ">
            {modalConfirm && (
               <dialog className="z-20 bg-[var(--background-secound-color)] backdrop-blur-xl flex justify-center items-center lg:bg-transparent h-full w-full absolute py-20 top-0 overflow-y-auto">
                  <div className="flex flex-col max-w-4xl   items-center justify-center bg-[var(--background-secound-color)] lg:border-2 border-[var(--border-color2)]  max-[1000px]:border">
                     <div className="flex w-full text-[var(--title-primary-color)] items-center justify-between px-4 py-6 border-b border-[var(--border-color2)] ">
                        <span className="text-[18px] font-semibold">
                           Conta criada
                        </span>
                     </div>

                     <div className="w-full flex flex-col items-center ">
                        <div className="w-[90%] flex flex-col py-4 gap-4 border-b-2 border-[var(--border-color)] ">
                           <span className=" text-[var(--title-primary-color)] text-[18px] font-semibold">
                              Sua conta foi criada com sucesso
                           </span>
                           <span className="text-[15px] text-[var(--title-primary-color)]">
                              Sua senha de acesso foi enviada para o email{" "}
                              {request.email}
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
                              className=" transition flex gap-2 items-center justify-center h-10 text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-[var(--primary-color)] hover:bg-transparent hover:border-[var(--primary-color)] hover:border-2 hover:text-[var(--primary-color)]"
                           >
                              {isLoading ? "carregando..." : " Suporte"}
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

            <section className="max-[1000px]:hidden h-full w-full bg-cover bg-no-repeat  bg-[url('https://useargo.com/wp-content/uploads/2022/06/gestao-de-despesas-e-viagens-corporativas.jpg')]">
               <div className="w-full flex items-center justify-center backdrop-blur-sm h-full border-l-[80px] border-l-[var(--background-secound-color)] border-t-[0px] border-t-transparent border-b-[80px] rotate-180	 border-b-transparent">
                  <img
                     src={logo}
                     alt="logo"
                     className="w-60 rotate-[180deg] drop-shadow-2xl"
                  />
               </div>
            </section>
            <section className="py-10 h-full bg-[var(--background-secound-color)]">
               <div className="flex flex-col  overflow-y-scroll  items-center  w-full h-full">
                  <div className=" flex  flex-col items-center   w-full h-full">
                     <div className=" h-full  w-full flex flex-col items-center">
                        <form
                           className="flex px-[5%] justify-around flex-col items-center h-full w-full"
                           id="form"
                           onSubmit={(e) => {
                              e.preventDefault();
                              if (isLoading) return;
                              const regex = /[\s!@#$%^&*(),.?":{}|<>0-9]/;
                              if (regex.test(request.user))
                                 return toast.warning(
                                    "apenas letras são aceitas no usuario, sem espaços"
                                 );
                              setIsLoading(true);

                              axios
                                 .post(
                                    "https://api.binbank.com.br/subcontas/criar",
                                    {
                                       user: request.user,
                                       name: request.nome,
                                       email: request.email,
                                       cpfCnpj: request.cpfCnpj,
                                       taxas_representante:
                                          request.taxas_representante,
                                    }
                                 )
                                 .then(() => {
                                    toast.success(
                                       "Conta Solicitada com sucesso!"
                                    );
                                    setModalConfirm(true);
                                 })
                                 .catch((err) => {
                                    console.error(err);
                                    if (
                                       err.response.status === 403 ||
                                       err.response.status === 401
                                    )
                                       return toast.warn(
                                          "Usuario sem permissão"
                                       );
                                    if (err.response.status === 409)
                                       return toast.warn("Conta já cadastrado");
                                    toast.error(
                                       err.response.erro ||
                                          "Erro ao cadastrar Conta"
                                    );
                                 })
                                 .finally(() => {
                                    setIsLoading(false);
                                 });
                           }}
                        >
                           <h1 className="text-xl font-bold leading-tight tracking-widest   text-gray-200 md:text-2xl">
                              Abertura de Contas
                           </h1>
                           <div className="flex px-[5%] flex-col items-center text-[var(--title-primary-color)]   w-full ">
                              <div className="flex mb-5 justify-center">
                                 <span className="text-sm font-medium  mr-3">
                                    PF
                                 </span>
                                 <label className="relative inline-flex  cursor-pointer">
                                    <input
                                       type="checkbox"
                                       value=""
                                       name="checkbox"
                                       className="sr-only peer"
                                       id="checkbox"
                                       onInput={(x) => {
                                          setIsChecked(x.currentTarget.checked);
                                       }}
                                    />
                                    <div className="w-11 h-6  peer-focus:outline-none  rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium ">
                                       PJ
                                    </span>
                                 </label>
                              </div>
                              <div className=" rounded-lg  grid  gap-5 w-full">
                                 <div>
                                    <label
                                       htmlFor="user"
                                       className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                    >
                                       Usuario
                                    </label>
                                    <input
                                       type="text"
                                       minLength={3}
                                       maxLength={15}
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;
                                          setRequest((prev) => {
                                             return {
                                                ...prev,
                                                user: value,
                                             };
                                          });
                                       }}
                                       id="user"
                                       className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                       placeholder="gstv"
                                       required
                                    />
                                 </div>
                                 <div>
                                    <label
                                       htmlFor="nome"
                                       className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                    >
                                       {isChecked ? "Razão Social" : "Nome"}
                                    </label>
                                    <input
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;
                                          setRequest((prev) => {
                                             return {
                                                ...prev,
                                                nome: value,
                                             };
                                          });
                                       }}
                                       type="text"
                                       id="nome"
                                       className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                       placeholder={
                                          isChecked
                                             ? "Fantasia Tech Serviços LTDA"
                                             : "Gustavo"
                                       }
                                       required
                                    />
                                 </div>
                                 <div>
                                    <label
                                       htmlFor="CPF"
                                       className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                    >
                                       {isChecked ? "CNPJ" : "CPF"}
                                    </label>
                                    <input
                                       type="text"
                                       id="CPF"
                                       onChange={(x) => {
                                          let cnpjOrcpf = x.target.value;

                                          cnpjOrcpf = cnpjOrcpf
                                             .replace(".", "")
                                             .replace("-", "")
                                             .replace("/", "");

                                          if (
                                             !isChecked &&
                                             cnpjOrcpf.length < 11
                                          )
                                             return;
                                          if (
                                             isChecked &&
                                             cnpjOrcpf.length < 14
                                          )
                                             return;

                                          const isValid = isChecked
                                             ? validarCnpj(cnpjOrcpf)
                                             : validarCpf(cnpjOrcpf);
                                          5;
                                          if (!isValid) {
                                             toast.warn(
                                                `${
                                                   isChecked ? "CNPJ" : "CPF"
                                                } Invalido`
                                             );
                                          } else {
                                             toast.success(
                                                `${
                                                   isChecked ? "CNPJ" : "CPF"
                                                } valido`
                                             );
                                          }
                                       }}
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;
                                          setRequest((prev) => {
                                             return {
                                                ...prev,
                                                cpfCnpj: value,
                                             };
                                          });
                                       }}
                                       className={`${
                                          isChecked ? "CNPJ" : "CPF"
                                       } bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] `}
                                       placeholder={
                                          isChecked
                                             ? "00.000.000/0000-00"
                                             : "000.000.000-00"
                                       }
                                       required
                                    />
                                 </div>

                                 <div className="mb-8">
                                    <label
                                       htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                    >
                                       E-mail
                                    </label>
                                    <input
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;
                                          setRequest((prev) => {
                                             return {
                                                ...prev,
                                                email: value,
                                             };
                                          });
                                       }}
                                       type="text"
                                       id="email"
                                       className="bg-transparent  border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                       placeholder="gstv.b2b@gmail.com"
                                       required
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="px-[5%] flex flex-col items-center    py-8 mx-auto  max-[1000px]:py-0  lg:py-0 w-full ">
                              <button
                                 type="submit"
                                 className="w-full  transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[var(--primary-color)]"
                              >
                                 {isLoading
                                    ? "Carregando..."
                                    : "Solicitar abertura"}
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
}
export default AberturaDeContas;
