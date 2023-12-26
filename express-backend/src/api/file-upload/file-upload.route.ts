import { Router } from "express";
import { uploadFileController} from "./file-upload.controllers";
import { multerHandleUploadFileRequest } from "@application/file-upload/handeler/handleFileUploadRequestRequest";
import { authenticateToken } from "@application/middleware/authenticateToken";

const router = Router();

router.post("/",authenticateToken, multerHandleUploadFileRequest,uploadFileController);


export default router;