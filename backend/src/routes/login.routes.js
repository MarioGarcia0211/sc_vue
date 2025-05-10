import { Router } from "express";
import {
  login,
  register,
  profile,
  refreshToken,
  logout,
} from "../controllers/login.controller.js";
import { verificarToken } from "../middleware/auth.js";

const router = Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/profile", verificarToken, profile);
router.post("/auth/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
