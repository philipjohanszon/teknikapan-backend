import { Image, User, Prisma } from "@prisma/client";

interface UserWithImage extends User {
    image: Image;
}

interface StrippedUser {
    id: string;
    username: string;
    role: string;
    image: Image | null;
    createdAt: Date;
}

interface LessStrippedUser extends StrippedUser {
    email: string;
    firstname: string;
    lastname: string;
    updatedAt: Date;
    deletedAt: Date | null;
}

export { StrippedUser, LessStrippedUser, UserWithImage };