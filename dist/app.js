"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const connectionString = process.env.CONNECTION_STRING || "";
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("Hi Hello");
});
app.use('/user', user_1.default);
mongoose_1.default.connect(connectionString)
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server connected and MongoDB connected");
    });
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
