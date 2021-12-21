import Handler from "./handler";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

class Auth extends Handler {

    public static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await prisma.user.findUnique({
                where: {
                   email 
                }
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Incorrect password"
                });
            }

            const token = jwt.sign({
                id: user.id,
                username: user.username,
                email: user.email
            }, process.env.JWT_SECRET, {
                expiresIn: "900h"
            });

            res.status(200).json({
                token
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    public static async register(req: Request, res: Response) {
        const { username, firstname, lastname, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        try {
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    firstname,
                    lastname,
                    password: hashedPassword
                }
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
}