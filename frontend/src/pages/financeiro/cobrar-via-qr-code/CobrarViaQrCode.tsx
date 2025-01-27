import axios from "axios";
import $ from "jquery";
import "jquery-mask-plugin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useNavigate } from "react-router-dom";

import { MdPix } from "react-icons/md";
import { GrAdd, GrClose } from "react-icons/gr";
import { BiCopy, BiTrash } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
function BRLtoNumber(brl: string): number {
   return parseFloat(brl.replace(".", "").replace("R$", "").replace(",", "."));
}

interface qrcode {
   key: string;
}

function CobrarViaQrCode() {
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [modalConfirm, setModalConfirm] = useState<boolean>(false);
   const [modalVisible, setModalVisible] = useState<boolean>(false);
   const [deletePixkey, setDeletePixkey] = useState<string>("");
   $(() => {
      $(".MONEY").mask("000.000,00", { reverse: true });

      $(".DATA").mask("00/00/0000");
   });
   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };
   const [QRcodeData, setQRcodeData] = useState<qrcode>({
      key: "",
   });
   useEffect(() => {
      if (
         !tempoExpiracaoToken(localStorage.getItem("x-access-token") as string)
      )
         navigate("/login");
   }, []);

   return (
      <>
         <div className="gap-10 flex-col w-full h-screen overflow-y-auto flex items-center  bg-[var(--background-primary-color)] max-[1000px]:bg-[var(--background-secound-color)]">
            <dialog
               open={modalVisible}
               className="backdrop-blur-xl	 bg-transparent h-full w-full absolute top-0"
            >
               <div className="h-full w-full bg-transparent flex items-center justify-center ">
                  <form
                     className="bg-[var(--background-secound-color)] rounded-xl pr-20 pb-20 pl-5 pt-5 max-[1000px]:h-full max-[1000px]:w-full flex flex-col max-[1000px]:justify-between "
                     onSubmit={(e) => {
                        e.preventDefault();
                        setModalVisible(false);
                     }}
                  >
                     <div className="mb-16">
                        <GrClose
                           className="text-gray-200 cursor-pointer"
                           onClick={() => {
                              setModalVisible(false);
                           }}
                        />
                     </div>
                     <div className="pl-16">
                        <div className="text-gray-300 flex items-center gap-3">
                           <MdPix size={25} />
                           <span className="text-bold">
                              Leia o QR code abaixo com a camera ou copie e cole
                              o codigo
                           </span>
                        </div>
                        <div className="mt-5 pl-3 items-center justify-center rounded-xl flex gap-3">
                           <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=198x198&data=${QRcodeData.key}`}
                              alt="qr-code"
                              className="w-[140px] h-[140px]"
                           />
                        </div>
                        <div className="flex gap-3 w-full">
                           <div
                              onClick={() => {
                                 //copy id of qRcodeData
                                 navigator.clipboard.writeText(QRcodeData.key);
                                 toast.success("Código copiado com sucesso!");
                              }}
                              className="w-full mt-10 cursor-pointer transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[var(--primary-color)]"
                           >
                              {isLoading ? "carregando..." : "Copiar codigo"}
                           </div>
                        </div>
                     </div>
                     <div></div>
                  </form>
               </div>
            </dialog>

            <section className="max-[1000px]:w-full max-[1000px]:h-full w-[800px] mt-10">
               <div className="flex flex-col items-center  px-6 py-8 mx-auto max-[1000px]:px-0 max-[1000px]:py-0  lg:py-0 w-full h-full">
                  {!modalVisible && (
                     <div className="w-full  min-[1000px]:bg-[var(--background-secound-color)] rounded-lg shadow  md:mt-0 xl:p-0 w-full h-full">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                           <h1 className="text-xl font-bold leading-tight tracking-tight text-[var(--title-primary-color)] md:text-2xl">
                              Cobrar Pix via QR code
                           </h1>
                           <form
                              className="space-y-4 md:space-y-6"
                              id="form"
                              onSubmit={(e) => {
                                 e.preventDefault();
                                 const amount =
                                    ($("#valor").val() as string) || "0";
                                 const amount_number = BRLtoNumber(amount);

                                 const requestBody = {
                                    value: amount_number,
                                 };
                                 if (isLoading) return;
                                 setIsLoading(true);

                                 axios
                                    .post(
                                       "http://localhost:2311/transferir/pix/qr-code",
                                       requestBody,
                                       headers
                                    )
                                    .then((res) => {
                                       console.log(res.data);

                                       setQRcodeData({
                                          key: res.data.key,
                                       });
                                       setModalVisible(true);
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
                                          return toast.warn(
                                             "cobrança duplicada"
                                          );
                                       toast.error(
                                          "Erro ao cobrar por QR code"
                                       );
                                    })
                                    .finally(() => {
                                       setIsLoading(false);
                                    });
                              }}
                           >
                              <div className="flex flex-col gap-10 w-full max-[1000px]:flex-col">
                                 <div className="grid gap-5 w-full">
                                    <div>
                                       <label
                                          htmlFor="valor"
                                          className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                       >
                                          valor
                                       </label>
                                       <input
                                          type="text"
                                          id="valor"
                                          placeholder="0,00"
                                          className="MONEY bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                       />
                                    </div>
                                 </div>
                              </div>
                              <span className="text-gray-400 text-sm">
                                 Será cobrado uma taxa fixa adicional no valor
                                 de R$ 0,15
                              </span>
                              <button
                                 type="submit"
                                 className="w-full  cursor-pointer transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[var(--primary-color)]"
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
}
export default CobrarViaQrCode;
