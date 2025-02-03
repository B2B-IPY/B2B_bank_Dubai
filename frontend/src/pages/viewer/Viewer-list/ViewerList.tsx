import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiTrash, CiUser } from "react-icons/ci";
interface Users {
   id: number;
   user: string;
}
function ViewerList() {
   const navigate = useNavigate();

   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [data, setData] = useState<Users[]>([]);
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
         .get("https://api.binbank.com.br/viewer", headers)
         .then((res) => {
            const data = res.data;
            setData(data);
         })
         .catch((err) => {
            console.error(err);

            return toast.warn(err.response.data.status);
         })
         .finally(() => {
            setIsLoading(false);
         });
   }, []);

   return (
      <>
         <div className="gap-10 overflow-y-auto pb-10 px-[5%] flex-col w-full h-screen flex  bg-[var(--background-primary-color)]">
            <div className="mt-5  flex max-[1000px]:gap-20  max-[1000px]:items-center max-[1000px]:flex-col-reverse justify-between">
               <div></div>

               <div className="flex gap-3 items-center  justify-center">
                  <NavLink to="/viewer/novo">
                     <button
                        type="submit"
                        className="w-full focus:ring-4 transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] rounded-lg text-sm px-5 py-1.5 text-center bg-[var(--primary-color)]"
                     >
                        Adicionar
                     </button>
                  </NavLink>
               </div>
            </div>

            {data[0] ? (
               data.map((item, i) => {
                  return (
                     <div
                        key={i}
                        className={` px-12 flex justify-between items-center text-[var(--title-primary-color)] py-8 rounded  w-full bg-[var(--background-secound-color)] `}
                     >
                        <div className="flex items-center gap-12  transition ">
                           <div className="flex flex-col  gap-2  ">
                              <div className="flex gap-2" title="usuario">
                                 <CiUser size={20} />
                                 <span className="font-bold">{item.user}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <div className="flex flex-col gap-2  transition ">
                              {isLoading ? (
                                 <span>...</span>
                              ) : (
                                 <CiTrash
                                    className="cursor-pointer hover:text-red-600 transition"
                                    size={30}
                                    onClick={() => {
                                       setIsLoading(true);
                                       axios
                                          .delete(
                                             `https://api.binbank.com.br/viewer/${item.id}`,
                                             headers
                                          )
                                          .then(() => {
                                             setData(
                                                data.filter(
                                                   (i) => i.user !== item.user
                                                )
                                             );
                                             toast.success(
                                                "SubContas excluída com sucesso!"
                                             );
                                          })
                                          .catch((err) => {
                                             console.error(err);
                                             toast.error(
                                                err.response.data.status
                                             );
                                          })
                                          .finally(() => {
                                             setIsLoading(false);
                                          });
                                    }}
                                 />
                              )}
                           </div>
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
         </div>
      </>
   );
}
export default ViewerList;
