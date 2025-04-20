import mongoosh from "mongoose"

export const connectDb = async ()=>{
    try {
       await mongoosh.connect(process.env.MONGO_URI)
       console.log("Mongodb conected succesfully")
    } catch (error) {
        console.log(`Mongodb Error ${error}`)
    }
}