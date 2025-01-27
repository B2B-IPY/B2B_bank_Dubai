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

const router = express.Router();

router.get("/", vanilla);
router.post("/login", login);

router.get("/pix/consultar/:key", JWTverify, consultarChavePix);
router.post("/pix/transfer", JWTverify, verifySaldo, transferirPix);
router.post("/pix/cobrar", JWTverify, CreateQRcode);

router.get("/admin/balance", JWTverify, balanceAdmin);
router.get("/balance", JWTverify, balance);
export default router;
