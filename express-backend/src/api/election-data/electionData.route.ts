import { Router } from "express";
import { createElectionDataController, getElectionTimeSeriesController } from "./electionData.controllers";

const router = Router();

router.post("/election-data", createElectionDataController);
router.get("/election-data", getElectionTimeSeriesController);

export default router;