import express from "express";
import messages from "./app/messages";


const app = express(); //создаем экземпляр

app.use(express.json());

//const bodyParser = require("body-parser");

const port = 8000;

//Here we are configuring express to use body-parser as middle-ware.
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use("/messages", messages);
app.use(cors());
app.use(express.static('public'));

// Handle 404 - Keep this as a last route
app.use(function(req, res) {
    res.status(404);
    res.send(JSON.parse('{"Error": "File Not Found"}'));
});

app.listen(port,() =>{
    console.log(`Server started on ${port} port`);
});