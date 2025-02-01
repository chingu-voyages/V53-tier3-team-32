import { Router } from "express";
import controller from "../controllers/index";

import { AllergyRoute } from "./allergy";
import { authroute } from "./auth";

const router = Router();

router.use('/allergy',AllergyRoute);
router.use('/auth',authroute);

export default router;

