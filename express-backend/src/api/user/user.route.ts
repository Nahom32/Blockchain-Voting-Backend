import { Router } from "express";
import { createUserController, verifyEmailController, getUsersController} from "./user.controllers";

const router = Router();

router.post("/", createUserController);
router.post("/verify-email", verifyEmailController);
router.get("/", getUsersController);

export default router;