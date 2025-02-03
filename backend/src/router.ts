import express from "express";
import JWTverify from "./middleware/JWTverify";
import vanilla from "./controllers/vanilla";
import login from "./controllers/post/login";
import balance from "./controllers/get/balance";
import balanceAdmin from "./controllers/get/balance-admin";
import verifyPerm from "./middleware/verifyPerm";
import consultarChavePix from "./controllers/post/consultar-chavePix";
import transferirPix from "./controllers/post/transf-pix";
import { verifySaldo } from "./middleware/verifySaldo";
import CreateQRcode from "./controllers/post/criar-QRcode";
import webhook from "./controllers/webhook/webhook";
import extrato from "./controllers/get/extrato";
import transferirPixCopiaCola from "./controllers/post/transf-pix-copiaCola";
import criarSubContas from "./controllers/post/criar-subcontas";
import listRepresentantes from "./controllers/get/list-representantes";
import representantePerm from "./middleware/representantePerm";
import dashboardCliente from "./controllers/post/dashboard-cliente";

const router = express.Router();

router.get("/", vanilla);
router.post("/login", login);

router.post("/subcontas/criar", criarSubContas);

router.post("/dashboard/cliente", JWTverify, dashboardCliente);

router.get("/pix/consultar/:key", JWTverify, consultarChavePix);
router.post("/pix/transfer", JWTverify, verifySaldo, transferirPix);
// router.post(
//    "/pix/emv/transfer",
//    JWTverify,
//    verifySaldo,
//    transferirPixCopiaCola
// );
router.post("/pix/cobrar", JWTverify, CreateQRcode);

router.get("/extrato/:page", JWTverify, extrato);
router.get("/representantes", JWTverify, representantePerm, listRepresentantes);

router.get("/admin/balance", JWTverify, balanceAdmin);
router.get("/balance", JWTverify, balance);

router.post("/tarifador", webhook);
export default router;
