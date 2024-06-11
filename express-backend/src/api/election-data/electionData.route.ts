import { Router } from "express";
import { createElectionDataController } from "./electionData.controllers";

const router = Router();

router.post("/election-data", createElectionDataController);

export default router;