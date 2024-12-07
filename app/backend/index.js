import express from 'express';
import cors from 'cors';
import equipoRouter from './routes/equipo.routes.js';
import authRouter from './routes/auth.routes.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();


const PORT = process.env.PORT;


const opcionesCors = {
    origin: process.env.FRONTEND_URL,
    credentials: true
}


app.use(cors(opcionesCors));
app.use(express.json());
app.use("/", authRouter)
app.use("/", equipoRouter)


app.get("/", (req,res) => {
    res.json("====Index===")

})


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})