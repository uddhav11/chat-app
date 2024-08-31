const mongoose= require('mongoose')


const connectDB= async() => {
    try{
        const conn= await mongoose.connect(process.env.MONGO_DB)
        console.log('Mongodb connected successfully')
    } catch (error){
        console.log('mongodb not connected',error)
    }
}



module.exports=  connectDB