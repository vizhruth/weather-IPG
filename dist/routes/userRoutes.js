"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Registration Route
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User_1.default.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create and save the new user
        user = new User_1.default({
            username,
            password: hashedPassword,
            cities: [],
        });
        await user.save();
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, user: { username: user.username, cities: user.cities } });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
// Login Route (already provided by you)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, user: { username: user.username, cities: user.cities } });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map