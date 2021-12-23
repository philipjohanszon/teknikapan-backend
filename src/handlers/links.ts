import Handler from "./handler";
import { PrismaClient, Link } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import internal from "stream";

class LinksHandler extends Handler {
    public static async get(req: Request, res: Response) {

        let query: Object = {};

        if (req.query.articleId) {
            query = {
                ...query,
                articleId: req.query.articleId
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

            const links = await prisma.link.findMany({
                where: {
                    deletedAt: null,
                    ...query
                },
                include: {
                    image: true
                },
                skip: (page - 1) * amount,
                take: amount
            });

            res.status(200).json(links);
        } else {
            const links = await prisma.link.findMany({
                where: {
                    deletedAt: null,
                    ...query
                },
                include: {
                    image: true
                }
            });

            res.status(200).json(links);
        }
    }

    public static async getById(req: Request, res: Response) {
        const id = req.params.id;

        const link = await prisma.link.findUnique({
            where: {
                id
            },
            include: {
                image: true,
                article: true
            }
        });

        if (!link) {
            return res.status(404).json({
                message: "Länken hittades inte"
            });
        }

        res.status(200).json(link);
    }

    public static async create(req: Request, res: Response) {
        const { imageId, articleId, url } = req.body;

        try {
            const link = await prisma.link.create({
                data: {
                    imageId,
                    articleId,
                    url
                }
            });

            res.status(201).json(link);

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    public static async update(req: Request, res: Response) {
        const id = req.params.id;
        const { imageId, articleId, url } = req.body;

        const link = await prisma.link.update({
            where: {
                id
            },
            data: {
                imageId,
                articleId,
                url
            }
        });

        res.status(200).json(link);
    }

    public static async delete(req: Request, res: Response) {
        const id = req.params.id;

        await prisma.link.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
            
        });

        res.status(204).json();
    }
}

export default LinksHandler;