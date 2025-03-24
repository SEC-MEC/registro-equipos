import axios from "axios";


export const getAllScanRequest = async() => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SCAN}/scan`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const getScanByIdRequest = async(ipStart?: string, ipEnd?: string) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SCAN}/scan/${ipStart}/${ipEnd}`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}