import axios from "axios";
import $ from "jquery";
import { useEffect, useState } from "react";
import { BiCalendar, BiDownload } from "react-icons/bi";
import { CiBellOn, CiDollar, CiExport, CiUser } from "react-icons/ci";

import { IoIosArrowForward } from "react-icons/io";
import { MdArrowForwardIos, MdOutlineCurrencyExchange } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { saveAs } from "file-saver";

import { TbPigMoney } from "react-icons/tb";
import { ComprovanteTransactions } from "../../createTransactionsPDF";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { hiddenDados } from "../../../functions/toggleHidden";
import { formatarNumeroParaBRL } from "../../../functions/moeda";

export interface Extrato {
   date: string;
   data: ExtratoData[];
}
export interface ExtratoData {
   data: {
      account: string;
      amount: string;
      bankName: string;
      branch: string;
      chargerBackId: string;
      createdAt: string;
      description: string;
      documentNumber: string;
      email: string;
      endtoendId: string;
      externalId: string;
      invoiceId: string;
      isbp: string;
      key: string;
      msgError: string;
      name: string;
      partnersId: number;
      phone: string;
      remittanceInformation: string;
      status: string;
      subType: string;
      telegramNotification: boolean;
      transactionId: string;
      tryCount: number;
      type: string;
      typeKey: string;
      uuid: string;
      parentId: string;
   };
}

function convertDate(isoDateString: string): string {
   const date = new Date(isoDateString);
   const day = String(date.getDate()).padStart(2, "0");
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const year = date.getFullYear();
   const hours = String(date.getHours()).padStart(2, "0");
   const minutes = String(date.getMinutes()).padStart(2, "0");
   const seconds = String(date.getSeconds()).padStart(2, "0");
   const formattedDate = `${day}/${month}/${year}`;
   const formattedTime = `${hours}:${minutes}:${seconds}`;
   return `${formattedDate} ${formattedTime}`;
}

function Transacoes() {
   $(() => {
      $(".MONEY").mask("000.000.000,00", { reverse: true });
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };
   const navigate = useNavigate();
   const [data, setData] = useState<ExtratoData[]>([
      {
         data: {
            account: "",
            amount: "",
            bankName: "",
            branch: "",
            chargerBackId: "",
            createdAt: "",
            description: "",
            documentNumber: "",
            email: "",
            endtoendId: "",
            externalId: "",
            invoiceId: "",
            isbp: "",
            key: "",
            msgError: "",
            name: "",
            partnersId: 0,
            phone: "",
            remittanceInformation: "",
            status: "",
            subType: "",
            telegramNotification: false,
            transactionId: "",
            tryCount: 0,
            type: "",
            typeKey: "",
            uuid: "",
            parentId: "",
         },
      },
   ]);
   useEffect(() => {
      setIsLoading(true);

      axios
         .get("http://localhost:2311/extrato/1", headers)
         .then(({ data }) => {
            console.log(data);

            setData(data);
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
      ) {
         navigate("/login");
      }
   }, []);

   const download = (array: { [index: string]: any }[]) => {
      // Garante que o array tenha pelo menos um objeto para extrair as chaves
      if (!array.length) {
         return toast.warn("Nenhum dado encontrado");
      }
      delete array[0].tags;
      const keys = Object.keys(array[0]); // Pega as chaves do primeiro objeto
      let content = keys.map((key) => `'${key}'`).join(", ") + "\n"; // Cria o cabeçalho CSV

      // Percorre o array de objetos
      array.forEach((obj) => {
         delete obj.tags;
         const values = Object.values(obj); // Pega os valores do objeto
         content +=
            values
               .map((value) => {
                  if (Array.isArray(value)) {
                     return `'${value.join(", ")}'`; // Transforma arrays em strings com elementos separados por vírgula
                  }
                  return `'${value}'`; // Adiciona aspas aos valores que não são arrays
               })
               .join(", ") + "\n"; // Junta os valores com vírgula e adiciona uma nova linha
      });

      const blob = new Blob([content], {
         type: "application/vnd.ms-excel;charset=utf-8",
      });
      saveAs(blob, "trasancoes.xls");
   };
   const { isHidden, toggleHidden } = hiddenDados();

   return (
      <>
         <main className="pt-12 px-[5%] h-full overflow-y-auto bg-[var(--background-primary-color)]">
            <div className="flex justify-between items-center gap-10 w-full ">
               <div className="flex flex-col  w-[350px]"></div>
               <div className="flex gap-2 items-center flex-wrap">
                  <div className="flex">
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
            </div>

            <div className="flex flex-col gap-10 my-20">
               {data ? (
                  <div className="flex flex-col gap-5">
                     <div className="flex flex-col gap-6">
                        {data.map((obj, item) => {
                           return (
                              <div
                                 key={item}
                                 title={obj.data.transactionId}
                                 className="flex gap-3 items-center justify-between border-b border-[var(--primary-color)] ml-[2%] pl-[2%] pr-[5%] py-4 rounded-lg"
                              >
                                 <div className="flex gap-8 items-center">
                                    <span className="font-bold text-xl">
                                       {obj.data.createdAt.split("T")[0]}
                                    </span>
                                    <CiExport
                                       size={25}
                                       className="hover:text-green-500 cursor-pointer"
                                       onClick={() => {
                                          if (!obj.data.createdAt[0]) return;
                                          // download(obj.data.data);
                                       }}
                                    />
                                 </div>

                                 <div className="flex gap-3 items-center">
                                    <span
                                       className={`flex rounded-full p-1 bg-${
                                          parseInt(obj.data.amount) < 0
                                             ? "red"
                                             : "green"
                                       }-500`}
                                    ></span>
                                    <span>
                                       {obj.data.name
                                          ? obj.data.name
                                          : "Transação "}
                                    </span>
                                 </div>

                                 <span>
                                    {isHidden
                                       ? "R$ ********"
                                       : `R$ ${obj.data.amount}`}
                                 </span>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               ) : (
                  <Skeleton
                     className=" h-20  rounded my-3"
                     count={5}
                     highlightColor="#e5e5e5"
                     baseColor="#dedede"
                  />
               )}
               {/* <div className="flex gap-2 w-full justify-center">
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
          </div> */}
            </div>
         </main>
      </>
   );
}

export default Transacoes;
