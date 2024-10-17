import express  from "express";
import {createQuiz,getQuiz, updateQuiz, deleteQuiz,publishQuiz} from "../controllers/quiz";
import { isAuthenticated } from "../middleware/isAuth";
const router=express.Router();
router.post("/",isAuthenticated,createQuiz)
router.get("/:quizId",isAuthenticated,getQuiz)
router.put("/",isAuthenticated,updateQuiz)
router.delete("/:quizId",isAuthenticated,deleteQuiz)
router.patch("/publish",isAuthenticated,publishQuiz)

export default router;