const mysql=require("mysql2")

const pool= mysql.createConnection({
    "host":"localhost",
    user:"root",
    password:"",
    database:"college",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})
module.exports={pool}