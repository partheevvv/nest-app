import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";

const JWT_PASSWORD = "nestapp"

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async(req, res) => {
    // zod validation and hash the password
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        })
    
        res.json({
            message: "User signed up"
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post("/api/v1/signin",async (req, res) => {
    const username = req.body.username;
    const password = req.body.password

    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if(existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
}) 

app.post("/api/v1/content", userMiddleware, (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "content has been added"
    })
})

app.get("/api/v1/content", (req, res) => {
    
})

app.delete("/api/v1/content",(req, res) => {
    
})

app.post("/api/v1/nest/share",(req, res) => {
    
})

app.get("/api/v1/nest/:shareLink",(req, res) => {
    
})


app.listen(3000);
