import Handler from "./handler";
import { Article, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import { transformDocument } from "@prisma/client/runtime";
import { isMod, isAdmin, claimsExist } from "../libs/auth";
import { createArticleSchema, updateArticleSchema } from "../validation/articleSchemas";

class ArticlesHandler extends Handler {
    public static async get(req: Request, res: Response) {
        const included = {
            image: true,
            author: true,
            links: true,
            category: true,
            comments: {
                include: {
                    user: true
                },
            }
        }

        let articles: Article[] = [];
        let query: Object = {
            published: true
        };

        if (req.query.categoryId) {
            query = {
                ...query,
                categoryId: req.query.categoryId
            }
        }

        if (req.query.authorId) {
            query = {
                ...query,
                authorId: req.query.authorId
            }
        }

        // only admins and moderators can see unpublished articles
        if (req.query.published && claimsExist(req) && isAdmin(req) && isMod(req)) {
            query = {
                ...query,
                published: req.query.published
            }
        }

        if (req.query.page) {
            const page = parseInt(req.query.page as string);
            const amount = parseInt(req.query.amount as string);

            articles = await prisma.article.findMany({
                include: included,
                where: query,
                orderBy: {
                    createdAt: "desc"
                }, 
                skip: (page - 1) * amount,
                take: amount
            });
        } else {
            articles = await prisma.article.findMany({
                include: included,
                where: query,
                orderBy: {
                    createdAt: "desc"
                },
            });
        }

        res.status(200).json(articles);
    }

    public static async getById(req: Request, res: Response) {
        const id = req.params.id;

        const article = await prisma.article.findUnique({
            where: {
                id
            }
        });

        if (!article) {
            return res.status(404).json({
                message: "Artikeln hittades inte"
            });
        }

        res.status(200).json(article);
    }

    public static async create(req: Request, res: Response) {
        const { title, content, preview, categoryId, authorId, imageId } = req.body;

        try {
            createArticleSchema.validate({ title, content, preview, categoryId, authorId, imageId });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });

            return;
        }

        try {
            const article = await prisma.article.create({
                data: {
                    title,
                    content,
                    preview,
                    categoryId,
                    authorId,
                    imageId
                }
            });

            res.status(200).json(article);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { title, content, preview, published, categoryId, authorId, imageId } = req.body;

        try {
            updateArticleSchema.validate({ title, content, preview, published, categoryId, authorId, imageId });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });

            return;
        }

        try {
            const article = await prisma.article.update({
                where: {
                    id
                },
                data: {
                    title,
                    content,
                    preview,
                    published,
                    categoryId,
                    authorId,
                    imageId
                }
            });

            res.status(200).json(article);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    public static async delete(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const article = await prisma.article.update({
                where: {
                    id
                },
                data: {
                    published: false,
                    deletedAt: new Date()
                }
            });

            res.status(200).json(article);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}

export default ArticlesHandler;