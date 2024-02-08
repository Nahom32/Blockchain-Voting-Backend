import { Router } from "express";
import { 
    createMemberController, 
    createOraganizatinController,
    getMemberController, 
    getOraganizationsController,
    toggleOraganizationActivationController,
    getOraganizationWithMembersController,
} from "./organizations.controllers";
import { authenticateToken } from "@application/middleware/authenticateToken";

const router = Router();

router.post("/", authenticateToken,createOraganizatinController);
router.get("/", authenticateToken, getOraganizationsController);
router.put("/:organizationId", authenticateToken, toggleOraganizationActivationController);
router.post("/members", authenticateToken, createMemberController);
router.get("/members/:organizationId", authenticateToken, getMemberController);
router.get("/:organizationId", authenticateToken, getOraganizationWithMembersController);


export default router;