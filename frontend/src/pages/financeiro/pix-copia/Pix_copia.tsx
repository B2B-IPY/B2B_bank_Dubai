import axios from "axios";
import $ from "jquery";
import "jquery-mask-plugin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useNavigate } from "react-router-dom";
import { BiKey, BiUser } from "react-icons/bi";
import { HiCash } from "react-icons/hi";
import { GrClose } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ComprovantePix } from "../../../functions/createPixPDF";
import normalizeTimeStamp from "../../../functions/normalizeTimeStamp";
import { ComprovantePixCopiaCola } from "../../../functions/createPixPDFCopiaCola";

export interface PixResponse {
   countryCode: string;
   merchantCategoryCode: string;
   merchantCity: string;
   merchantName: string;
   pixKey: string;
   transactionAmount: number;
   transactionCurrency: string;
   txid: string;
   type: string;
}

export interface Res {
   key: string;
   keyType: { key: string; type: string };
   msg: string;
   statusCode: number;
}

function BRLtoNumber(brl: string) {
   return parseFloat(brl.replace(".", "").replace(",", "."));
}

function formatarNumeroParaBRL(numero: number): string {
   const formatoMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   });
   return formatoMoeda.format(numero).replace("R$", "").trim();
}

const TransferirPixCopiaCola: React.FC = () => {
   const [pixData, setPixData] = useState<PixResponse>({
      countryCode: "",
      merchantCategoryCode: "",
      merchantCity: "",
      merchantName: "",
      pixKey: "",
      transactionAmount: 0,
      transactionCurrency: "",
      txid: "",
      type: "",
   });
   const [resp, setResp] = useState<Res>({
      key: "",
      keyType: { key: "", type: "" },
      msg: "",
      statusCode: 0,
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [iframeUrl, setIframeUrl] = useState<string | null>(null);

   $(() => {
      $(".MONEY").mask("###.000,00", { reverse: true });
      $(".TOTP").mask("000 000");
   });
   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };

   const navigate = useNavigate();
   useEffect(() => {
      if (
         !tempoExpiracaoToken(localStorage.getItem("x-access-token") as string)
      )
         navigate("/login");
   }, []);

   return (
      <>
         <div className="gap-10 flex-col w-full h-screen overflow-y-auto flex items-center  bg-[var(--background-primary-color)] max-[1000px]:bg-[var(--background-secound-color)]">
            {iframeUrl && (
               <dialog className="backdrop-blur-xl flex flex-col justify-center items-center bg-transparent h-full w-full absolute p-2 top-0 overflow-y-auto">
                  <iframe src={iframeUrl} className="w-[700px] h-full" />
                  <div
                     onClick={() => {
                        setIframeUrl(null);
                     }}
                     className="w-[700px] text-center bg-[var(--active-color)] text-white p-2 cursor-pointer font-semibold"
                  >
                     Fechar
                  </div>
               </dialog>
            )}

            <dialog
               open={modalVisible}
               className="backdrop-blur-xl	 bg-transparent h-full w-full absolute top-0"
            >
               <div className="h-full w-full bg-transparent flex items-center justify-center ">
                  <form
                     className="bg-[var(--background-secound-color)] max-[1000px]:border max-[1000px]:border-gray-500/50 max-[1000px]:px-10 max-[1000px]:py-5 rounded-xl  flex flex-col justify-between min-[500px]:mx-10 max-[500px]:w-200"
                     onSubmit={(e) => {
                        e.preventDefault();
                        setModalVisible(false);
                     }}
                  >
                     <div className="pl-3 pt-3">
                        <GrClose
                           className="text-gray-200 cursor-pointer"
                           onClick={() => {
                              setModalVisible(false);
                           }}
                        />
                     </div>
                     <div className="flex  w-full max-[1000px]:items-center min-[1000px]:px-40 mt-20 flex-col gap-4">
                        <div className="flex-col gap-4 flex">
                           <div className="text-gray-300  flex items-center gap-4">
                              <BiUser size={25} />
                              <div className="flex max-[500px]:w-[200px] max-[500px]:overflow-x-scroll">
                                 <span className="text-bold text-sm broke-all max-[500px]:w-[200px]">
                                    {resp.key}
                                 </span>
                              </div>
                           </div>
                           {/* <div className="text-gray-300 flex items-center gap-4">
                              <HiCash size={25} />
                              <span className="text-bold text-sm">
                                 R$ {formatarNumeroParaBRL(data.amount || 0)}
                              </span>
                           </div> */}
                        </div>
                     </div>
                     <div className="flex gap-10 w-full justify-center mb-10  mt-10 items-center ">
                        <div
                           onClick={() => {
                              setIsLoading(true);
                              axios
                                 .post(
                                    "https://api.binbank.com.br/pix/emv/transfer",
                                    {
                                       emv: resp.key,
                                    },

                                    headers
                                 )
                                 .then(({ data }) => {
                                    console.log(data);

                                    toast.success(
                                       "Transferência realizada com sucesso"
                                    );
                                    const today = new Date().toLocaleDateString(
                                       "pt-BR"
                                    );

                                    setPixData(data.data);
                                    const currentTime =
                                       new Date().toLocaleTimeString();

                                    const blob = ComprovantePixCopiaCola(
                                       data.data.pixKey,
                                       data.data.merchantName,
                                       formatarNumeroParaBRL(
                                          pixData.transactionAmount
                                       ),
                                       data.data.txid,
                                       currentTime,
                                       today.split("T")[0]
                                    );
                                    setIframeUrl(blob);
                                 })
                                 .catch((err) => {
                                    console.error(err);

                                    toast.error(
                                       "Ocorreu um erro na transferência"
                                    );
                                 })
                                 .finally(() => {
                                    setIsLoading(false);
                                    setModalVisible(false);
                                 });
                           }}
                           className="max-[1000px]:w-[90%] transition min-[1000px]:px-20 text-white focus:outline-none hover:bg-[var(--hover-primary-color)] font-medium rounded-lg text-sm py-2.5 text-center bg-[var(--primary-color)] cursor-pointer"
                        >
                           {isLoading ? "carregando..." : "Pagar"}
                        </div>
                     </div>
                  </form>
               </div>
            </dialog>

            <section className="max-[1000px]:w-full max-[1000px]:h-full w-[800px] my-10">
               <div className="flex flex-col items-center  px-6 py-8 mx-auto max-[1000px]:px-0 max-[1000px]:py-0  lg:py-0 w-full h-full">
                  {!modalVisible && (
                     <div className="w-full  min-[1000px]:bg-[var(--background-secound-color)] rounded-lg shadow  md:mt-0 xl:p-0 w-full h-full">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                           <h1 className="text-xl font-bold leading-tight tracking-tight text-[var(--title-primary-color)] md:text-2xl">
                              Transferir Pix Copia e Cola
                           </h1>
                           <form
                              className="space-y-4 md:space-y-6"
                              id="form"
                              onSubmit={(e) => {
                                 e.preventDefault();
                                 if (isLoading) return;
                                 setIsLoading(true);

                                 axios
                                    .get(
                                       `https://api.binbank.com.br/pix/consultar/${resp.key}`,
                                       headers
                                    )
                                    .then((res) => {
                                       console.log(res.data);
                                       setResp(res.data);
                                       setModalVisible(true);
                                    })
                                    .catch((err) => {
                                       console.log(err);
                                       toast.error("Chave pix não encontrada");
                                    })
                                    .finally(() => {
                                       setIsLoading(false);
                                    });
                              }}
                           >
                              <div className="flex flex-col gap-10 w-full max-[1000px]:flex-col">
                                 <div className="grid md:grid-cols-1 gap-5 w-full">
                                    <div>
                                       <label
                                          htmlFor="chave"
                                          className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                       >
                                          chave
                                       </label>

                                       <div className="flex w-full gap-5 justify-between">
                                          <input
                                             type="text"
                                             id="key"
                                             className="w-full bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block  p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                             required
                                             onInput={(e) => {
                                                const value =
                                                   e.currentTarget.value;

                                                setResp({
                                                   ...resp,
                                                   key: value,
                                                });
                                             }}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <span className="text-gray-400 text-sm">
                                 Será cobrado uma taxa fixa adicional no valor
                                 de R$ 0,15
                              </span>
                              <button
                                 disabled={isLoading}
                                 type="submit"
                                 className="w-full   transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[var(--primary-color)]"
                              >
                                 {isLoading ? "carregando..." : "continuar"}
                              </button>
                           </form>
                        </div>
                     </div>
                  )}
               </div>
            </section>
         </div>
      </>
   );
};
export default TransferirPixCopiaCola;
