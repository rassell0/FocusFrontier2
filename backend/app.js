const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const userRouter = require("./routes/user")
const helmet =  require("helmet")
const compression = require("compression")
const app = express()

app.use(bodyParser.json())
app.use(compression())
app.use(helmet())
app.use(userRouter)


mongoose.connect(`mongodb+srv://rassell0:${process.env.SECRET_KEY}@cluster0.liytjfw.mongodb.net/FocusFrontier`).then((response)=>{
  //  console.log(response)
    app.listen(process.env.PORT || 4000)
}).catch(err =>{
    console.log(err)
})
       