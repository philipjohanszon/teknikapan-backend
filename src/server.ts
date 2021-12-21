import express from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 8080;

import UserHandler from './handlers/users';

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("I'm alive!");
});

app.get('/users', UserHandler.get);
app.post('/users', UserHandler.create);
app.put('/users/:id', UserHandler.update);
app.delete('/users/:id', UserHandler.delete);

app.listen(port, () => {
    console.log(`backend open at http://localhost:${port}`)
});