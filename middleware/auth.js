import jwt from "jsonwebtoken"
const authMiddleware = (req, res, next)=>{
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        if(!token) return res.status(401).json({error: "Access denied!"})
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.user = decode // req.user will contain user info
        next()
    }catch(err){
        console.error(err)
    }
}
export default authMiddleware