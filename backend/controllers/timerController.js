const userSchema = require("../mongoose/userSchema")


exports.addSession = (req,res) =>{


    userSchema.findById(req.body.id).then(response =>{
       
       response.sessions.push(req.body.data) 
    
      return  response.save().then(response =>{
        console.log(response)
      })
    }).catch(err =>{
        console.log(err)
    })
}