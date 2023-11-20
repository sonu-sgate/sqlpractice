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


// app.get("/teacher",(req,res)=>{
//     pool.query("SELECT * FROM teacher",(error,results)=>{
//         if(error){
//             console.log(error)
//             res.status(400).json({"msg":"something going wrong"})
//         }
//         else{
//             res.status(200).json({msg:results})
//         }
//     })
// })
// app.post("/teacher",(req,res)=>{
//     const {id,name,email,dept_id}=req.body
//     pool.query("INSERT INTO teacher (id,name,email,dept_id) VALUES (?,?,?,?)",[
//         id,name,email,dept_id
//     ],(error,results)=>{
//         if(error){
//             res.status(400).json({msg:error})
//         }else{
//             res.status(200).json({msg:results})
//         }
//     })
// })
// app.delete("/teacher/:id",(req,res)=>{
//     const {id}=req.params
//     pool.query("DELETE  FROM teacher WHERE id=?",[id],(error,results)=>{
//         if(error){
//             res.status(400).json({msg:error})
//         }else{
//             res.status(200).json({msg:"DEleted successfully"})
//         }
//     })
// })
// app.patch("/techers/:id",async(req,res)=>{
//     const {id}=req.params
//     const {name}=req.body;
//     console.log(id)
//     req.mysql.query('UPDATE teacher SET name=? WHERE id=?',[name,id],(error,results)=>{
//         if(error){
//             res.status(400).json({msg:error})
//         }else{
//             res.status(200).json({msg:results})
//         }
//     })
// })
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


