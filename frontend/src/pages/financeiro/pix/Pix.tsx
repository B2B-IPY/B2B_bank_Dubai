import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiUser } from "react-icons/ci";
import { HiIdentification } from "react-icons/hi";

import {
   MdArrowForwardIos,
   MdCurrencyExchange,
   MdEdit,
   MdPix,
} from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
interface data {
   ID: number;
   nome: string;
   apelido: string;
   tipoDeChave: string;
   chave: string;
   accountNumber: string;
   branchCode: string;
}
function Pix() {
   const navigate = useNavigate();
   const [pages, setPages] = useState<{ current: number; total: number }>({
      current: 1,
      total: 10,
   });
   const [data, setData] = useState<data[]>([
      {
         ID: 23232323,
         nome: "gustavo viana veiga",
         apelido: "gustavo",
         tipoDeChave: "telefone",
         chave: "77991922123",
         accountNumber: "23892832",
         branchCode: "0001",
      },
      {
         ID: 2345323,
         nome: "William Cesar Cardoso Guiraldelli",
         apelido: "will",
         tipoDeChave: "CPF",
         chave: "86393419580",
         accountNumber: "2332432",
         branchCode: "0001",
      },
   ]);
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
         .get("https://api.noutbank.com.br/list-clientes", headers)
         .then((res) => {
            const data: data[] = res.data;
            setData(data);
         })
         .catch((err) => {
            console.error(err);
            if (err.response.status === 404)
               return toast.warn("Nenhum cliente encontrado");
            toast.error("ocorreu um erro");
         });
   }, []);

   return (
      <>
         <div className="gap-10 overflow-y-auto pb-10 px-[5%] flex-col w-full h-screen flex  bg-[var(--background-primary-color)] max-[1000px]:bg-[var(--background-secound-color)]">
            <div className="mt-5  flex max-[1000px]:gap-20  max-[1000px]:items-center max-[1000px]:flex-col-reverse justify-between">
               <div className="grid md:grid-cols-3 gap-10 w-full ">
                  <div className="flex flex-col">
                     <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
                        Favorecido
                     </span>
                     <input
                        type="text"
                        id="favorecido"
                        placeholder="Nome..."
                        className="rounded pt-4 w-40 border-b border-gray-600 bg-transparent px-2 py-1"
                     />
                  </div>
                  <div className="flex flex-col">
                     <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
                        Chave
                     </span>
                     <input
                        type="text"
                        id="chave"
                        placeholder="Chave Pix..."
                        className="w-40 pt-4 border-b border-gray-600  rounded bg-transparent px-2 py-1"
                     />
                  </div>
               </div>
               <div className="flex gap-3 items-center w-[400px] justify-center">
                  <NavLink to="/financeiro/transferencia/pix/novo">
                     <button
                        type="submit"
                        className="w-full focus:ring-4 transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] rounded-lg text-sm px-5 py-1.5 text-center bg-[var(--primary-color)]"
                     >
                        Novo Favorecido
                     </button>
                  </NavLink>
               </div>
            </div>

            {data ? (
               data.map((item, i) => {
                  return (
                     <div
                        key={i}
                        className={` px-12 flex justify-between items-center text-[var(--title-primary-color)] py-8 rounded  w-full bg-[var(--background-secound-color)]`}
                     >
                        <NavLink
                           to={`/financeiro/transferencia/pix/${item.ID}`}
                           className="flex items-center gap-12  transition "
                        >
                           <div className="flex flex-col  gap-2  ">
                              <div className="flex gap-2">
                                 <CiUser size={20} />
                                 <span className="font-bold">{item.nome}</span>
                              </div>
                              <div className="flex gap-2">
                                 <HiIdentification size={20} />
                                 <span className="text-sm">{item.apelido}</span>
                              </div>
                           </div>
                           <MdArrowForwardIos size={25} />
                           <div className="flex flex-col gap-2 ">
                              <div className="flex gap-2">
                                 <MdPix size={20} />
                                 <span className="font-bold">
                                    {item.tipoDeChave}
                                 </span>
                              </div>
                              <div className="flex gap-2">
                                 <MdPix size={20} />
                                 <span className="text-sm">{item.chave}</span>
                              </div>
                           </div>
                        </NavLink>
                        <div className="flex gap-5">
                           <NavLink
                              title="transferir"
                              to={`/financeiro/transferencia/pix/transferir/${item.ID}`}
                              state={{
                                 nome: item.nome,
                                 chave: item.chave,
                                 accountNumber: item.accountNumber,
                                 branchCode: item.branchCode,
                              }}
                              className="flex flex-col gap-2  transition "
                           >
                              <MdCurrencyExchange size={28} />
                           </NavLink>
                           <NavLink
                              to={`/financeiro/transferencia/pix/edit/${item.ID}`}
                              className="flex flex-col gap-2  transition "
                           >
                              <MdEdit size={28} />
                           </NavLink>
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
            <div className="flex gap-2 w-full justify-center">
               <IoIosArrowBack
                  size={25}
                  onClick={() => {
                     setPages((prev) => {
                        if (prev.current > 1)
                           return { ...prev, current: prev.current - 1 };
                        return { ...prev };
                     });
                  }}
                  cursor="pointer"
               />
               <span>{pages.current}</span>
               <IoIosArrowForward
                  size={25}
                  onClick={() => {
                     setPages((prev) => {
                        if (prev.current < pages.total)
                           return { ...prev, current: prev.current + 1 };
                        return { ...prev };
                     });
                  }}
                  cursor="pointer"
               />
            </div>
         </div>
      </>
   );
}
export default Pix;
