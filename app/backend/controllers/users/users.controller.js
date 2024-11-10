import prisma from '../../config/db.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
dotenv.config()




export const registerService = async (req, res) => {

    const {username, password} = req.body;
    try {
        const existUser = await prisma.user.findFirst({
            where:{
                username:username
            }
        })
        if(existUser){
            return res.json({error: "Usuario ya existe"})
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt)
        const user = await prisma.user.create({
            data:{
                username: username,
                password: hashPassword
            }
        })
        return res.json({success: "Usuario creado con éxito", user})
    } catch (error) {
        console.log(error)
    }
}






export const changePasswordService = async(req,res) => {
  const {id} = req.params;
  const {pass} = req.body;

  try {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword =  bcrypt.hashSync(password, salt)
          await prisma.user.update({
              where:{
                  id: parseInt(id)
              },
          data:{
              password: hashPassword
          }
      })
      res.json({success: "Contraseña actualizada con éxito"})
  } catch (error) {
      console.log(error)
  }
}



export const getUsers = async(req,res) => {
    try {
        const result = await prisma.user.findMany();
        return res.json(result)
    } catch (error) {
        console.log(error)
    }
}