import { NavLink } from "react-router-dom";
import logo from "/assets/icon.png";

import { MdAttachMoney, MdManageAccounts } from "react-icons/md";
import { CiCreditCard1, CiHome, CiUser, CiWallet } from "react-icons/ci";
import { MouseEvent } from "react";
import { userInfos } from "../../redux/userInfos";
import { BiListCheck, BiSupport, BiTrendingUp } from "react-icons/bi";
import { toast } from "react-toastify";
interface Props {
   isHidden: boolean;
}
function Sidebar(props: Props) {
   const localStorageDadosBancarios = localStorage.getItem("dadosBancarios");
   const dadosBancarios =
      localStorageDadosBancarios != "undefined" && !!localStorageDadosBancarios
         ? JSON.parse(localStorage.getItem("dadosBancarios") as string)[0]
         : {
              id: "",
              ispb: "462",
              taxId: "",
              branchCode: "",
              name: "",
              accountNumber: "",
           };
   const admin = parseInt(localStorage.getItem("admin") as string);
   return (
      <>
         <div className="h-screen px-5 w-[300px] bg-[var(--background-secound-color)] border-r border-gray-400/50 max-[600px]:hidden">
            <div className="pb-8 pt-5 flex justify-end ">
               <img src={logo} alt="logo-icon" className="w-[40px]" />
            </div>
            <nav className="h-[calc(100%-92px)]">
               <ul className="flex gap-3 flex-col  overflow-y-auto h-full ">
                  <li className="">
                     <NavLink
                        to="/"
                        className={({ isActive }) =>
                           isActive
                              ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b-2 border-[var(--primary-color)] "
                              : "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3"
                        }
                     >
                        <CiHome size={24} />
                        Início
                     </NavLink>
                  </li>
                  <li>
                     <div className="text-[var(--title-primary-color)] flex flex-col gap-2 py-2 pl-3 overflow-y-hidden h-[40px] transition">
                        <div
                           className="text-[var(--title-primary-color)] flex gap-2 font-semibold cursor-pointer"
                           onClick={(e: MouseEvent<HTMLDivElement>) => {
                              const box = e.currentTarget
                                 .parentNode as HTMLElement;
                              box.classList.toggle("h-[150px]");
                           }}
                        >
                           <BiListCheck size={28} />
                           <span>Extrato</span>
                        </div>
                        <div className="border-gray-200 border-l rounded pl-4 ml-6 mt-3">
                           <NavLink
                              to="/financeiro/extrato/transacoes"
                              className={({ isActive }) =>
                                 isActive
                                    ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                    : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                              }
                           >
                              Transações
                           </NavLink>
                           <NavLink
                              to="/financeiro/boletos"
                              className={({ isActive }) =>
                                 isActive
                                    ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                    : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                              }
                           >
                              Boletos
                           </NavLink>
                        </div>
                     </div>
                  </li>
                  {(localStorage.getItem("role") == "representante" ||
                     localStorage.getItem("role") == "admin" ||
                     localStorage.getItem("role") == "comercial") && (
                     <li>
                        <div className="text-[var(--title-primary-color)] flex flex-col gap-2 py-2 pl-3 overflow-y-hidden h-[40px] transition">
                           <div
                              className="text-[var(--title-primary-color)] flex gap-2 font-semibold cursor-pointer"
                              onClick={(e: MouseEvent<HTMLDivElement>) => {
                                 const box = e.currentTarget
                                    .parentNode as HTMLElement;
                                 box.classList.toggle("h-[100px]");
                              }}
                           >
                              <MdManageAccounts size={24} />
                              <span>Afiliado</span>
                           </div>
                           <div className="border-gray-200 border-l rounded pl-4 ml-6 mt-3">
                              <NavLink
                                 to="/gerar-link"
                                 className={({ isActive }) =>
                                    isActive
                                       ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                       : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                                 }
                              >
                                 Gerar link
                              </NavLink>
                           </div>
                        </div>
                     </li>
                  )}

                  <li>
                     <div className="text-[var(--title-primary-color)] flex flex-col gap-2 py-2 pl-3 overflow-y-hidden h-[40px] transition">
                        <div
                           className="text-[var(--title-primary-color)] flex gap-2 font-semibold cursor-pointer"
                           onClick={(e: MouseEvent<HTMLDivElement>) => {
                              const box = e.currentTarget
                                 .parentNode as HTMLElement;
                              box.classList.toggle(`h-[240px]`);
                           }}
                        >
                           <MdAttachMoney size={24} />
                           <span>financeiro</span>
                        </div>
                        <div className="border-gray-200 border-l rounded pl-4 ml-6 mt-3">
                           <NavLink
                              to="/financeiro/transferencia/qr-code"
                              className={({ isActive }) =>
                                 isActive
                                    ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                    : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                              }
                           >
                              QR code
                           </NavLink>

                           <NavLink
                              to="/financeiro/transferencia/pix"
                              className={({ isActive }) =>
                                 isActive
                                    ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                    : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                              }
                           >
                              Saque
                           </NavLink>
                           <NavLink
                              to="/financeiro/transferencia/pix-copiaCola"
                              className={({ isActive }) =>
                                 isActive
                                    ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                    : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                              }
                           >
                              Pix copia e cola
                           </NavLink>
                           <NavLink
                              to="/financeiro/pagamentos/boleto"
                              className={({ isActive }) =>
                                 isActive
                                    ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                    : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                              }
                           >
                              pgto boleto
                           </NavLink>
                           <NavLink
                              to="/financeiro/gerar-boleto"
                              className={({ isActive }) =>
                                 isActive
                                    ? "text-[var(--title-primary-color)] flex gap-2 font-semibold py-2 pl-3 rounded-lg border-b border-[var(--primary-color)] text-sm"
                                    : "text-[var(--title-secound-color)] flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition"
                              }
                           >
                              Gerar boleto
                           </NavLink>
                        </div>
                     </div>
                  </li>

                  <li>
                     <div className="text-[var(--title-primary-color)] flex flex-col gap-2 py-2 pl-3 overflow-y-hidden h-[40px] transition">
                        <div
                           className="text-[var(--title-primary-color)] flex gap-2 font-semibold cursor-pointer"
                           onClick={(e: MouseEvent<HTMLDivElement>) => {
                              const box = e.currentTarget
                                 .parentNode as HTMLElement;
                              box.classList.toggle("h-[150px]");
                           }}
                        >
                           <CiWallet size={24} />
                           <span>Dados Bancarios</span>
                        </div>
                        <div className="border-gray-200 border-l rounded pl-4 ml-6 mt-3">
                           <div
                              onClick={() => {
                                 navigator.clipboard.writeText(
                                    dadosBancarios.id
                                 );
                                 toast.success("Copiado");
                              }}
                              className="text-[var(--title-secound-color)] cursor-pointer flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition flex-col"
                           >
                              <span className="text-[var(--title-primary-color)]">
                                 Pix:
                              </span>
                              <span className="ml-2 text-sm break-all">
                                 {props.isHidden ? "********" : "********"}
                              </span>
                           </div>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className="text-[var(--title-primary-color)] flex flex-col gap-2 py-2 pl-3 overflow-y-hidden h-[40px] transition">
                        <div
                           className="text-[var(--title-primary-color)] flex gap-2 font-semibold cursor-pointer"
                           onClick={(e: MouseEvent<HTMLDivElement>) => {
                              const box = e.currentTarget
                                 .parentNode as HTMLElement;
                              box.classList.toggle("h-[100px]");
                           }}
                        >
                           <BiSupport size={24} />
                           <span>SAC</span>
                        </div>
                        <div className="border-gray-200 border-l rounded pl-4 ml-6 mt-3">
                           <div className="text-[var(--title-secound-color)] cursor-pointer flex gap-2 font-semibold py-2 pl-3 text-sm hover:text-[var(--hover-text-color)] transition flex-col">
                              <a
                                 href="https://wa.me/+551151984043"
                                 target="_blank"
                                 className="hover:text-[var(--title-primary-color)]  transition"
                              >
                                 Whatsapp
                              </a>
                           </div>
                        </div>
                     </div>
                  </li>
               </ul>
            </nav>
         </div>
      </>
   );
}
export default Sidebar;
