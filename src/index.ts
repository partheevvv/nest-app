import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB, ContentModel, IUser, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { JWT_PASSWORD } from "./config";

const app = express();
app.use(express.json());

connectDB();

app.post("/api/v1/signup", async (req: Request, res: Response) => {

    const { username, password } : { username: string; password: string}= req.body;

    const hashedPassword: String = await bcrypt.hash(password, 10);

    try {
        const user: IUser =  await UserModel.create({
            username,
            password: hashedPassword,
        });
    
        res.status(201).json({
            message: "User signed up",
            user,
        });
    } catch(e: any) {
        console.error(e);
        if(e.code === 11000) {
            res.status(400).json({
                message: "User already exists",
            });
        } else {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
});

app.post("/api/v1/signin", async (req: Request, res: Response): Promise<void>  => {
    try {
        const { username, password } : { username: string, password: string } = req.body;

        const user: IUser | null = await UserModel.findOne({ username });
        
        if (!user) {
            res.status(401).json({
                message: "Invalid username or password",
            })
            return;
        }
    
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
    
        if(!isPasswordValid) {
            res.status(500).json({
                message: "Invalid username or password",
            });
            return;
        }
    
        const token: string = jwt.sign( {userId: user._id }, JWT_PASSWORD , {
            expiresIn: "1h",
        });
    
        res.json({
            message: "User signed in",
            token,
        });
    
    } catch(e: any) {
        res.status(401).json({
            message: "Invalid token",
        });
    }
});

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


app.listen(3000, () => {
    console.log("Server is running on port 3000")
});
