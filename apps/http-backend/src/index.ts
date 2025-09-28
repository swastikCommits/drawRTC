import express from "express";
import { middleware } from "./middleware";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const app = express();

app.post("/signup", (req, res) => {

    res.json({
        userId: 1
    })
});

app.post("/signin", (req, res) => {
    const userId = 1;
    const token = jwt.sign({userId}, JWT_SECRET);
    res.json({ token });
});
app.post("/create", middleware, (req, res) => {

    res.json({
        roomId: 123
    })
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});