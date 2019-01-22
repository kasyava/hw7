
import express from "express";
import multer from "multer";
import path from "path";
import nanoid from "nanoid";


import config from "../config";
import db from "../db";



const storage = multer.diskStorage({
    destination(req, file, cd){
        cd(null, config.uploadPath)
    },
    filename(req, file, cd){
        cd(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});


const router = express.Router();

//const db = require("../db");
const messagesCount =30;

const data = [];


db.init(data, ()=>{
    console.log("Init db");
    data.sort((a,b) => (a.datetime > b.datetime) ? 1 : ((b.datetime > a.datetime) ? -1 : 0)); //sort our array by date
});

/** GET request on /messages url**/
router.get('/', (req, res) =>{
    let tmpData = [];
    let dateTimeParam = req.query.datetime;
    if(dateTimeParam){
        for (let i = 0; i < data.length; i++) {
            let dateFromDB = Date.parse(data[i].datetime);
            let dateFromRequest =  Date.parse(dateTimeParam);
            if(isNaN(dateFromRequest)){
                res.status(400).send(JSON.parse(`{"error": "invalid date"}`));
                return;
            }
            else{
                if (dateFromDB > dateFromRequest) {
                    tmpData.push(data[i]);
                }
            }
        }
    }
    else {
        if (data.length > messagesCount) {
            for (let i = data.length - messagesCount; i < data.length; i++) {
                tmpData.push(data[i]);
            }
        } else tmpData = data.slice();
    }
    res.send(tmpData);
});


router.get('/all', (req, res) =>{
    res.send(data);
});


router.post('/', upload.single ("image"), (req, res) =>{
    db.checkMessage(req.body,(answer) =>{
       if (answer.code ===400) {

           res.status(400).send(JSON.parse(`{"error": "${answer.error}"}`));

       }
       else{

           const newMessage = req.body;
           if(req.file) newMessage.image = req.file.filename;
           newMessage.id = nanoid();
           newMessage.datetime = new Date().toISOString();

           db.addItem(data, newMessage);

           db.saveData(newMessage, ()=>{
               res.send(newMessage);
           });
       }
    });

});

export default router;