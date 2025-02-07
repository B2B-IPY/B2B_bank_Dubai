import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from "recharts";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import tempoExpiracaoToken from "../../functions/tempoExpiracaoToken";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import normalizeTimeStamp from "../../functions/normalizeTimeStamp";
import { BiDownload } from "react-icons/bi";
import { ComprovanteTransactions } from "../createTransactionsPDF";
import { IoIosArrowForward } from "react-icons/io";
import { hiddenDados } from "../../functions/toggleHidden";
import { HiEye, HiEyeOff } from "react-icons/hi";

function formatarNumeroParaBRL(numero: number): string {
   const formatoMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   });
   return formatoMoeda.format(numero).replace("R$", "").trim();
}
interface DadosDashboard {
   total: {
      cashin: number;
      cashout: number;
      taxas: number;
   };
   tpv: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   cashin: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   cashout: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   quantidade_de_transacoes: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   ticket_medio: {
      mes_atual: number;
      mes_anterior: number;
   };
   tarifas: {
      mes_atual: number;
      mes_anterior: number;
   };
   users: Users[];
   transacoes: Transacoes[];
}
interface Users {
   id: number;
   user: string;
   workspace_id: string;
}
interface Transacoes {
   id: number;
   amount: number;
   description: string;
   externalId: string;
   receiverId: string;
   senderId: string;
   tags: string[];
   fee: number;
   source: string;
   balance: number;
   created: string;
   workspace_id: string;
   user: string;
}

