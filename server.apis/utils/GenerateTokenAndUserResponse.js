
import { JWT_SECRET } from "../config/config.js"
import jwt from 'jsonwebtoken'


const GenerateTokenAndUser = (User,req,res,message) => {
      // Extended to 30 days so users don't have to re-login within 7+ days
      const token = jwt.sign({id:User._id},JWT_SECRET,{expiresIn:"30d"})
      const refreshtoken = jwt.sign({id:User._id},JWT_SECRET,{expiresIn:"60d"})

      return res.json({
        User,
        token,
        refreshtoken,
        success:message
      })
}

export default GenerateTokenAndUser;
