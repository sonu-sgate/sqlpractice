const mysql=require("mysql2")

const pool= mysql.createConnection({
    "host":"localhost",
    user:"root",
    password:"",
    database:"college",

})
module.exports={pool}