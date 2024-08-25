"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get("/", auth_1.default, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id);
        res.json(user?.cities || []);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.post("/", auth_1.default, async (req, res) => {
    const { city } = req.body;
    try {
        const user = await User_1.default.findById(req.user.id);
        if (user?.cities.length >= 5) {
            return res.status(400).json({ message: "Max 5 cities allowed" });
        }
        user?.cities.push(city);
        await user?.save();
        res.json(user?.cities);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.delete("/:city", auth_1.default, async (req, res) => {
    const { city } = req.params;
    try {
        const user = await User_1.default.findById(req.user.id);
        user?.cities.pull(city);
        await user?.save();
        res.json(user?.cities);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.default = router;
//# sourceMappingURL=cityRoutes.js.map