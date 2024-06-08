import { RequestHandler, Router } from "express";
import { getGeneralOrganizationElectionController, getTimeSeriesController } from "./statistics.controller";
import { authenticateToken } from "@application/middleware/authenticateToken";

const router = Router()
router.get("/organization/:organizationId",getGeneralOrganizationElectionController as RequestHandler)
router.get("/timeseries/:electionId",getTimeSeriesController as RequestHandler)

export default router;
