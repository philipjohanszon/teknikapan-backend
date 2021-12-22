import { Request } from "express";

const claimsExist = (req: Request) => {
    return req.body.claims != null;
}

const isAdmin = (req: Request) => {
    return req.body.claims.role === "admin";
}

const isMod = (req: Request) => {
    return req.body.claims.role === "MOD";
}

export { isAdmin, isMod, claimsExist };