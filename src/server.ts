import express from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 8080;

import UserHandler from './handlers/users';
import AuthHandler from './handlers/auth';

import { isAdmin, isMod, isAuthenticated, isNotAuthenticated, getClaims } from './middleware/auth';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getClaims);

app.get('/', (req, res) => {
    res.status(200).send("I'm alive!");
});

app.get('/users', UserHandler.get);
app.post('/users', isAdmin, UserHandler.create);
app.put('/users/:id', isAuthenticated, UserHandler.update);
app.delete('/users/:id', isAuthenticated, UserHandler.delete);

app.post("/auth/login", isNotAuthenticated, AuthHandler.login);
app.post("/auth/register", isNotAuthenticated, AuthHandler.register);

app.listen(port, () => {
    console.log(`backend open at http://localhost:${port}`)
});