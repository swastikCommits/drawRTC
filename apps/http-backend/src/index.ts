import express from "express";
import { middleware } from "./middleware";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();

app.post("/signup", async (req, res) => {
    const body = CreateUserSchema.safeParse(req.body);
    if(!body.success){
        res.status(400).json({ message: "Invalid data" });
        return;
    }
    const user = await prismaClient.user.create({
        data: {
            email: body.data.email,
            password: body.data.password,
            name: body.data.username
        }
    })
    res.json({
        userId: user.id
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