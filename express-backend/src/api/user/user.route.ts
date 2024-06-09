import { Router } from "express";
import { createUserController, verifyEmailController, getUsersController, forgetPasswordController, resetPasswordController} from "./user.controllers";

const router = Router();

router.post("/", createUserController);
router.post("/verify-email", verifyEmailController);
router.post("/forget-password", forgetPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/", getUsersController);

export default router;