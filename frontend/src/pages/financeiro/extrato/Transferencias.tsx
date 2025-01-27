import axios from "axios";
import $ from "jquery";
import { useEffect, useState } from "react";
import { BiCalendar, BiDownload } from "react-icons/bi";
import { CiDollar, CiExport, CiUser } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { saveAs } from "file-saver";
import { ComprovanteTransfers } from "../../../functions/createTransfersPDF ";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { hiddenDados } from "../../../functions/toggleHidden";

function formatarNumeroParaBRL(numero: number) {
   const formatoMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   });
   return formatoMoeda.format(numero).replace("R$", "").trim();
}
export interface Data {
   cashout: Cashout[];
   cashin: Cashin[];
}

export interface Cashin {
   id: string;
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
}

export interface Cashout {
   id: string;
   amount: number;
   name: string;
   taxId: string;
   bankCode: string;
   branchCode: string;
   accountNumber: string;
   accountType: string;
   externalId: string;
   scheduled: string;
   description: string;
   displayDescription: string;
   tags: any[];
   rules: any[];
   fee: number;
   status: string;
   transactionIds: string[];
   metadata: Metadata;
   created: string;
   updated: string;
}

export interface Metadata {
   authentication: string;
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

function Transferencias() {
   $(() => {
      $(".MONEY").mask("000.000.000,00", { reverse: true });
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   console.log(isLoading);

   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };
   const navigate = useNavigate();
   const [data, setData] = useState<Data>({
      cashout: [],
      cashin: [],
   });
   useEffect(() => {
      setIsLoading(true);

      axios
         .post("http://localhost:2311/transferir/extrato", {}, headers)
         .then((res) => {
            setData(res.data);
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
   function filter() {
      setIsLoading(true);
      const body = {
         after: $("#before").val() as string,
         before: $("#after").val() as string,
      };

      axios
         .post("http://localhost:2311/transferir/extrato", body, headers)
         .then((res) => {
            setData(res.data);
         })
         .catch((err) => {
            console.error(err);
            toast.error("Ocorreu um erro ao buscar os dados");
         })
         .finally(() => {
            setIsLoading(false);
         });
   }
   const download = (array: { [index: string]: any }[]) => {
      // Garante que o array tenha pelo menos um objeto para extrair as chaves
      if (!array.length) {
         return toast.warn("Nenhum dado encontrado");
      }
      delete array[0].metadata;
      const keys = Object.keys(array[0]); // Pega as chaves do primeiro objeto
      let content = keys.map((key) => `'${key}'`).join(", ") + "\n"; // Cria o cabeçalho CSV

      // Percorre o array de objetos
      array.forEach((obj) => {
         delete obj.metadata;
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
      saveAs(blob, "transferencias.xls");
   };
   const { isHidden, toggleHidden } = hiddenDados();

   return (
      <>
         <main className="pt-12 px-[5%] h-full overflow-y-auto bg-[var(--background-primary-color)] ">
            <div className="flex justify-between items-center gap-10 w-full ">
               <div className="flex flex-col  w-[350px]">
                  <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
                     Data
                  </span>
                  <div className="flex gap-3 items-center px-3 py-2.5 bg-transparent w-full">
                     <input
                        type="date"
                        onInput={() => {
                           filter();
                        }}
                        id="before"
                        className="w-full bg-transparent"
                     />
                     <span>
                        <IoIosArrowForward />
                     </span>
                     <input
                        type="date"
                        onInput={() => {
                           filter();
                        }}
                        id="after"
                        className="w-full bg-transparent  "
                     />
                  </div>
               </div>
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
                  <CiExport
                     size={25}
                     className="hover:text-green-500 cursor-pointer"
                     onClick={() => {
                        if (!data.cashout) return;
                        download(data.cashout);
                     }}
                  />
               </div>
            </div>

            <div className="flex flex-col gap-10 my-20">
               {data ? (
                  data.cashout.map((item, i) => {
                     return (
                        <div
                           title={item.externalId}
                           key={i}
                           className={`gap-5 px-12 flex justify-between items-center text-[var(--title-primary-color)] py-8 rounded  w-full bg-[var(--background-secound-color)] border-l-8 ${
                              item.status == "success"
                                 ? "border-green-600"
                                 : "border-red-500"
                           } ${
                              item.status == "processing" && "border-yellow-500"
                           }`}
                        >
                           <div className="flex items-center gap-12  transition ">
                              <div className="flex flex-col  gap-2  ">
                                 <div className="flex gap-2">
                                    <CiUser size={20} />
                                    <span className="font-bold break-all">
                                       {item.name}
                                    </span>
                                 </div>
                                 <div className="flex gap-2">
                                    <CiDollar size={20} />
                                    <span className="text-sm">
                                       {isHidden
                                          ? "****"
                                          : formatarNumeroParaBRL(
                                               item.amount / 100
                                            )}
                                    </span>
                                 </div>
                              </div>
                              <MdArrowForwardIos
                                 className="max-[1000px]:hidden"
                                 size={25}
                              />
                              <div className="flex flex-col gap-2 max-[1000px]:hidden">
                                 <div className="flex gap-2">
                                    <CiUser size={20} />
                                    <span className="font-bold">
                                       {isHidden ? "****" : item.taxId}
                                    </span>
                                 </div>
                                 <div className="flex gap-2">
                                    <BiCalendar size={20} />
                                    <span className="text-sm">
                                       {convertDate(item.created)}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <BiDownload
                                 className="transition duration-300 cursor-pointer hover:text-blue-600"
                                 onClick={() => {
                                    ComprovanteTransfers(
                                       item.taxId,
                                       item.name,
                                       item.bankCode,
                                       item.branchCode,
                                       item.accountNumber,
                                       formatarNumeroParaBRL(
                                          (item.amount || 0) / 100
                                       ),
                                       item.id,
                                       item.created,
                                       "B2B ipy Tecnologia e Gestão",
                                       formatarNumeroParaBRL(
                                          (item.fee || 0) / 100
                                       )
                                    );
                                 }}
                                 size={30}
                              />
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

export default Transferencias;
