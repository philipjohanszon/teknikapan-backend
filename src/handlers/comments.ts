import Handler from "./handler";
import { PrismaClient, Comment } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import { isMod, isAdmin } from "../libs/auth";

class CommentsHandler extends Handler {
    public static async get(req: Request, res: Response) {
        let query: object = {
            deletedAt: null
        };

        if (req.query.articleId) {
            query = {
                ...query,
                articleId: req.query.articleId
            }
        }

        if (req.query.userId) {
            query = {
                ...query,
                userId: req.query.userId
            }
        }

        if (req.query.text) {
            query = {
                ...query,
                text: {
                    contains: req.query.text
                }
            }
        }

        if (req.query.page) {
            let page: number;
            let amount: number;

            try {
                page = parseInt(req.query.page as string, 10);
                amount = parseInt(req.query.amount as string, 10);
            } catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }

            const comments = await prisma.comment.findMany({
                include: {
                    user: true,
                },
                where: query,
                orderBy: {
                    createdAt: "desc"
                },
                skip: (page - 1) * amount,
                take: amount
            });

            res.status(200).json(comments);
        } else {
            const comments = await prisma.comment.findMany({
                include: {
                    user: true,
                },
                where: query,
                orderBy: {
                    createdAt: "desc"
                },
            });

            res.status(200).json(comments);
        }
    }

    public static async getById(req: Request, res: Response) {
        const { id } = req.params;

        const comment = await prisma.comment.findUnique({
            where: {
                id
            },
            include: {
                user: true,
                article: true
            }
        })

        if (!comment) {
            return res.status(404).json({
                message: "Kommentaren hittades inte"
            });
        }

        res.status(200).json(comment);
    }

    public static async create(req: Request, res: Response) {
        const { userId, articleId, text } = req.body;

        try {
            const comment = await prisma.comment.create({
                data: {
                    userId,
                    articleId,
                    text
                }
            });

            res.status(201).json(comment);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    public static async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (!(isMod(req) || isAdmin(req)) && req.body.claims.id !== id) {
            return res.status(403).json({
                message: "Du har inte behörighet att ta bort kommentaren"
            });
        }

        try {
            const comment = await prisma.comment.delete({
                where: {
                    id
                }
            });

            res.status(200).json(comment);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
}

export default CommentsHandler;
