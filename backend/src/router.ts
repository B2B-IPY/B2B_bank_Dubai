import express from "express";
import JWTverify from "./middleware/JWTverify";
import vanilla from "./controllers/vanilla";
import login from "./controllers/post/login";
import balance from "./controllers/get/balance";
import balanceAdmin from "./controllers/get/balance-admin";
import verifyPerm from "./middleware/verifyPerm";

const router = express.Router();

router.get("/", vanilla);
router.post("/login", login);

router.get("/admin/balance", JWTverify, balanceAdmin);

router.get("/balance", JWTverify, balance);
export default router;
