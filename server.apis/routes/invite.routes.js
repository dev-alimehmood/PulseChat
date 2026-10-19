import express from "express";
import {
  sendEmailInvite,
  getShareableInviteLink,
} from "../controllers/inviteController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/email", protectRoute, sendEmailInvite);
router.get("/share-link", protectRoute, getShareableInviteLink);

export default router;
