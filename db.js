const fs = require("fs");



const dbpath = "./messages";


module.exports = {
    data: [],

    init: (data, callback) =>{
        fs.readdir(dbpath, (err, files) => {
            if (err) throw err;

            let cntr=0;
            files.forEach(file => { //loop
                fs.readFile(`${dbpath}/${file}`, "utf8", (err, res) => {
                    if (err) throw err;

                    data.push(JSON.parse(res));
                    ++cntr;
                    if (cntr === files.length) {
                        callback();
                    }
                });
            });
        });
    },

    checkMessage: (data, callback) => {
        const answer= {
            "code": 200,
            "error": "NO"
        };
        if(!data.message){
            answer.code = 400;
            answer.error = "Message must be present";
        }

        return callback(answer);

    },

    addItem: (data, item) => data.push(item),

    saveData: (data, callback) => {
        let dateTimeNow = new Date().toISOString();
        fs.writeFile(`${dbpath}/${dateTimeNow}.txt`, JSON.stringify(data), err =>{
            if(err) throw err;
            callback();
        })
    }
};