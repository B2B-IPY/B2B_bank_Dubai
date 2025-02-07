import Sidebar from "./components/sidebar/Sidebar";
import { HiViewGridAdd } from "react-icons/hi";

import { Outlet } from "react-router-dom";
import SidebarMobile from "./components/sidebar/SideBarMobile";
import { useEffect, useState } from "react";
import Header from "./components/header/Header";
import axios from "axios";
import { setBalance, userInfos } from "./redux/userInfos";
import { hiddenDados } from "./functions/toggleHidden";

function formatarNumeroParaBRL(numero: number): string {
   const formatoMoeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   });
   return formatoMoeda.format(numero).replace("R$", "").trim();
}
function App() {
   const [saldo, setSaldo] = useState<string>("");

   const [sideBarMobile_IsOpen, setSideBarMobile_IsOpen] =
      useState<boolean>(false);
   const username: string = localStorage.getItem("user") as string;
   const headers = {
      headers: {
         "x-access-token": localStorage.getItem("x-access-token"),
      },
   };
   useEffect(() => {
      reloadBalance();
   }, []);
   function reloadBalance() {
      setSaldo("");
      axios
         .get("http://localhost:2312/balance", headers)
         .then((response) => {
            console.log(response.data);

            let amount = response.data.valor as number;

            userInfos.dispatch(setBalance({ saldo: amount }));
            setSaldo(formatarNumeroParaBRL(amount));
         })
         .catch((error) => {
            console.log(error);
         });
   }
   const toggleSideBar = () => {
      document
         .querySelector("#buttonSideBar")!
         .classList.toggle("text-[#f0f0f0]");
      setSideBarMobile_IsOpen(!sideBarMobile_IsOpen);
   };

   const { isHidden, toggleHidden } = hiddenDados();
   return (
      <>
         <Sidebar isHidden={isHidden} />
         {sideBarMobile_IsOpen && (
            <SidebarMobile isHidden={isHidden} toggleSideBar={toggleSideBar} />
         )}
         <div className="z-50 absolute bottom-5 right-5 rounded-full min-[600px]:hidden  text-[var(--background-secound-color)] ">
            <HiViewGridAdd
               className="drop-shadow-[0_0_1px_rgba(255,255,255,1)]"
               id="buttonSideBar"
               onClick={() => {
                  toggleSideBar();
               }}
               size={40}
            />
         </div>
         <div className="flex flex-col w-full h-screen overflow-auto">
            <Header
               username={username}
               isHidden={isHidden}
               toggleHidden={() => toggleHidden()}
               reloadBalance={() => reloadBalance()}
               saldo={saldo}
            />

            <Outlet />
         </div>
      </>
   );
}
export default App;
