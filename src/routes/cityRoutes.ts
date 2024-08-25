import express from "express";
import User, { IUser } from "../models/User";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", auth, async (req: any, res) => {
  try {
    const user: any = await User.findById(req.user.id);
    res.json(user?.cities || []);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/", auth, async (req: any, res) => {
  const city = req.body?.city?.toLowerCase();

  try {
    const user: any = await User.findById(req.user.id);

    if (user?.cities.length >= 5) {
      return res.status(400).json({ message: "Max 5 cities allowed" });
    }

    user?.cities.push(city);
    await user?.save();
    res.json(user?.cities);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:city", auth, async (req: any, res) => {
  const city = req.params?.city?.toLowerCase();
  try {
    const user: any = await User.findById(req.user.id);
    user?.cities.pull(city);
    await user?.save();
    res.json(user?.cities);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
