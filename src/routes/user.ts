
import { getUser, updateUser } from "../controllers/user";
import  express from "express";
import { isAuthenticated } from "../middleware/isAuth";

const router = express.Router();
 
router.get("/:userId",isAuthenticated ,getUser);
router.put("/",isAuthenticated, updateUser);

export default router;
