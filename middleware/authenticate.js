import jwt from 'jsonwebtoken';

const authenticate=(req,res,next)=>{
    const token=req.cookies.accessToken
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(403).json({message:"Invalid token"})
        }
        req.user=user
        next()
    })
}

export default authenticate;