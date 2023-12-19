const userSchema = require("../mongoose/userSchema")

exports.addTask = (req,res) =>{
    userSchema.findById(req.body.id).then(response =>{
       
       response.tasks.push(req.body.task) 
       console.log(req.body)
      return  response.save().then(response =>{
        console.log(response)
      })
    }).catch(err =>{
        console.log(err)
    })
}