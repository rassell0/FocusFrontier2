const express = require("express")
const userController = require("../controllers/userController")
const taskController = require("../controllers/tasksController")
const timerController = require("../controllers/timerController")
const router = express.Router()

router.post("/getUser",userController.getUserData)

router.get("/createUser", userController.createNewUser)

 
router.post("/addTask",taskController.addTask)

router.post("/addSession",timerController.addSession)
 
module.exports = router  