function Dasboard() {
   const [users, setUsers] = useState<Users[]>([]);
   const [data, setData] = useState<DadosDashboard>();
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const navigate = useNavigate();
   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };
   useEffect(() => {
      axios
         .post("http://localhost:2312/dashboard/cliente", {}, headers)
         .then((res) => {
            setData(res.data);
            setUsers(res.data.users);
         })
         .catch((err) => {
            console.error(err);
            toast.error("Ocorreu um erro ao buscar os dados");
         })
         .finally(() => {
            setIsLoading(false);
         });

      if (
         !tempoExpiracaoToken(localStorage.getItem("x-access-token") as string)
      )
         navigate("/login");
   }, []);
   const { isHidden, toggleHidden } = hiddenDados();

   return (
      <>
         <div className="bg-[#e9e9e9]">
            {isLoading ? (
               <div className=" px-[5%] w-full my-10 flex flex-col gap-3">
                  <Skeleton
                     className=" h-[190px] rounded my-3"
                     count={1}
                     highlightColor="#e5e5e5"
                     baseColor="#dedede"
                  />
                  <Skeleton
                     className="  h-[280px] rounded my-3"
                     count={3}
                     highlightColor="#e5e5e5"
                     baseColor="#dedede"
                  />
               </div>
            ) : (
               <>
                  {" "}
                  <main className="flex flex-col m-10">
                     <div className="mb-10 flex flex-col gap-4">
                        <div className="font-bold capitalize flex justify-between w-full">
                           <span>Total</span>
                           <div className="flex ">
                              {isHidden ? (
                                 <HiEyeOff
                                    className="cursor-pointer hover:opacity-80 transition"
                                    onClick={toggleHidden}
                                 />
                              ) : (
                                 <HiEye
                                    className="cursor-pointer hover:opacity-80 transition"
                                    onClick={toggleHidden}
                                 />
                              )}
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-8 ">
                           <div className="flex gap-2 items-center">
                              <span className="font-semibold capitalize">
                                 cashin
                              </span>
                              <IoIosArrowForward />
                              <span className="text-sm text-gray-600">
                                 R${" "}
                                 {isHidden
                                    ? "****"
                                    : formatarNumeroParaBRL(
                                         data?.total.cashin || 0
                                      )}
                              </span>
                           </div>
                           <div className="flex gap-2 items-center">
                              <span className="font-semibold capitalize">
                                 cashout
                              </span>
                              <IoIosArrowForward />
                              <span className="text-sm text-gray-600">
                                 R${" "}
                                 {isHidden
                                    ? "****"
                                    : formatarNumeroParaBRL(
                                         data?.total.cashout || 0
                                      )}
                              </span>
                           </div>
                           {/* <div className="flex gap-2 items-center">
                              <span className="font-semibold capitalize">
                                 taxas
                              </span>
                              <IoIosArrowForward />
                              <span className="text-sm text-gray-600">
                                 R${" "}
                                 {isHidden
                                    ? "****"
                                    : formatarNumeroParaBRL(
                                         data?.total.taxas || 0
                                      )}
                              </span>
                           </div> */}
                        </div>
                     </div>
                     <section className="grid grid-cols-2 max-[1300px]:grid-cols-1  w-full  gap-4">
                        <div>
                           <div className="px-3 py-5 rounded-lg bg-white shadow ">
                              <div className="flex justify-between mb-4">
                                 <h1 className="text-[20px] text-[var(--background-secound-color)] font-semibold">
                                    Progressão de TPV
                                 </h1>
                              </div>
                              <div className="flex-col">
                                 <div className="flex justify-center gap-3 w-full mb-5">
                                    <div className="flex flex-col w-full px-3 py-4 rounded-lg bg-[var(--background-secound-color)]">
                                       <span className="text-white text-[17px] font-semibold">
                                          Mês atual
                                       </span>
                                       <span className="text-white text-[19px] font-semibold">
                                          R${" "}
                                          {isHidden
                                             ? "****"
                                             : formatarNumeroParaBRL(
                                                  data?.tpv.mes_atual || 0
                                               )}
                                       </span>
                                    </div>
                                    <div className="flex flex-col w-full px-3 py-4 rounded-lg border border-gray-200">
                                       <span className="text-[var(--background-secound-color)] text-[17px] font-semibold">
                                          Mês anterior
                                       </span>
                                       <span className="text-[var(--background-secound-color)] text-[19px] font-semibold">
                                          R${" "}
                                          {isHidden
                                             ? "****"
                                             : formatarNumeroParaBRL(
                                                  data?.tpv.mes_anterior || 0
                                               )}
                                       </span>
                                    </div>
                                 </div>
                                 <div>
                                    <div className="h-[200px]">
                                       <ResponsiveContainer
                                          width="100%"
                                          height="100%"
                                       >
                                          <LineChart
                                             width={500}
                                             height={300}
                                             data={
                                                isHidden
                                                   ? [
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                     ]
                                                   : data?.tpv
                                                        .relatorio_ultimo_ano
                                             }
                                             margin={{
                                                top: 5,
                                                right: 5,
                                                left: 0,
                                                bottom: 5,
                                             }}
                                          >
                                             <CartesianGrid strokeDasharray="3 3" />
                                             <XAxis dataKey="name" />
                                             <YAxis />
                                             <Tooltip />

                                             <Line
                                                type="monotone"
                                                dataKey="uv"
                                                stroke="#8884d8"
                                                activeDot={{ r: 5 }}
                                                strokeWidth={3}
                                             />
                                          </LineChart>
                                       </ResponsiveContainer>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div>
                           <div className="px-3 py-5 rounded-lg bg-white shadow mb-5">
                              <div className="flex justify-between mb-4">
                                 <h1 className="text-[20px] text-[var(--background-secound-color)] font-semibold">
                                    Cash-in
                                 </h1>
                              </div>
                              <div className="flex-col">
                                 <div className="flex justify-center gap-3 w-full mb-5">
                                    <div className="flex flex-col w-full px-3 py-4 rounded-lg bg-[var(--background-secound-color)]">
                                       <span className="text-white text-[17px] font-semibold">
                                          Mês atual
                                       </span>
                                       <span className="text-white text-[19px] font-semibold">
                                          R${" "}
                                          {isHidden
                                             ? "****"
                                             : formatarNumeroParaBRL(
                                                  data?.cashin.mes_atual || 0
                                               )}
                                       </span>
                                    </div>
                                    <div className="flex flex-col w-full px-3 py-4 rounded-lg border border-gray-200">
                                       <span className="text-[var(--background-secound-color)] text-[17px] font-semibold">
                                          Mês anterior
                                       </span>
                                       <span className="text-[var(--background-secound-color)] text-[19px] font-semibold">
                                          R${" "}
                                          {isHidden
                                             ? "****"
                                             : formatarNumeroParaBRL(
                                                  data?.cashin.mes_anterior || 0
                                               )}
                                       </span>
                                    </div>
                                 </div>
                                 <div>
                                    <div className="h-[200px]">
                                       <ResponsiveContainer
                                          width="100%"
                                          height="100%"
                                       >
                                          <LineChart
                                             width={500}
                                             height={300}
                                             data={
                                                isHidden
                                                   ? [
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                        { valor: 0 },
                                                     ]
                                                   : data?.cashin
                                                        .relatorio_ultimo_ano
                                             }
                                             margin={{
                                                top: 5,
                                                right: 5,
                                                left: 0,
                                                bottom: 5,
                                             }}
                                          >
                                             <CartesianGrid strokeDasharray="3 3" />
                                             <XAxis dataKey="name" />
                                             <YAxis />
                                             <Tooltip />

                                             <Line
                                                type="monotone"
                                                dataKey="uv"
                                                stroke="#8884d8"
                                                activeDot={{ r: 5 }}
                                                strokeWidth={3}
                                             />
                                          </LineChart>
                                       </ResponsiveContainer>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div>
                           <div className="px-3 py-5 rounded-lg bg-white shadow mb-5">
                              <div className="flex justify-between mb-4">
                                 <h1 className="text-[20px] text-[var(--background-secound-color)] font-semibold">
                                    Cash-out
                                 </h1>
                              </div>
                              <div className="flex-col">
                                 <div className="flex justify-center gap-3 w-full mb-5">
                                    <div className="flex flex-col w-full px-3 py-4 rounded-lg bg-[var(--background-secound-color)]">
                                       <span className="text-white text-[17px] font-semibold">
                                          Mês atual
                                       </span>
                                       <span className="text-white text-[19px] font-semibold">
                                          R${" "}
                                          {isHidden
                                             ? "****"
                                             : formatarNumeroParaBRL(
                                                  data?.cashout.mes_atual || 0
                                               )}
                                       </span>
                                    </div>
                                    <div className="flex flex-col w-full px-3 py-4 rounded-lg border border-gray-200">
                                       <span className="text-[var(--background-secound-color)] text-[17px] font-semibold">
                                          Mês anterior
                                       </span>
                                       <span className="text-[var(--background-secound-color)] text-[19px] font-semibold">
                                          R${" "}
                                          {isHidden
                                             ? "****"
                                             : formatarNumeroParaBRL(
                                                  data?.cashout.mes_anterior ||
                                                     0
                                               )}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="gap-4 flex flex-col">
                           <div>
                              <div className="px-3 py-5 rounded-lg bg-white shadow mb-5">
                                 <div className="flex justify-between mb-4">
                                    <h1 className="text-[20px] text-[var(--background-secound-color)] font-semibold">
                                       Quantidade de transações
                                    </h1>
                                 </div>
                                 <div className="flex-col">
                                    <div className="flex justify-center gap-3 w-full mb-5">
                                       <div className="flex flex-col w-full px-3 py-4 rounded-lg bg-[var(--background-secound-color)]">
                                          <span className="text-white text-[17px] font-semibold">
                                             Mês atual
                                          </span>
                                          <span className="text-white text-[19px] font-semibold">
                                             {isHidden
                                                ? "****"
                                                : data?.quantidade_de_transacoes
                                                     .mes_atual || 0}
                                          </span>
                                       </div>
                                       <div className="flex flex-col w-full px-3 py-4 rounded-lg border border-gray-200">
                                          <span className="text-[var(--background-secound-color)] text-[17px] font-semibold">
                                             Mês anterior
                                          </span>
                                          <span className="text-[var(--background-secound-color)] text-[19px] font-semibold">
                                             {isHidden
                                                ? "****"
                                                : data?.quantidade_de_transacoes
                                                     .mes_anterior || 0}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           {/* <div className="bg-white shadow p-4 rounded-lg ">
                              <div className="flex justify-between mb-4">
                                 <h1 className="text-[20px] text-[var(--background-secound-color)] font-semibold">
                                    Quantidade de transações
                                 </h1>
                              </div>
                              <div className="flex gap-2 justify-center">
                                 <div className="flex flex-col w-full px-3 py-3 rounded-lg bg-[var(--background-secound-color)]">
                                    <span className="text-white text-[14px] font-semibold">
                                       Mês atual
                                    </span>
                                    <span className="text-white text-[16px] font-semibold">
                                       {isHidden
                                          ? "****"
                                          : data?.quantidade_de_transacoes
                                               .mes_atual || 0}
                                    </span>
                                 </div>
                                 <div className="flex flex-col  w-full px-3 py-3 rounded-lg border border-gray-200">
                                    <span className="text-[var(--background-secound-color)] text-[14px] font-semibold">
                                       Mês anterior
                                    </span>
                                    <span className="text-[var(--background-secound-color)] text-[16px] font-semibold">
                                       {isHidden
                                          ? "****"
                                          : data?.quantidade_de_transacoes
                                               .mes_anterior || 0}
                                    </span>
                                 </div>
                              </div>
                           </div> */}
                           {/* <div className="bg-white shadow p-4 rounded-lg">
                              <div className="flex justify-between mb-4">
                                 <h1 className="text-[20px] text-[var(--background-secound-color)] font-semibold">
                                    Tarifas cobradas
                                 </h1>
                              </div>
                              <div className="flex gap-2 justify-center">
                                 <div className="flex flex-col w-full px-3 py-3 rounded-lg bg-[var(--background-secound-color)]">
                                    <span className="text-white text-[14px] font-semibold">
                                       Mês atual
                                    </span>
                                    <span className="text-white text-[16px] font-semibold">
                                       R${" "}
                                       {isHidden
                                          ? "****"
                                          : formatarNumeroParaBRL(
                                               data?.tarifas.mes_atual || 0
                                            )}
                                    </span>
                                 </div>
                                 <div className="flex flex-col  w-full px-3 py-3 rounded-lg border border-gray-200">
                                    <span className="text-[var(--background-secound-color)] text-[14px] font-semibold">
                                       Mês anterior
                                    </span>
                                    <span className="text-[var(--background-secound-color)] text-[16px] font-semibold">
                                       R${" "}
                                       {isHidden
                                          ? "****"
                                          : formatarNumeroParaBRL(
                                               data?.tarifas.mes_anterior || 0
                                            )}
                                    </span>
                                 </div>
                              </div>
                           </div> */}
                        </div>
                     </section>
                  </main>
               </>
            )}
         </div>
      </>
   );
}
export default Dasboard;
