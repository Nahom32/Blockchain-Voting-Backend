import { Router } from "express";
import { createUserController, verifyEmailController} from "./user.controllers";

const router = Router();

router.post("/", createUserController);
router.post("/verify-email", verifyEmailController);

export default router;