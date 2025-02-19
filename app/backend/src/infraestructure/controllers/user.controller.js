import { registerService } from "../../application/services/user/user.service.js";



export const registerHandler = async (req, res) => {

    const {nombre,apellido,  pass, usuario, es_admin } = req.body;


    if (!nombre || !apellido || !pass || !usuario || !es_admin) {
        return res.status(400).json({error: "Faltan datos"})
    }
    
    const response = await registerService({nombre,apellido,  pass, usuario, es_admin});
    if(response.success){
        return res.status(200).json(response)
    }else{
        return res.status(400).json(response)
    }
}


export const updatePasswordHandler = async (req, res) => {  

    const {id} = req.params;
    const {pass} = req.body;   

    if (!id || !pass) {
        return res.status(400).json({error: "Faltan datos"})
    }

    const response = await updatePasswordService(id, pass);
    if(response.success){
        return res.status(200).json(response)
    }else{
        return res.status(400).json(response)
    }
}







