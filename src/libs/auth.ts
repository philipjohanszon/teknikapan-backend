import { Request } from "express";

const isLoggedIn = (req: Request) => {
    return req.body.claims != null;
}

const isAdmin = (req: Request) => {
    return req.body.claims.role === "ADMIN";
}

const isMod = (req: Request) => {
    return req.body.claims.role === "MOD";
}

export { isAdmin, isMod, isLoggedIn };