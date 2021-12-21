import express from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 8080;

import UserHandler from './handlers/users';

app.get('/', (req, res) => {
    res.status(200).send("I'm alive!");
});

app.get('/users', UserHandler.get);
app.post('/users', UserHandler.create);
app.put('/users', UserHandler.update);
app.delete('/users/:id', UserHandler.delete);

//create endpoint for deleting a user

app.listen(port, () => {
    console.log(`backend open at http://localhost:${port}`)
});