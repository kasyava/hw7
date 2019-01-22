import express from "express";
import cors from "cors";



import messages from "./app/messages";


const app = express(); //создаем экземпляр

app.use(express.json());


const port = 8000;

app.use("/messages", messages);
app.use(cors());
app.use(express.static('public'));

app.use(function(req, res) {
    res.status(404);
    res.send(JSON.parse('{"Error": "File Not Found"}'));
});

app.listen(port,() =>{
    console.log(`Server started on ${port} port`);
});