import { Response, Request } from 'express';
import Handler from "./handler";
import { userUpdateSchema, userCreateSchema } from "../validation/userSchemas";

import Joi from "joi";
import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class UserHandler extends Handler {
    public static async get(req: Request, res: Response) {
        const users = await prisma.user.findMany({
            include: {
                image: true
            }
        });

        res.status(200).json(users);
    }

    public static async create(req: Request, res: Response) {
        const { username, firstname, lastname, role, email, password } = req.body;

        console.log(req.body);

        try {
            const value = userUpdateSchema.validate({ username, firstname, lastname, role, email, password });
            console.log(value);
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
                    role,
                    password: hashedPassword
                },
                include: {
                    image: true
                }
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { username, firstname, lastname, role, email, password } = req.body;

        try {
            const value = userUpdateSchema.validate({ username, firstname, lastname, role, email, password });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });

            return;
        }

        if (password) {

            const hashedPassword = await bcrypt.hash(password, 12);

            try {
                const user = await prisma.user.update({
                    where: {
                        id
                    },
                    data: {
                        username,
                        email,
                        firstname,
                        lastname,
                        role,
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

    public static async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    deletedAt: new Date()
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