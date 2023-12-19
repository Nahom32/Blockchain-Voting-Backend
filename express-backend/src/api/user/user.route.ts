import { Router } from "express";
import { createUserController} from "./user.controllers";

const router = Router();

router.post("/", createUserController);

export default router;