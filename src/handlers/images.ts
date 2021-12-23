import Handler from "./handler";
import { Response, Request } from "express";
import { Image, PrismaClient } from "@prisma/client";
import { link } from "joi";

const prisma = new PrismaClient();

class ImageHandler extends Handler {
    public static async get(req: Request, res: Response) {

        let images: Image[];

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

            images = await prisma.image.findMany({
                include: {
                    articles: true,
                    links: true
                },
                where: {
                    deletedAt: null
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip: (page - 1) * amount,
                take: amount
            });
        } else {
            images = await prisma.image.findMany({
                include: {
                    articles: true,
                    links: true
                },
                where: {
                    deletedAt: null
                },
            });
        }

        return res.status(200).json({
            images
        });
    }

    public static async getById(req: Request, res: Response) {
        const { id } = req.params;

        const image = await prisma.image.findUnique({
            where: {
                id
            }
        });

        if (!image) {
            return res.status(404).json({
                message: "Bilden hittades inte"
            });
        }

        return res.status(200).json({
            image
        });
    }

    public static async create(req: Request, res: Response) {
        const file = req.file;
        const { alt } = req.body;

        if (!file) {
            return res.status(400).json({
                message: "Ingen fil hittades"
            });
        }

        const { filename } = file;

        try {
            const image = await prisma.image.create({
                data: {
                    url: `${process.env.IMAGE_URL}/${filename}`,
                    alt
                }
            });

            return res.status(200).json({
                image
            });

        } catch (error) {
            res.status(500).json({
                message: error
            });
        }
    }

    public static async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const image = await prisma.image.update({
                where: {
                    id
                },
                data: {
                    deletedAt: new Date()
                }
            });

            return res.status(200).json({
                image
            });
        } catch (error) {
            res.status(500).json({
                message: error
            });
        }
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { alt } = req.body;
        const file = req.file;

        if (!file) {
            try {
                const image = await prisma.image.update({
                    where: {
                        id
                    },
                    data: {
                        alt
                    }
                });

                return res.status(200).json({
                    image
                });
            } catch (error) {
                res.status(500).json({
                    message: error
                });
            }
        }

        try {
            const image = await prisma.image.update({
                where: {
                    id
                },
                data: {
                    url: `${process.env.IMAGE_URL}/${file.filename}`,
                    alt
                }
            });

            return res.status(200).json({
                image
            });
        } catch (error) {
            res.status(500).json({
                message: error
            });
        }
    }
}

export default ImageHandler;