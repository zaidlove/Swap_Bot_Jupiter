const mongoose = require('mongoose')
require('dotenv').config()
//& Function to connect to Db 

const connectWithDb = () => {
    console.log(process.env.DB_URL)
    mongoose.connect(process.env.DB_URL, {
        //& must add in order to not get any error masseges:
        useUnifiedTopology:true,
        useNewUrlParser: true 
    }).then(
        console.log("DB CONNECTED SUCCESS")
    ).catch((error:Error) => {
        console.log("DB CONNECTION FAILED ", error)
        process.exit(1)

    })
}
module.exports = connectWithDb