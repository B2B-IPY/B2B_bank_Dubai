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

const router = express.Router();

router.get("/", vanilla);
router.post("/login", login);

router.get("/pix/consultar/:key", JWTverify, consultarChavePix);
router.post("/pix/transfer", JWTverify, transferirPix);
router.post("/pix/cobrar", JWTverify, CreateQRcode);

router.post("/extrato", JWTverify, extrato);

router.get("/admin/balance", JWTverify, balanceAdmin);
router.get("/balance", JWTverify, balance);

router.post("/tarifador", webhook);
export default router;
