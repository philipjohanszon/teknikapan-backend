import Handler from "./handler";
import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class CategoriesHandler extends Handler {
    public static async get(req: Request, res: Response) {
        const categories = await prisma.category.findMany({
            where: {
                deletedAt: null
            }
        });

        return res.status(200).json(categories);
    }
    
    public static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: {
                id
            }
        });

        return res.status(200).json(category);
    }

    public static async create(req: Request, res: Response) {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: {
                name
            }
        });
        return res.status(201).json(category);
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const category = await prisma.category.update({
                where: {
                    id
                },
                data: {
                    name
                }
            });

            res.status(200).json(category);

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    public static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const category = await prisma.category.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        });
        return res.status(204).json();
    }
}

export default CategoriesHandler;