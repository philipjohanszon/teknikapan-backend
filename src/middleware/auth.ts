import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        return next();
    });
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        if (decoded.role === 'ADMIN') {
            return next();
        }
    }); 
}

const isMod = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        if (decoded.role === 'MOD' || decoded.role === 'ADMIN') {
            return next();
        }
    });
}

export { isAuthenticated, isAdmin, isMod };