const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    sessions:[],
    tasks:[]
})


module.exports = mongoose.model("User", userSchema)