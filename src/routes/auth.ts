import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth";
import { body } from "express-validator";

const router = Router();

router.post("/", [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 4 })
    .withMessage("Please enter a valid name"),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail(),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage("Enter at least 8 characters long password"), // Add comma here

  body('confirm_password')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
], registerUser);

router.post("/login", loginUser);

export default router;
