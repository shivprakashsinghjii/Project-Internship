"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const connectionString = "mongodb+srv://spshiv2202:12345@shiva.wvtydyr.mongodb.net/YourDatabaseName?retryWrites=true&w=majority&appName=Shiva";
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("Hi Hello");
});
app.use('/user', user_1.default);
mongoose_1.default.connect(connectionString)
    .then(() => {
    app.listen(3000, () => {
        console.log("Server connected and MongoDB connected");
    });
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
