import Handler from "./handler";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import { transformDocument } from "@prisma/client/runtime";

class ArticlesHandler extends Handler {
    public static async get(req: Request, res: Response) {
        const articles = await prisma.article.findMany({
            include: {
                image: true,
                author: true,
                links: true,
                category: true,
                comments: {
                    include: {
                        user: true
                    },
                }
            },
            orderBy: {
                createdAt: "desc"
            }, 
        });

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
}

export default ArticlesHandler;