import { Router } from "express";
import { login, register } from "../controllers/login.controller.js";

const router = Router();

router.post("/auth/login", login);
router.post("/auth/register", register);

export default router;
