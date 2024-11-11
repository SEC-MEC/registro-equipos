import prisma from '../../config/db.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
dotenv.config()

export const loginService = async (req, res) => {
    const {usuario, pass} = req.body;
  try {
      const existUser = await prisma.tecnico.findFirst({
        where:{
            usuario:usuario
        }
      })
      if (!existUser) {
      return res.json({ error: 'Usuario no encontrado' });
      }
  const passwordMatch = await bcrypt.compare(pass, existUser.pass);
  if (!passwordMatch) {
    return res.json({ error: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ 
  id: existUser.id,
  usuario: existUser.usuario,
  pass: existUser.pass
  },
  process.env.SECRET_KEY , 
  { expiresIn: '12h' });
      
  res.status(200).json({ token });

  } catch (error) {
      console.log("Error en el login: ", error)
  }
}


export const authService = async (req, res) => {

  try {
      const authHeader = req.get('Authorization')
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      if (!decodedToken) {
      return res.status(401).json({ error: 'Token inválido' });
  }  
  const userToken = await prisma.tecnico.findUnique({
      where: {
          id: decodedToken.id
      }
  })
  if(!userToken){
      return res.status(401).json({ error: "Usuario no encontrado"})
  }
  
  res.status(200).json({
      id: userToken.id,
      usuario: userToken.usuario,
  })
  } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ error: 'Token JWT inválido' });
      }
      console.log("Error de autenticacion: ", error)
  }
}


