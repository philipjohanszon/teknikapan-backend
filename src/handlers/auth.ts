import Handler from "./handler";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import JWTClaims from "./../DTO/jwtClaims";
import { loginSchema, registerSchema } from "../validation/authSchemas";

const prisma = new PrismaClient();

class AuthHandler extends Handler {

    public static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            loginSchema.validate({ email, password });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });

            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                   email
                }
            });

            if (!user) {
                return res.status(404).json({
                    message: "Användaren hittades inte"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Fel lösenord"
                });
            }

            const claims: JWTClaims = {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email
            };

            const token = jwt.sign(claims, process.env.JWT_SECRET, {
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

        try {
            registerSchema.validate({ username, firstname, lastname, email, password });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });

            return;
        }

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

export default AuthHandler;