const userSchema = require("../mongoose/userSchema")


exports.getUserData = (req,res) =>{
console.log(req.body.id)
    userSchema.findById(req.body.id).then(response =>{
     return  res.json(response)
    }).catch(err =>{
        console.log(err)
    })
}


exports.createNewUser = (req,res) =>{
const user = new userSchema()

user.save().then(response =>{
res.json(response)
}).catch(err =>{
    console.log(err)
})
}  