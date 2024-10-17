import { Router } from "express";
import { registerUser, loginUser, getUser, updateUser } from "../controllers/user";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:userId", getUser);
router.put("/update", updateUser);

export default router;
