import express from "express";
import JWTverify from "./middleware/JWTverify";
import vanilla from "./controllers/vanilla";
import login from "./controllers/post/login";

const router = express.Router();


router.get("/", vanilla);
router.post("/login", login);


export default router;
