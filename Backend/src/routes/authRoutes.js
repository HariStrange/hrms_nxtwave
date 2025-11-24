const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validation");

router.post("/register", registerValidation, AuthController.register);
router.post("/login", loginValidation, AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/profile", authMiddleware, AuthController.getProfile);

module.exports = router;
