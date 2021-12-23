import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import JWTClaims from '../DTO/jwtClaims';
import { decode } from 'punycode';

const getClaims = async (req: Request, res: Response, next: NextFunction) => {
    let token: string;

    if(req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        req.body.claims = null;
        return next();
    }

    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.body.claims = null;

            return next();
        }

        const claims = decoded as JWTClaims;

        req.body.claims = claims;

        console.log(req.body);

        return next();
    });
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.claims != null) {
        return next();
    } else {
        return res.status(401).json({
            message: "Du måste vara inloggad för att göra detta"
        });
    }
}

const isMod = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.claims != null) {
        if (req.body.claims.role === "MOD" || req.body.claims.role === 'ADMIN') {
            return next();
        } else {
            return res.status(401).json({
                message: "Du måste vara moderator eller administratör för att göra detta"
            });
        }
        return next();
    } else {
        return res.status(401).json({
            message: "Du måste vara moderator eller administratör för att göra detta"
        });
    }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.claims != null) {
        if (req.body.claims.role === "ADMIN") {
            return next();
        } else {
            return res.status(401).json({
                message: "Du måste vara administratör för att göra detta"
            });
        }
    } else {
        return res.status(401).json({
            message: "Du måste vara administratör för att göra detta"
        });
    }
}

const isNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.claims == null) {
        return next();
    } else {
        return res.status(401).json({
            message: "Du kan inte göra detta när du är inloggad"
        });
    }
}


export { isAuthenticated, isNotAuthenticated, isAdmin, isMod, getClaims };