import prisma from '../../config/db.js'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config()




export const registerService = async (req, res) => {

    const {nombre,apellido,  pass, usuario, es_admin } = req.body;
    try {
        const existUser = await prisma.tecnico.findFirst({
            where:{
                usuario: usuario
            }
        })
        if(existUser){
            return res.json({error: "Usuario ya existe"})
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(pass, salt)
        const user = await prisma.tecnico.create({
            data:{
                nombre: nombre,
                apellido: apellido,
                pass: hashPassword,
                usuario: usuario,
                es_admin: es_admin
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

        const isUser = await prisma.tecnico.findFirst({
            where:{
                id: parseInt(id)
            }
        })

        if(!isUser){
            return res.json({error: "Usuario no encontrado"})
        }
//         const passwordMatch = await bcrypt.compare(pass, isUser.pass);
//           if (!passwordMatch) {
//     return res.json({ error: 'No se encontro la contrasena actual' });
//   }
          const salt = bcrypt.genSaltSync(10);
          const hashPassword =  bcrypt.hashSync(pass, salt)
          await prisma.tecnico.update({
              where:{
                  id: parseInt(id)
              },
          data:{
              pass: hashPassword
          }
      })
     return res.json({success: "Contraseña actualizada con éxito"})
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