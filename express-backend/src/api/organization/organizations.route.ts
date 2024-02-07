import { Router } from "express";
import { 
    createMemberController, 
    createOraganizatinController,
    getMemberController, 
    getOraganizationsController,
    toggleOraganizationActivationController
} from "./organizations.controllers";

const router = Router();

router.post("/", createOraganizatinController);
router.get("/", getOraganizationsController);
router.put("/:organizationId", toggleOraganizationActivationController);
router.post("/members", createMemberController);
router.get("/members/:organizationId", getMemberController);


export default router;