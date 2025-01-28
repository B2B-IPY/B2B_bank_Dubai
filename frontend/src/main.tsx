import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login/Login.tsx";
import NotFound from "./pages/contas/catch-pages/NotFound.tsx";

import TransferirPix from "./pages/financeiro/pix/TransferirPix.tsx";
import Estabelecimentos from "./pages/estabelecimentos/Estabelecimentos.tsx";
import Dasboard from "./pages/dashboard/dashboard.tsx";
import Transacoes from "./pages/financeiro/extrato/Transacoes.tsx";
import Card from "./pages/cartoes/cartoes-list/ListCard.tsx";

import ListCard from "./pages/cartoes/cartoes-list/ListCard.tsx";
import ViewCartoes from "./pages/cartoes/view-cartoes/ViewCartoes.tsx";
import AberturaDeContas from "./pages/aberturaDeContas/AberturaDeContas.tsx";

import RecuperarConta from "./pages/recuperar-conta/RecuperarConta.tsx";
import ViewerList from "./pages/viewer/Viewer-list/ViewerList.tsx";
import CadastrarViewer from "./pages/viewer/cad-viewer/CadastrarViewer.tsx";
import GerarLinkDoRepresentante from "./pages/gerar-link/GerarLinkDoRepresentante.tsx";
import LogsList from "./pages/logs/LogsList.tsx";
import ListBoletos from "./pages/financeiro/list-boletos/ListBoletos.tsx";
import CobrarViaQrCode from "./pages/financeiro/cobrar-via-qr-code/CobrarViaQrCode.tsx";
import TransferirPixCopiaCola from "./pages/financeiro/pix-copia/Pix_copia.tsx";

const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            path: "/",
            element: <Dasboard />,
         },

         {
            path: "/cartoes",
            element: <ListCard />,
         },
         {
            path: "/cartoes/:id",
            element: <ViewCartoes />,
         },
         {
            path: "/cartoes/:id",
            element: <Card />,
         },
         {
            path: "/estabelecimentos",
            element: <Estabelecimentos />,
         },

         {
            path: "/financeiro/extrato/transacoes",
            element: <Transacoes />,
         },
         {
            path: "/financeiro/boletos",
            element: <ListBoletos />,
         },

         {
            path: "/financeiro/transferencia/pix",
            element: <TransferirPix />,
         },
         {
            path: "/financeiro/transferencia/qr-code",
            element: <CobrarViaQrCode />,
         },
         {
            path: "/financeiro/transferencia/pix-copiaCola",
            element: <TransferirPixCopiaCola />,
         },

         {
            path: "/viewer",
            element: <ViewerList />,
         },
         {
            path: "/viewer/novo",
            element: <CadastrarViewer />,
         },
         {
            path: "/gerar-link",
            element: <GerarLinkDoRepresentante />,
         },
         {
            path: "/logs",
            element: <LogsList />,
         },
      ],
   },
   {
      path: "/login",
      element: <Login />,
   },
   {
      path: "/abertura-de-contas",
      element: <AberturaDeContas />,
   },
   {
      path: "/recuperar-conta",
      element: <RecuperarConta />,
   },
   {
      path: "*",
      element: <App />,
      children: [
         {
            path: "*",
            element: <NotFound />,
         },
      ],
   },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
   <RouterProvider router={router} />
);
