"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    try {
        const { email, name, password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({ email, name, password: hashedPassword });
        const result = yield user.save();
        resp = result
            ? { status: "success", message: "Registration successful", data: { userId: result._id.toString() } }
            : { status: "error", message: "No result found", data: {} };
        res.send(resp);
    }
    catch (error) {
        resp = { status: "error", message: "Something went wrong", data: {} };
        res.status(500).send(resp);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            resp = { status: "error", message: "User not found", data: {} };
            res.status(404).send(resp);
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (isPasswordValid) {
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, "secretmyverysecretkey", { expiresIn: "1h" });
            resp = {
                status: "success",
                message: "Login successful",
                data: { userId: user._id.toString(), token }
            };
            res.status(200).send(resp);
        }
        else {
            resp = { status: "error", message: "Invalid credentials", data: {} };
            res.status(401).send(resp);
        }
    }
    catch (error) {
        console.error(error);
        resp = { status: "error", message: "Something went wrong", data: {} };
        res.status(500).send(resp);
    }
});
exports.loginUser = loginUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    try {
        const userId = req.params.userId;
        const user = yield user_1.default.findById(userId, { name: 1, email: 1 });
        resp = user
            ? { status: "success", message: "User found", data: { user } }
            : { status: "error", message: "No result found", data: {} };
        res.send(resp);
    }
    catch (error) {
        resp = { status: "error", message: "Something went wrong", data: {} };
        res.status(500).send(resp);
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    try {
        const { _id: userId, name } = req.body;
        const user = yield user_1.default.findById(userId);
        if (user) {
            if (name)
                user.name = name;
            yield user.save();
            resp = { status: "success", message: "User updated", data: {} };
        }
        else {
            resp = { status: "error", message: "User not found", data: {} };
        }
        res.send(resp);
    }
    catch (error) {
        console.error(error);
        resp = { status: "error", message: "Something went wrong", data: {} };
        res.status(500).send(resp);
    }
});
exports.updateUser = updateUser;
