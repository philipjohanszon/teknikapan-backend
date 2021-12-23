import express from 'express';
import multer from 'multer';
const uploads = multer({ dest: 'uploads/' });
const app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 8080;

import UserHandler from './handlers/users';
import AuthHandler from './handlers/auth';
import ImageHandler from './handlers/images';
import ArticlesHandler from './handlers/articles';
import LinksHandler from './handlers/links';
import CommentsHandler from './handlers/comments';

import { isAdmin, isMod, isAuthenticated, isNotAuthenticated, getClaims } from './middleware/auth';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getClaims);

app.get('/', (req, res) => {
    res.status(200).send("I'm alive!");
});

app.get('/users', UserHandler.get);
app.post('/users', isAdmin, UserHandler.create);
app.get('/users/:id', UserHandler.getById);
app.put('/users/:id', isAuthenticated, UserHandler.update);
app.delete('/users/:id', isAuthenticated, UserHandler.delete);

app.get("/articles", ArticlesHandler.get);
app.post("/articles", isAdmin, ArticlesHandler.create);
app.get("/articles/:id", isAdmin, ArticlesHandler.getById);
app.put("/articles/:id", isAdmin, ArticlesHandler.update);
app.delete("/articles/:id", isAdmin, ArticlesHandler.delete);

app.get("/images", isAdmin, ImageHandler.get);
app.post("/images", isAdmin, uploads.single("image"),  ImageHandler.create);
app.get("/images/:id", isAdmin, ImageHandler.getById);
app.put("/images/:id", isAdmin, ImageHandler.update);
app.delete("/images/:id", isAdmin, ImageHandler.delete);

app.get("/links", isAdmin, LinksHandler.get);
app.post("/links", isAdmin, LinksHandler.create);
app.get("/links/:id", isAdmin, LinksHandler.getById);
app.put("/links/:id", isAdmin, LinksHandler.update);
app.delete("/links/:id", isAdmin, LinksHandler.delete);

app.get("/comments", isMod, CommentsHandler.get);
app.post("/comments", isAuthenticated, CommentsHandler.create);
app.get("/comments/:id", CommentsHandler.getById);
app.delete("/comments/:id", isAuthenticated, CommentsHandler.delete);

app.post("/auth/login", isNotAuthenticated, AuthHandler.login);
app.post("/auth/register", isNotAuthenticated, AuthHandler.register);

app.listen(port, () => {
    console.log(`backend open at http://localhost:${port}`)
});