import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

import { toast } from "react-toastify";
import $ from "jquery";
import { BiX } from "react-icons/bi";
import tempoExpiracaoToken from "../../functions/tempoExpiracaoToken";
import { BRLtoNumber, formatarNumeroParaBRL } from "../../functions/moeda";
import { gerarNumeroAleatorio } from "../../functions/numeroAleatorio";
import { codificarPayload } from "../../functions/payload";
import { Taxas_representante, Taxas } from "../../interfaces/taxas";

interface Representantes {
   id_logins: number;
   user: string;
   user_id: string;
}

function GerarLinkDoRepresentante() {
   const taxas: Taxas = {
      bank: {
         cashin: { fixo: "0", porcentagem: "0" },
         cashout: { fixo: "0", porcentagem: "0" },
      },
   };

   const generateLink = (): string => {
      const json = JSON.stringify(taxas_representante);
      console.log(taxas_representante);

      const json_encoded = codificarPayload(json);
      const dominioAtual = `${window.location.protocol}//${
         window.location.hostname
      }${window.location.port ? ":" + window.location.port : ""}`;

      const link = `${dominioAtual}/abertura-de-contas?params=${json_encoded}`;
      return link;
   };
   const [taxas_representante, setTaxasRepresentante] = useState<
      Taxas_representante[]
   >([]);

   const [representantes, setRepresentantes] = useState<Representantes[]>([]);

   $(() => {
      $(".MONEY").mask("000.000.000,00", { reverse: true });
      $(".PORCENTAGEM").mask("00.00", { reverse: true });
      $(".TOTP").mask("000 000", { reverse: true });
   });

   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState<boolean>(true);

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
         .get("http://localhost:2311/representantes", headers)
         .then(({ data }) => {
            console.log(data);
            setRepresentantes(data);
         })
         .catch((error) => {
            console.error(error);

            toast.error(
               error.response.data.error || "Falha ao carregar representantes"
            );
         })
         .finally(() => {
            setIsLoading(false);
         });
   }, []);
   return (
      <>
         <div className="gap-10 flex-col pb-20 px-[5%] w-full h-screen flex overflow-y-auto items-center bg-[var(--background-primary-color)]">
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
                  <div className="w-full mt-20 mx-[5%]">
                     <div className=" flex flex-col gap-2 w-full rounded-lg bg-[var(--background-secound-color)]">
                        <div className="flex divide-y divide-gray-200/20 flex-col bg-[var(--background-secound-color)] w-full rounded px-12  ">
                           <div className="grid gap-10 py-10">
                              <div className="flex flex-col gap-4">
                                 <label
                                    htmlFor="representante"
                                    className="block text-sm font-medium text-[var(--title-primary-color)] "
                                 >
                                    representante
                                 </label>
                                 <select
                                    id="representante"
                                    className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                                    required
                                    onChange={(e) => {
                                       const select = e.currentTarget;
                                       const value = select.value;
                                       if (!value) return;
                                       const value_split = value.split("/");
                                       const id = parseInt(value_split[0]);
                                       const user = value_split[1];
                                       const user_id = value_split[2];

                                       if (
                                          taxas_representante.filter(
                                             (value) => value.id == id
                                          )[0]
                                       )
                                          return;
                                       setTaxasRepresentante((prev) => {
                                          return [
                                             ...prev,
                                             {
                                                uuid: parseInt(
                                                   gerarNumeroAleatorio()
                                                ),
                                                id: id,
                                                user: user,
                                                user_id: id.toString(),
                                                taxas: taxas,
                                             },
                                          ];
                                       });
                                    }}
                                 >
                                    <option value="">Nenhum</option>
                                    {representantes.map((representante, i) => {
                                       return (
                                          <option
                                             key={i}
                                             value={
                                                representante.id_logins +
                                                "/" +
                                                representante.user +
                                                "/" +
                                                representante.user_id
                                             }
                                          >
                                             {representante.user}
                                          </option>
                                       );
                                    })}
                                 </select>
                                 <div className="flex  gap-3 flex-wrap">
                                    {taxas_representante.map(
                                       (representante, i) => {
                                          return (
                                             <div
                                                onClick={() => {
                                                   setTaxasRepresentante(
                                                      (prev) => {
                                                         return prev.filter(
                                                            (item) =>
                                                               item.uuid !==
                                                               representante.uuid
                                                         );
                                                      }
                                                   );
                                                }}
                                                key={i}
                                                className="text-[var(--title-primary-color)] py-1 px-5 rounded-lg flex items-center justify-between border border-gray-200/15 hover:border-red-600 hover:text-red-600 transition cursor-pointer bg-gray-200/5 gap-3"
                                             >
                                                <span className="text-sm">
                                                   {representante.user}
                                                </span>
                                                <BiX size={15} />
                                             </div>
                                          );
                                       }
                                    )}
                                 </div>
                                 <div className="grid gap-10 ">
                                    <button
                                       className="text-[var(--title-primary-color)] rounded font-bold capitalize bg-[var(--primary-color)] px-8 py-2 hover:opacity-90 transition"
                                       onClick={() => {
                                          const link = generateLink();
                                          navigator.clipboard.writeText(link);
                                          toast.success(
                                             "Link copiado para a área de transferência!"
                                          );
                                       }}
                                    >
                                       Copiar Link
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {taxas_representante.map((representante, i) => {
                              return (
                                 <div
                                    key={i}
                                    className=" flex flex-col gap-2 w-full rounded-lg bg-[var(--background-secound-color)]"
                                 >
                                    <div className="py-8 px-8">
                                       <h2 className=" tracking-wide text-[var(--title-primary-color)] md:text-2xl">
                                          {representante.user}
                                       </h2>
                                    </div>
                                    <div className="lg:grid grid-cols-2 pb-10">
                                       <div className="flex flex-col items-center w-full ">
                                          <div className="  rounded-lg shadow  md:mt-0 xl:p-0 w-full h-full">
                                             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                                <h3 className="text-xl font-bold leading-tight tracking-tight text-[var(--title-primary-color)] md:text-2xl">
                                                   Cash-In
                                                </h3>
                                                <div className="space-y-4 md:space-y-6">
                                                   <div className="flex flex-col gap-10 w-full max-[1000px]:flex-col">
                                                      <div className="grid  gap-5 w-full">
                                                         <div>
                                                            <label className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] ">
                                                               Pix
                                                            </label>
                                                            <div className="flex gap-3">
                                                               <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                                                  <span>
                                                                     R$
                                                                  </span>
                                                                  <input
                                                                     type="text"
                                                                     defaultValue={formatarNumeroParaBRL(
                                                                        parseFloat(
                                                                           representante
                                                                              .taxas
                                                                              .bank
                                                                              .cashin
                                                                              .fixo
                                                                        )
                                                                     )}
                                                                     onInput={(
                                                                        e
                                                                     ) => {
                                                                        const value =
                                                                           e
                                                                              .currentTarget
                                                                              .value;
                                                                        setTaxasRepresentante(
                                                                           (
                                                                              prev
                                                                           ) => {
                                                                              return prev.map(
                                                                                 (
                                                                                    item
                                                                                 ) => {
                                                                                    if (
                                                                                       item.uuid ===
                                                                                       representante.uuid
                                                                                    ) {
                                                                                       return {
                                                                                          ...item,
                                                                                          taxas: {
                                                                                             ...item.taxas,
                                                                                             bank: {
                                                                                                ...item
                                                                                                   .taxas
                                                                                                   .bank,
                                                                                                cashin:
                                                                                                   {
                                                                                                      ...item
                                                                                                         .taxas
                                                                                                         .bank
                                                                                                         .cashin,
                                                                                                      fixo: BRLtoNumber(
                                                                                                         value
                                                                                                      ).toString(),
                                                                                                   },
                                                                                             },
                                                                                          },
                                                                                       };
                                                                                    }
                                                                                    return item;
                                                                                 }
                                                                              );
                                                                           }
                                                                        );
                                                                     }}
                                                                     className="MONEY flex  w-full bg-transparent"
                                                                     required
                                                                  />
                                                               </div>
                                                               <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                                                  <input
                                                                     type="text"
                                                                     defaultValue={
                                                                        representante
                                                                           .taxas
                                                                           .bank
                                                                           .cashin
                                                                           .porcentagem
                                                                     }
                                                                     onInput={(
                                                                        e
                                                                     ) => {
                                                                        const value =
                                                                           e
                                                                              .currentTarget
                                                                              .value;
                                                                        setTaxasRepresentante(
                                                                           (
                                                                              prev
                                                                           ) => {
                                                                              return prev.map(
                                                                                 (
                                                                                    item
                                                                                 ) => {
                                                                                    if (
                                                                                       item.uuid ===
                                                                                       representante.uuid
                                                                                    ) {
                                                                                       return {
                                                                                          ...item,
                                                                                          taxas: {
                                                                                             ...item.taxas,
                                                                                             bank: {
                                                                                                ...item
                                                                                                   .taxas
                                                                                                   .bank,
                                                                                                cashin:
                                                                                                   {
                                                                                                      ...item
                                                                                                         .taxas
                                                                                                         .bank
                                                                                                         .cashin,
                                                                                                      porcentagem:
                                                                                                         value,
                                                                                                   },
                                                                                             },
                                                                                          },
                                                                                       };
                                                                                    }
                                                                                    return item;
                                                                                 }
                                                                              );
                                                                           }
                                                                        );
                                                                     }}
                                                                     className="PORCENTAGEM flex text-end w-full bg-transparent"
                                                                     required
                                                                  />
                                                                  <span>%</span>
                                                               </div>
                                                            </div>
                                                         </div>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="flex flex-col items-center  w-full ">
                                          <div className="  rounded-lg shadow  md:mt-0 xl:p-0 w-full h-full">
                                             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                                <h3 className="text-xl font-bold leading-tight tracking-tight text-[var(--title-primary-color)] md:text-2xl">
                                                   Cash-Out
                                                </h3>
                                                <div className="space-y-4 md:space-y-6">
                                                   <div className="flex flex-col gap-10 w-full max-[1000px]:flex-col">
                                                      <div className="grid  gap-5 w-full">
                                                         <div>
                                                            <label className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] ">
                                                               Pix
                                                            </label>
                                                            <div className="flex gap-3">
                                                               <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                                                  <span>
                                                                     R$
                                                                  </span>
                                                                  <input
                                                                     type="text"
                                                                     defaultValue={formatarNumeroParaBRL(
                                                                        parseFloat(
                                                                           representante
                                                                              .taxas
                                                                              .bank
                                                                              .cashout
                                                                              .fixo
                                                                        )
                                                                     )}
                                                                     onInput={(
                                                                        e
                                                                     ) => {
                                                                        const value =
                                                                           e
                                                                              .currentTarget
                                                                              .value;
                                                                        setTaxasRepresentante(
                                                                           (
                                                                              prev
                                                                           ) => {
                                                                              return prev.map(
                                                                                 (
                                                                                    item
                                                                                 ) => {
                                                                                    if (
                                                                                       item.uuid ===
                                                                                       representante.uuid
                                                                                    ) {
                                                                                       return {
                                                                                          ...item,
                                                                                          taxas: {
                                                                                             ...item.taxas,
                                                                                             bank: {
                                                                                                ...item
                                                                                                   .taxas
                                                                                                   .bank,
                                                                                                cashout:
                                                                                                   {
                                                                                                      ...item
                                                                                                         .taxas
                                                                                                         .bank
                                                                                                         .cashout,
                                                                                                      fixo: BRLtoNumber(
                                                                                                         value
                                                                                                      ).toString(),
                                                                                                   },
                                                                                             },
                                                                                          },
                                                                                       };
                                                                                    }
                                                                                    return item;
                                                                                 }
                                                                              );
                                                                           }
                                                                        );
                                                                     }}
                                                                     className="MONEY flex  w-full bg-transparent"
                                                                     required
                                                                  />
                                                               </div>
                                                               <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                                                  <input
                                                                     type="text"
                                                                     defaultValue={
                                                                        representante
                                                                           .taxas
                                                                           .bank
                                                                           .cashin
                                                                           .porcentagem
                                                                     }
                                                                     onInput={(
                                                                        e
                                                                     ) => {
                                                                        const value =
                                                                           e
                                                                              .currentTarget
                                                                              .value;
                                                                        setTaxasRepresentante(
                                                                           (
                                                                              prev
                                                                           ) => {
                                                                              return prev.map(
                                                                                 (
                                                                                    item
                                                                                 ) => {
                                                                                    if (
                                                                                       item.uuid ===
                                                                                       representante.uuid
                                                                                    ) {
                                                                                       return {
                                                                                          ...item,
                                                                                          taxas: {
                                                                                             ...item.taxas,
                                                                                             bank: {
                                                                                                ...item
                                                                                                   .taxas
                                                                                                   .bank,
                                                                                                cashout:
                                                                                                   {
                                                                                                      ...item
                                                                                                         .taxas
                                                                                                         .bank
                                                                                                         .cashout,
                                                                                                      porcentagem:
                                                                                                         BRLtoNumber(
                                                                                                            value
                                                                                                         ).toString(),
                                                                                                   },
                                                                                             },
                                                                                          },
                                                                                       };
                                                                                    }
                                                                                    return item;
                                                                                 }
                                                                              );
                                                                           }
                                                                        );
                                                                     }}
                                                                     className="PORCENTAGEM flex text-end w-full bg-transparent"
                                                                     required
                                                                  />
                                                                  <span>%</span>
                                                               </div>
                                                            </div>
                                                         </div>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
      </>
   );
}
export default GerarLinkDoRepresentante;
