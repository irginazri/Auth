import Users from "../model/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const getUsers = async(req, res) =>{
    try {
        const user = await Users.findAll({
            attributes: ['id','name','email']
        });
        res.json(user)
    } catch (error) {
        console.log(error) ;
    }
}

export const Register = async(req, res) => {
    const {name, email, password, confirmPass} = req.body
    if(password !== confirmPass) return res.status(400).json({msg: "Password and Confirm Password Invalid"})
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            name : name, 
            email: email, 
            password : hashPassword
        })
        res.json({msg: "Registration Success"})
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                name : req.body.name
            }
        })

        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) {
            return res.status(404).json({
                msg : "Wrong Password, Please Try Againe"
            })
        }

        const idUser = user[0].id
        const name = user[0].name
        const email = user[0].email
        const accessToken = jwt.sign({idUser, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : "20s"
        })
        const refreshToken = jwt.sign({idUser, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn : "1d"
        })

        await Users.update({refresh_token: refreshToken},{
            where : {
                id: idUser
            }
        })

        res.cookie("refreshToken", refreshToken,{
            httpOnly: true, 
            maxAge : 24 * 60 * 60 * 1000,
            secure : true
        })

        res.json({ accessToken })

    } catch (error) {
        res.status(404).json({mgs: "Wrong Username, Please Try Again"})
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204)
    const user = await Users.findAll({
        where : {
            refresh_token : refreshToken
        }
    })
    if(!user[0]) return res.sendStatus(204)
    const idUser = user[0].id
    await Users.update({refresh_token: null},{
        where: {
            id : idUser
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}