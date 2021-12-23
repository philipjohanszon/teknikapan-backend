import { Response, Request } from 'express';
import Handler from "./handler";
import { userUpdateSchema, userCreateSchema } from "../validation/userSchemas";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import JWTClaims from '../DTO/jwtClaims';
import { stripUserData } from '../libs/user';
import { isAdmin } from '../libs/auth';
import { StrippedUser, LessStrippedUser, UserWithImage } from '../DTO/user';

const prisma = new PrismaClient();

export default class UserHandler extends Handler {
    public static async get(req: Request, res: Response) {
        let users: UserWithImage[] = [];
        let query: Object = {
            deletedAt: null
        };

        if (req.query.role) {
            query = {
                ...query,
                role: req.query.role
            }
        }
    
        if (req.query.username) {
            query = {
                ...query,
                username: {
                    contains: req.query.username
                }
            }
        }

        if (req.query.email) {
            query = {
                ...query,
                email: {
                    contains: req.query.email
                }
            }
        }

        if (req.query.firstname) {
            query = {
                ...query,
                firstname: {
                    contains: req.query.firstname
                }
            }
        }

        if (req.query.lastname) {
            query = {
                ...query,
                lastname: {
                    contains: req.query.lastname
                }
            }
        }

        if (req.query.page) {
            let page: number;
            let amount: number;

            try {
                page = parseInt(req.query.page as string);
                amount = parseInt(req.query.amount as string);
            } catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }

            users = await prisma.user.findMany({
                include: {
                    image: true
                },
                where: query
            });
        } else {
            users = await prisma.user.findMany({
                include: {
                    image: true
                },
                where: query
            });
        }

        //more optimised to keep it out here
        const admin: boolean = isAdmin(req);
        let strippedUsers: StrippedUser[] | LessStrippedUser[] = users.map(user => stripUserData(user, admin));

        res.status(200).json(strippedUsers);
    }

    public static async getById(req: Request, res: Response) {
        const id = req.params.id;

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                image: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Användaren hittades inte"
            });
        }

        res.status(200).json(stripUserData(user, isAdmin(req)));
    }

    public static async create(req: Request, res: Response) {
        const { username, firstname, lastname, role, email, password } = req.body;

        try {
            userCreateSchema.validate({ username, firstname, lastname, role, email, password });
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

            res.status(200).json(stripUserData(user, isAdmin(req)));
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { username, firstname, lastname, role, email, password } = req.body;

        const claims = req.body.claims as JWTClaims;

        if (claims.role !== 'admin' && claims.id !== id) {
            res.status(403).json({
                message: "Du har inte behörighet att utföra denna ändring"
            });

            return;
        }


        try {
            userUpdateSchema.validate({ username, firstname, lastname, role, email, password });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
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
                    },
                    include: {
                        image: true
                    }
                });

                res.status(200).json(stripUserData(user, isAdmin(req)));
            } catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        }
    }

    public static async delete(req: Request, res: Response) {
        const { id } = req.params;

        const claims = req.body.claims as JWTClaims;

        if (claims.role !== 'admin' && claims.id !== id) {
            res.status(403).json({
                message: "Du har inte behörighet att utföra denna ändring"
            });

            return;
        }

        try {
            const user = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    deletedAt: new Date()
                }
            });

            res.status(200).json("Deleted");
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

}