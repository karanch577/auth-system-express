const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.MONGO_URL

exports.connect = () => {
    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("DB connection stablished"))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
}