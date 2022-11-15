const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: [true, "Email already exist"]
    },
    password: {
        type: String,
        require: true
    },
    token: String
})

module.exports = mongoose.model("user", userSchema)