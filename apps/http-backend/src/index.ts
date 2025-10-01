import express from "express";
import { middleware } from "./middleware";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({ message: "Invalid data" });
        return;
    }
    try{
        const user = await prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            password: parsedData.data.password,
            name: parsedData.data.username
        }})
        res.json({
            userId: user.id
        })
    } catch(error){
        res.status(500).json({ message: "Internal server error" });
        return;
    }
    
});

app.post("/signin", async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({ message: "Invalid data" });
        return;
    }
    try{
    const user = await prismaClient.user.findUnique({
        where: { 
            email: parsedData.data.email,
            password: parsedData.data.password
        }
    })
    if(!user){
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    res.json({ 
        token 
    });
    } catch(error){
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});

app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({ message: "Invalid data" });
        return;
    }

    const userId = (req as any).userId;

    try{
        const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId
        }
    })
    res.json({
            roomId: room.id
        })
    } catch(error){
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});


app.listen(3001, () => {
  console.log("Server is running on port " + 3001);
});