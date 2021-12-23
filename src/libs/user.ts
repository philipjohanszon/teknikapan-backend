import { StrippedUser, LessStrippedUser, UserWithImage } from "../DTO/user";

const stripUserData = (user: UserWithImage, forAdmin: boolean): StrippedUser | LessStrippedUser => {

    if (forAdmin) {
        const strippedUser: LessStrippedUser = {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt
        };

        return strippedUser;
    } else {
        const strippedUser: StrippedUser = {
            id: user.id,
            username: user.username,
            role: user.role,
            image: user.image,
            createdAt: user.createdAt,
        };
    }
}

export { stripUserData };
