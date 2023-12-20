import axios from "axios";

export function createUser(){
axios.post("https://focus-frontier-default-rtdb.firebaseio.com/user.json",{
    sessions:{},
    tasks:{}
})
}