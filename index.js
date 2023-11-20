const express=require("express")

const cors=require("cors")
const { pool } = require("./Models/BasicModel")
const { UserRouter } = require("./Routes/BasicRoutes")


const app=express()
app.use(cors())
app.use(express.json())

app.use((req,res,next)=>{
    req.mysql=pool
    // res.status(200).json({msg:pool})
next()
})



app.use("/teacher",UserRouter)
app.listen(3000,async()=>{
    try{
       await pool.connect((error)=>{
            if(error){
                console.log(error)
            }else{
                console.log("connected to db")
            }
        })
    }catch{
        console.log("something going wrong with connection")
    }
    console.log("server is running on port 3000")
})


