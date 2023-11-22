
var jwt = require('jsonwebtoken');
const auth=(req,res,next)=>{
    const token=req.headers.authorization;
    // console.log(token.split(" ")[0])
    if(token){
        jwt.verify(token.split(" ")[1], 'sgate', function(err, decoded) {
            if(decoded){
                req.body.user_id=decoded.user_id
                req.body.dept_id=decoded.dept_id
                next()
            }else{
                res.status(400).json({msg:"Token expired/login again"})
            }
          });
      
    }else{
        res.status(400).json({msg:"Please Login first"})
    }
}
module.exports={auth}