const fs = require("fs");



const dbpath = "./messages";


module.exports = {
    data: [],
    /** Read data from files in array on startup**/
    init: (data, callback) =>{
        fs.readdir(dbpath, (err, files) => {                              //read the contents of a directory
            if (err) throw err;                                         //error read contents of directory

            let cntr=0;
            files.forEach(file => { //loop
                fs.readFile(`${dbpath}/${file}`, "utf8", (err, res) => {  //read data from each file
                    if (err) throw err;                                 //error read data from file

                    data.push(JSON.parse(res));                         //add data from file to array
                    ++cntr;
                    if (cntr === files.length) {                        //check count of files
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
        // if(!data.author){
        //     answer.code = 400;
        //     answer.error = "Author must be present";
        // }

        return callback(answer);

    },
    /** add data to array**/
    addItem: (data, item) => data.push(item),                           //add new data to array
    /** save data to file **/
    saveData: (data, callback) => {
        let dateTimeNow = new Date().toISOString();                     //get current  date and time
        fs.writeFile(`${dbpath}/${dateTimeNow}.txt`, JSON.stringify(data), err =>{ //write data to file
            if(err) throw err;                                          //error writing data to file
            callback();
        })
    }
};