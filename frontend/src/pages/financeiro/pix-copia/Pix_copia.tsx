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
interface data {
   amount: number;
   name: string;
   taxId: string;
   accountNumber: string;
   branchCode: string;
   code: string;
}
export interface PixResponse {
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
   transactionIds: any[];
   metadata: string;
   created: string;
   updated: string;
}

export interface Res {
   type: string;
   pix_key: { key: string; type: string };
   txid: string;
   amount: number;
   receiver: { name: string; city: string };
   payer_question: null;
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
   const [data, setData] = useState<data>({
      amount: 0,
      name: "",
      taxId: "",
      accountNumber: "",
      branchCode: "",
      code: "",
   });
   const [resp, setResp] = useState<Res>({
      type: "",
      pix_key: { key: "", type: "" },
      txid: "",
      amount: 0,
      receiver: { name: "", city: "" },
      payer_question: null,
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [totpModal, setTotpModal] = useState<boolean>(false);
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
            {totpModal && (
               <dialog className="backdrop-blur-xl flex justify-center items-center bg-transparent h-full w-full absolute py-20 top-0 overflow-y-auto">
                  <div className="flex flex-col   items-center justify-center bg-[var(--background-secound-color)] border-2 border-[var(--border-color2)]">
                     <div className="flex w-full text-[var(--title-primary-color)] items-center justify-between px-4 py-6 border-b border-[var(--border-color2)]">
                        <span className="text-[18px] font-semibold">
                           Confirme o TOTP
                        </span>
                        <div
                           className="cursor-pointer"
                           onClick={() => {
                              setTotpModal(false);
                           }}
                        >
                           <MdClose className="text-[26px] " />
                        </div>
                     </div>

                     <div className="w-full flex flex-col items-center ">
                        <div className="w-[90%] flex flex-col py-4 gap-4 border-b-2 border-[var(--border-color)] ">
                           <span className=" text-[var(--title-primary-color)] text-[18px] font-semibold">
                              Digite o código de autenticação digital
                           </span>
                           <span className="text-[15px] text-[var(--title-primary-color)]">
                              Enviamos o código de autenticação para seu GOOGLE
                              AUTHENTICATOR.
                           </span>
                           <div className="flex">
                              <input
                                 type="text"
                                 id="totpCode"
                                 onInput={(e) => {
                                    const value = e.currentTarget.value;
                                    setData({
                                       ...data,
                                       code: value,
                                    });
                                 }}
                                 className="TOTP text-[var(--white-color2)]  border-2 border-[var(--border-color2)] rounded-lg px-4 w py-2 w-[80%] focus:border-[var(--active-color)] focus:border-2 bg-transparent"
                                 placeholder="000000"
                              />
                           </div>
                           <div className="flex">
                              <div
                                 onClick={() => {
                                    setTotpModal(false);
                                 }}
                                 className="flex w-[full] gap-2 cursor-pointer items-center text-[#2c80ff]"
                              >
                                 <IoMdArrowRoundBack /> Voltar
                              </div>
                           </div>
                        </div>
                        <div className="w-[90%] flex justify-end py-5 gap-4">
                           <button
                              onClick={() => {
                                 if (isLoading) return;
                                 if (!data.code)
                                    return toast.warn("digite o TOTP");
                                 setIsLoading(true);

                                 axios
                                    .post(
                                       "http://localhost:2311/pix/emv/pagar",
                                       {
                                          value: resp.amount,
                                          pixAddressKey: data.taxId,
                                          code: data.code,
                                       },
                                       headers
                                    )
                                    .then((res) => {
                                       console.log(res.data);

                                       setTotpModal(false);
                                       toast.success(
                                          "Transferência realizada com sucesso"
                                       );

                                       const currentTime =
                                          new Date().toLocaleTimeString();

                                       const blob = ComprovantePix(
                                          resp.pix_key.key,
                                          resp.receiver.name,
                                          "",
                                          res.data.received_bank_account.Bank
                                             .name,
                                          res.data.received_bank_account.agency,
                                          res.data.received_bank_account
                                             .account,
                                          "",
                                          formatarNumeroParaBRL(resp.amount),
                                          (res.data.id as number).toString(),
                                          currentTime,
                                          normalizeTimeStamp(
                                             res.data.created_at
                                          )
                                       );
                                       setIframeUrl(blob);
                                    })
                                    .catch((err) => {
                                       console.error(err);

                                       return toast.warn(
                                          err.response.data.description ||
                                             "Ocorreu um erro na transferência"
                                       );
                                    })
                                    .finally(() => {
                                       setIsLoading(false);
                                       setModalVisible(false);
                                    });
                              }}
                              className=" transition flex gap-2 items-center justify-center h-10 text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-[var(--primary-color)] hover:bg-transparent hover:border-[var(--primary-color)] hover:border-2 hover:text-[var(--primary-color)]"
                           >
                              {isLoading ? "carregando..." : "Transferir"}
                           </button>
                        </div>
                     </div>
                  </div>
               </dialog>
            )}
            <dialog
               open={modalVisible}
               className="backdrop-blur-xl	 bg-transparent h-full w-full absolute top-0"
            >
               <div className="h-full w-full bg-transparent flex items-center justify-center ">
                  <form
                     className="bg-[var(--background-secound-color)] max-[1000px]:border max-[1000px]:border-gray-500/50 max-[1000px]:px-10 max-[1000px]:py-5 rounded-xl  flex flex-col justify-between"
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
                           <div className="text-gray-300 flex items-center gap-4">
                              <BiUser size={25} />
                              <span className="text-bold text-sm">
                                 {resp.receiver.name}
                              </span>
                           </div>
                           <div className="text-gray-300 flex items-center gap-4">
                              <HiCash size={25} />
                              <span className="text-bold text-sm">
                                 R$ {formatarNumeroParaBRL(resp.amount || 0)}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-10 w-full justify-center mb-10  mt-10 items-center ">
                        <div
                           onClick={() => {
                              const required2fa =
                                 localStorage.getItem("required_2fa");

                              if (required2fa === "1") {
                                 setModalVisible(false);

                                 return setTotpModal(true);
                              }
                              setIsLoading(true);
                              axios
                                 .post(
                                    "http://localhost:2311/pix/emv/pagar",
                                    {
                                       code: data.code,

                                       pixAddressKey: data.taxId,
                                       value: resp.amount,
                                    },

                                    headers
                                 )
                                 .then((res) => {
                                    console.log(res.data);

                                    setTotpModal(false);
                                    toast.success(
                                       "Transferência realizada com sucesso"
                                    );

                                    const currentTime =
                                       new Date().toLocaleTimeString();

                                    const blob = ComprovantePix(
                                       resp.pix_key.key,
                                       resp.receiver.name,
                                       "",
                                       res.data.received_bank_account.Bank.name,
                                       res.data.received_bank_account.agency,
                                       res.data.received_bank_account.account,
                                       "",
                                       formatarNumeroParaBRL(resp.amount),
                                       (res.data.id as number).toString(),
                                       currentTime,
                                       normalizeTimeStamp(res.data.created_at)
                                    );
                                    setIframeUrl(blob);
                                 })
                                 .catch((err) => {
                                    console.error(err);
                                    if (err.response.status === 401)
                                       return toast.warn("Codigo invalido");
                                    setTotpModal(false);
                                    if (err.response.status === 409)
                                       return toast.warn("Pix Duplicado");
                                    if (err.response.data.description)
                                       return toast.warn(
                                          err.response.data.description
                                       );

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
                  {!modalVisible && !totpModal && (
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
                                    .post(
                                       `http://localhost:2311/pix/emv/consultar`,
                                       {
                                          key: data.taxId,
                                       },
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
                                             id="taxId"
                                             className="w-full bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block  p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                             required
                                             onInput={(e) => {
                                                const value =
                                                   e.currentTarget.value;

                                                setData({
                                                   ...data,
                                                   taxId: value,
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
