import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiClock1, CiUser } from "react-icons/ci";
import { HiIdentification } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import $ from "jquery";
import { MdArrowForwardIos } from "react-icons/md";

import tempoExpiracaoToken from "../../functions/tempoExpiracaoToken";
import normalizeTimeStamp from "../../functions/normalizeTimeStamp";

interface Data {
   total_de_paginas: number;
   data: Logs[];
}
interface Logs {
   id_logs: number;
   user: string;
   location: string;
   action: string;
   date: string;
}
function LogsList() {
   const navigate = useNavigate();

   const [pagina, setPagina] = useState<number>(1);
   const [dataOrigin, setDataOrigin] = useState<Data>({
      total_de_paginas: 0,
      data: [],
   });
   function filterUsersBySearch(users: Logs[], search: string): Logs[] {
      if (!search) return dataOrigin.data;
      return users.filter(
         (user) =>
            user.user.includes(search) ||
            user.action.includes(search) ||
            user.location.includes(search)
      );
   }
   const [data, setData] = useState<Data>({
      total_de_paginas: 0,
      data: [],
   });
   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };
   function filtrarPagina(pagina: number) {
      axios
         .post("https://api.noutbank.com.br/logs", { pagina: pagina }, headers)
         .then((res) => {
            const data = res.data;

            setData(data);
            setDataOrigin(data);
         })
         .catch((err) => {
            console.error(err);
            if (err.response.status === 404)
               return toast.warn("Nenhuma log encontrado");
            toast.error("ocorreu um erro");
         });
   }
   useEffect(() => {
      if (
         !tempoExpiracaoToken(localStorage.getItem("x-access-token") as string)
      )
         navigate("/login");

      filtrarPagina(pagina);
   }, []);

   return (
      <>
         <div className="gap-10 overflow-y-auto pb-10 px-[5%] flex-col w-full h-screen flex  bg-[var(--background-primary-color)]">
            <div className="mt-5  flex max-[1000px]:gap-20  max-[1000px]:items-center max-[1000px]:flex-col-reverse justify-between">
               <div></div>

               <div className="flex gap-3 items-center  justify-center">
                  <NavLink to="/contas/novo">
                     <button
                        type="submit"
                        className="w-full focus:ring-4 transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] rounded-lg text-sm px-5 py-1.5 text-center bg-[var(--primary-color)]"
                     >
                        Adicionar
                     </button>
                  </NavLink>
               </div>
            </div>
            <div className="max-[1000px]:hidden flex bg-[var(--background-secound-color)]  flex-col  rounded-xl  shadow">
               <div className="flex px-5 py-5 flex-col gap-2 text-[var(--title-primary-color)]">
                  <div className="flex gap-4 items-end">
                     <input
                        type="text"
                        id="search"
                        placeholder="pesquisar nome..."
                        className="w-full py-2 px-5 text-sm bg-transparent border-b border-gray-200 rounded"
                     />

                     <BiSearch
                        size={20}
                        className="hover:text-[var(--primary-color)] cursor-pointer transition"
                        onClick={() => {
                           if (!data.data) return;
                           const newArray = filterUsersBySearch(
                              data.data,
                              $("#search").val() as string
                           );
                           setData((prev) => {
                              return { ...prev, data: newArray };
                           });
                        }}
                     />
                  </div>
               </div>
            </div>
            {data.data ? (
               data.data.map((item, i) => {
                  return (
                     <div
                        key={i}
                        className={` px-12 flex justify-between items-center text-[var(--title-primary-color)] py-8 rounded  w-full bg-[var(--background-secound-color)] border-l-8 `}
                     >
                        <NavLink
                           to={`/logs/${item.id_logs}`}
                           className="flex items-center gap-12  transition "
                        >
                           <div className="flex flex-col  gap-2  ">
                              <div className="flex gap-2" title="name">
                                 <CiUser size={20} />
                                 <span className="font-bold">{item.user}</span>
                              </div>
                              <div
                                 className="flex gap-2"
                                 title="organization Id"
                              >
                                 <HiIdentification size={20} />
                                 <span className="text-sm">
                                    {item.location}
                                 </span>
                              </div>
                           </div>
                           <MdArrowForwardIos
                              size={25}
                              className="max-[1000px]:hidden"
                           />
                           <div className="flex flex-col gap-2 max-[1000px]:hidden">
                              <div
                                 className="flex gap-2"
                                 title="data de criação"
                              >
                                 <CiClock1 size={20} />
                                 <span className="font-bold">
                                    {normalizeTimeStamp(item.date)}
                                 </span>
                              </div>
                              <div className="flex gap-2" title="username">
                                 <CiUser size={20} />
                                 <span className="text-sm">{item.action}</span>
                              </div>
                           </div>
                        </NavLink>
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
            <div className="flex gap-5 flex-wrap">
               {Array.from(
                  { length: data.total_de_paginas },
                  (_, i) => i + 1
               ).map((key, i) => {
                  return (
                     <button
                        onClick={() => {
                           filtrarPagina(key);
                           setPagina(key);
                        }}
                        className={`hover:opacity-70 ${
                           pagina === key && "text-[var(--primary-color)]"
                        }`}
                        key={i}
                     >
                        {key}
                     </button>
                  );
               })}
            </div>
         </div>
      </>
   );
}
export default LogsList;
