import { RequestHandler, Router } from "express";
import { 
    createMemberController, 
    createOraganizatinController,
    getMemberController, 
    getOraganizationsController,
    toggleOraganizationActivationController,
    getOraganizationWithMembersController,
    getOrganizationsByUserIdController,
    bulkCreateMembersFromFileController,
    downloadCsvTemplateController,
    downloadExcelTemplateController,

} from "./organizations.controllers";
import { authenticateToken } from "@application/middleware/authenticateToken";

  const fileUpload = require('express-fileupload');


const router = Router();

router.post("/", authenticateToken,createOraganizatinController);
router.get("/", authenticateToken, getOraganizationsController);
router.put("/:organizationId", authenticateToken, toggleOraganizationActivationController);
router.post("/members", authenticateToken, createMemberController);
router.get("/members/:id", authenticateToken, getMemberController);
router.get("/:id", authenticateToken, getOraganizationWithMembersController);
router.get('/user/:id',authenticateToken, getOrganizationsByUserIdController);
router.post(
    "/members/upload",
    authenticateToken as RequestHandler,
    fileUpload() as RequestHandler,
    bulkCreateMembersFromFileController as RequestHandler
  );
router.get('/members/template/csv',authenticateToken, downloadCsvTemplateController as RequestHandler);
router.get('/members/template/excel',authenticateToken, downloadExcelTemplateController as RequestHandler);

export default router;