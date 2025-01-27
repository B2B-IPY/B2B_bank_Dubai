import axios from "axios";
import $ from "jquery";
import "jquery-mask-plugin";

import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CadastrarViewer() {
   $(() => {
      $(".TOTP").mask("000 000");
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [requestBody, setRequestBody] = useState({
      user: "",
      totp: "",
   });

   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };

   const navigate = useNavigate();

   return (
      <>
         <div className="gap-10 flex-col w-full h-screen overflow-y-auto flex items-center  bg-[var(--background-primary-color)] max-[1000px]:bg-[var(--background-secound-color)]">
            <section className="max-[1000px]:w-full max-[1000px]:h-full w-[800px] my-10 ">
               <div className="flex flex-col items-center   px-6 py-8 mx-auto max-[1000px]:px-0 max-[1000px]:py-0  lg:py-0 w-full min-h-full">
                  <div className=" flex flex-col items-center  md:mt-0 xl:p-0 w-full h-full">
                     <div className="p-6 space-y-4 flex flex-col items-center md:space-y-6 sm:p-8">
                        <h1 className=" text-xl font-bold leading-tight tracking-tight max-[1000px]:text-[var(--title-primary-color)]  text-[var(--background-secound-color)] md:text-2xl">
                           Cadastrar conta fantasma
                        </h1>
                        <form
                           className="space-y-4 flex flex-col items-center md:space-y-6"
                           id="form"
                           onSubmit={(e) => {
                              e.preventDefault();

                              if (
                                 isLoading ||
                                 !requestBody.totp ||
                                 !requestBody.user
                              )
                                 return;
                              if (requestBody.user.includes(" "))
                                 return toast.warning(
                                    "apenas letras são aceitas no usuario, sem espaços"
                                 );
                              setIsLoading(true);

                              axios
                                 .post(
                                    "https://api.noutbank.com.br/viewer/criar",
                                    requestBody,
                                    headers
                                 )
                                 .then(() => {
                                    toast.success(
                                       "Conta cadastrada com sucesso!"
                                    );
                                    navigate("/viewer");
                                 })
                                 .catch((err) => {
                                    console.error(err);
                                    return toast.warn(err.response.data.status);
                                 })
                                 .finally(() => {
                                    setIsLoading(false);
                                 });
                           }}
                        >
                           <div className="flex flex-col items-center   px-6 py-8 mx-auto max-[1000px]:px-0 max-[1000px]:py-0  lg:py-0 w-full ">
                              <div className="min-[1000px]:bg-[var(--background-secound-color)] rounded-lg shadow p-10 grid md:grid-cols-2 gap-5 w-full">
                                 <div>
                                    <label
                                       htmlFor="user"
                                       className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                    >
                                       Usuario
                                    </label>
                                    <input
                                       type="text"
                                       id="user"
                                       maxLength={15}
                                       minLength={3}
                                       className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                       placeholder="gstv"
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;
                                          setRequestBody((prev) => {
                                             return {
                                                ...prev,
                                                user: value,
                                             };
                                          });
                                       }}
                                       required
                                    />
                                 </div>
                                 <div>
                                    <label
                                       htmlFor="user"
                                       className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                                    >
                                       TOTP
                                    </label>
                                    <input
                                       type="text"
                                       id="totp"
                                       maxLength={7}
                                       minLength={7}
                                       className="TOTP bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                       placeholder="000 000"
                                       onInput={(e) => {
                                          const value = e.currentTarget.value;
                                          setRequestBody((prev) => {
                                             return {
                                                ...prev,
                                                totp: value,
                                             };
                                          });
                                       }}
                                       required
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="flex flex-col items-center   px-6 py-8 mx-auto max-[1000px]:px-0 max-[1000px]:py-0  lg:py-0 w-full ">
                              <button
                                 type="submit"
                                 className="w-full  transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[var(--primary-color)]"
                              >
                                 {isLoading ? "Carregando..." : "Cadastrar"}
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
export default CadastrarViewer;
