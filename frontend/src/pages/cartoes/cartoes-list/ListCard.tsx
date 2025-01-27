import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiCreditCard1 } from "react-icons/ci";
import { BiInfoCircle, BiSearch } from "react-icons/bi";
import { IoIosArrowDown, IoIosWarning } from "react-icons/io";
import { Cartoes } from "../../../interfaces/cartoes";
import { MdArrowForwardIos, MdClose } from "react-icons/md";
import $ from "jquery";
interface Cliente {
   id: number;
   user: string;
}
interface CardInfo {
   numero: string;
   id_user: string;
   validade: string;
   cvv: string;
}
function ListCard() {
   const navigate = useNavigate();
   $(() => {
      $(".EXP").mask("00/00");
      $(".CVV").mask("000");
   });
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [cardInfo, setCardInfo] = useState<CardInfo>({
      numero: "",
      id_user: "",
      validade: "",
      cvv: "",
   });
   const [data, setData] = useState<Cartoes[]>([]);
   const [clienteList, setClienteList] = useState<Cliente[]>([]);
   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };
   useEffect(() => {
      if (
         !tempoExpiracaoToken(localStorage.getItem("x-access-token") as string)
      )
         navigate("/login");

      axios
         .post("http://localhost:2311/cartoes", {}, headers)
         .then((res) => {
            const data: Cartoes[] = res.data;
            setData(data);
         })
         .catch((err) => {
            console.error(err);
            if (err.response.status === 401 || err.response.status === 403)
               return toast.warn("sem permissão");
            if (err.response.status === 404)
               return toast.warn("Nenhum cartão encontrado");
            toast.error("ocorreu um erro");
         })
         .finally(() => {
            setIsLoading(false);
         });
      axios.post("http://localhost:2311/clientes", {}, headers).then((res) => {
         const data = res.data;
         setClienteList(data);
      });
   }, []);
   function filtrar() {
      if (isLoading) return;
      setIsLoading(true);

      axios
         .post(
            "http://localhost:2311/cartoes",
            {
               numero: $("#search").val(),
            },
            headers
         )
         .then((res) => {
            const data: Cartoes[] = res.data;
            setData(data);
         })
         .catch((err) => {
            console.error(err);
            if (err.response.status === 401) return toast.warn("sem permissão");
            if (err.response.status === 404)
               return toast.warn("Nenhum cartão encontrado");
            toast.error("ocorreu um erro");
         })
         .finally(() => {
            setIsLoading(false);
         });
   }
   function criarCartao() {
      if (isLoading) return;
      if (
         !cardInfo.cvv ||
         !cardInfo.id_user ||
         !cardInfo.numero ||
         !cardInfo.validade
      )
         return toast.warning("Preencha todos os campos");
      setIsLoading(true);

      axios
         .post("http://localhost:2311/cartoes/criar", cardInfo, headers)
         .then(() => {
            toast.success("Cartão criado com sucesso");
            setModalVisible(false);
         })
         .catch((err) => {
            console.error(err);
            if (err.response.status === 401) return toast.warn("sem permissão");
            if (err.response.status === 404)
               return toast.warn("Nenhum cartão encontrado");
            toast.error("ocorreu um erro");
         })
         .finally(() => {
            setIsLoading(false);
         });
   }
   return (
      <>
         <div className="gap-10 overflow-y-auto pb-10 px-[5%] flex-col w-full h-screen flex  bg-[var(--background-primary-color)]">
            {modalVisible && (
               <dialog className="backdrop-blur-xl flex justify-center bg-transparent h-full w-full top-0 overflow-y-auto">
                  <div className="flex overflow-y-auto flex-col  my-20 items-center  bg-[var(--background-secound-color)] border-2 border-[var(--border-color2)]">
                     <div className="flex w-full text-[var(--title-primary-color)] items-center justify-between px-4 py-6 border-b border-[var(--border-color2)]">
                        <span className="text-[18px] font-semibold">
                           Investir em ativos digitais
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
                     <div className="w-full flex justify-center py-3 items-center ">
                        <div className="flex text-[var(--title-primary-color)] items-center justify-between px-4 gap-3 bg-[var(--hover-color)] w-[95%] rounded">
                           <img
                              src="/assets/card-black.svg"
                              alt=""
                              className="w-20 h-20"
                           />
                           <span>
                              Fazendo um investimento de renda fixa digital,
                              você garante o mesmo valor em{" "}
                              <b>crédito no cartão corporativo.</b>
                           </span>
                        </div>
                     </div>
                     <div className="flex w-full w-[95%] gap-1.5 pt-1 pb-4 items-center">
                        <IoIosWarning className="text-[#ffff00]" />

                        <span className=" text-[var(--title-primary-color)]">
                           Apenas administratores podem criar cartões para
                           outras contas
                        </span>
                     </div>
                     <div className="flex justify-center  w-full my-6 text-gray-300">
                        <div className=" justify-center flex flex-col gap-3">
                           <div className="">
                              <div className="h-20 bg-[var(--background-secound-color)]  rounded-t-[16px] border border-gray-400 "></div>
                              <div className="  justify-between items-center  flex   px-6 py-8 rounded-b-[16px] border border-gray-400">
                                 <div className="flex flex-col gap-8">
                                    <select
                                       className="text-[19px] bg-transparent font-semibold "
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;

                                          setCardInfo((prev) => {
                                             return {
                                                ...prev,
                                                id_user: value,
                                             };
                                          });
                                       }}
                                    >
                                       {clienteList.map((cliente) => {
                                          return (
                                             <option value={cliente.id}>
                                                {cliente.user}
                                             </option>
                                          );
                                       })}
                                    </select>
                                    <input
                                       placeholder="00000000"
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;
                                          setCardInfo((prev) => {
                                             return {
                                                ...prev,
                                                numero: value,
                                             };
                                          });
                                       }}
                                       className="text-[24px] bg-transparent "
                                    />

                                    <div className="flex w-full gap-10">
                                       <span className="text-[19px] font-semibold">
                                          Exp:{" "}
                                          <input
                                             placeholder="12/29"
                                             onInput={(e) => {
                                                const value =
                                                   e.currentTarget.value;
                                                setCardInfo((prev) => {
                                                   return {
                                                      ...prev,
                                                      validade: value,
                                                   };
                                                });
                                             }}
                                             className="EXP bg-transparent "
                                          />
                                       </span>
                                       <span className="text-[19px] font-semibold">
                                          CVV:{" "}
                                          <input
                                             placeholder="000"
                                             onInput={(e) => {
                                                const value =
                                                   e.currentTarget.value;
                                                setCardInfo((prev) => {
                                                   return {
                                                      ...prev,
                                                      cvv: value,
                                                   };
                                                });
                                             }}
                                             className="CVV w-12 bg-transparent "
                                          />
                                       </span>
                                    </div>
                                 </div>
                                 <img
                                    src="/assets/logo.png"
                                    alt=""
                                    className="w-32 "
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="w-full flex flex-col items-center">
                        <div className="w-full px-[5%] flex justify-between py-4 gap-4">
                           <button
                              onClick={() => {
                                 setModalVisible(false);
                              }}
                              className=" transition flex gap-2 items-center justify-center h-10 text-[var(--primary-color)] focus:outline-none hover:bg-[var(--primary-color)] hover:text-[var(--white-color2)]  font-medium rounded-lg text-sm w-[140px]  py-2 border-2 border-[var(--primary-color)]"
                           >
                              Cancelar
                           </button>
                           <button
                              onClick={() => {
                                 criarCartao();
                              }}
                              className=" transition flex gap-2 items-center justify-center h-10 text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-[var(--primary-color)] hover:bg-transparent hover:border-[var(--primary-color)] hover:border-2 hover:text-[var(--primary-color)]"
                           >
                              {!isLoading ? "Criar" : "Carregando..."}
                           </button>
                        </div>
                     </div>
                  </div>
               </dialog>
            )}
            <div className="mt-5  flex max-[1000px]:gap-20  max-[1000px]:items-center max-[1000px]:flex-col-reverse justify-between">
               <div></div>
               <div className="flex gap-3 items-center  justify-center">
                  {localStorage.getItem("role") == "admin" && (
                     <button
                        type="submit"
                        onClick={() => {
                           setModalVisible(true);
                        }}
                        className="w-full focus:ring-4 transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] rounded-lg text-sm px-5 py-1.5 text-center bg-[var(--primary-color)]"
                     >
                        Criar novo
                     </button>
                  )}
               </div>
            </div>

            <div className="max-[1000px]:hidden flex bg-[var(--background-secound-color)]  flex-col  rounded-xl  shadow">
               <div className="flex px-5 py-5 flex-col gap-2 text-[var(--title-primary-color)]">
                  <div className="flex gap-4 items-end">
                     <input
                        type="text"
                        id="search"
                        placeholder="pesquisar numero..."
                        className="w-full py-2 px-5 text-sm bg-transparent border-b border-gray-200 rounded"
                     />

                     <BiSearch
                        size={20}
                        className="hover:text-[var(--primary-color)] cursor-pointer transition"
                        onClick={() => {
                           filtrar();
                        }}
                     />
                  </div>
               </div>
            </div>

            {data ? (
               data.map((item, i) => {
                  return (
                     <div
                        key={i}
                        className={`px-12 gap-10 py-8 rounded bg-[var(--background-secound-color)]  flex flex-col text-[var(--title-primary-color)] 
                 `}
                     >
                        <div
                           className={` flex justify-between items-center     w-full `}
                        >
                           <NavLink
                              to={`/cartoes/${item.id}`}
                              className="flex items-center gap-12  transition "
                           >
                              <div className="flex flex-col  gap-2  ">
                                 <div
                                    className="flex gap-2 items-center"
                                    title="name"
                                 >
                                    <CiCreditCard1 size={20} />
                                    <span className="font-bold">
                                       {item.numero}
                                    </span>
                                 </div>
                              </div>
                              {localStorage.getItem("role") == "admin" && (
                                 <>
                                    <MdArrowForwardIos size={25} />
                                    <div className="flex flex-col gap-2 mr-2">
                                       <div
                                          className="flex gap-2"
                                          title="username"
                                       >
                                          <span className="">{item.user}</span>
                                       </div>
                                    </div>
                                 </>
                              )}
                           </NavLink>
                           <div className="flex gap-3">
                              <NavLink
                                 to={`/cartoes/${item.id}`}
                                 className="flex flex-col gap-2 max-[1000px]:hidden  transition "
                              >
                                 <BiInfoCircle size={30} />
                              </NavLink>
                              <IoIosArrowDown
                                 className="transition cursor-pointer duration-300"
                                 onClick={(e) => {
                                    const thisElement = e.currentTarget;
                                    const target = thisElement.parentElement
                                       ?.parentElement?.parentElement
                                       ?.childNodes[1] as HTMLElement;

                                    target.classList.toggle("hidden");
                                    thisElement.classList.toggle("rotate-180");
                                 }}
                                 size={30}
                              />
                           </div>
                        </div>
                        <div className="transition flex justify-between flex-wrap gap-10 border-t pt-8 border-gray-200/25 hidden">
                           <div className="flex flex-col gap-5">
                              <span>controle de gastos</span>
                              <div className="flex flex-wrap gap-5 items-center">
                                 <button className="py-1 px-7 text-sm bg-[var(--primary-color)] rounded">
                                    Aplicar
                                 </button>
                                 <button className="py-1 px-4 text-sm border-red-500 text-red-500 border bg-transparent rounded ">
                                    Remover
                                 </button>
                              </div>
                           </div>
                           <div className="flex flex-col gap-5">
                              <span>central de custo</span>
                              <div className="flex flex-wrap gap-5 items-center">
                                 <button className="py-1 px-7 text-sm bg-[var(--primary-color)] rounded">
                                    Link to
                                 </button>
                                 <button className="py-1 px-4 text-sm border-red-500 text-red-500 border bg-transparent rounded ">
                                    Unlink
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })
            ) : (
               <Skeleton
                  className=" h-20  rounded my-3"
                  count={5}
                  highlightColor="#e5e5e5"
                  baseColor="#dedede"
               />
            )}
         </div>
      </>
   );
}
export default ListCard;
