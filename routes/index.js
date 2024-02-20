import express from "express"
import { getUsers, Login, Logout, Register } from "../controller/User.js"
import { verifyToken } from "../middleware/VerifyToken.js"


const userRouter = express.Router()

userRouter.get('/', verifyToken, getUsers)
userRouter.post('/register', Register)
userRouter.post('/login', Login)
userRouter.post('/logout', Logout)


export default userRouter