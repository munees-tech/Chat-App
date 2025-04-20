import {v2 as cloudinary} from "cloudinary";
import { config } from "dotenv";

config()

cloudinary.config({
    cloud_name : process.env.CLODINARY_NAME,
    api_key : process.env.CLODINARY_APIKEY,
    api_secret : process.env.CLODINARY_API_SECREATE 
})

export default cloudinary