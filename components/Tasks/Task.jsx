import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tailwind from 'twrnc'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {Ionicons} from "@expo/vector-icons"
import { Alert } from 'react-native';
import { addTask, setTasks } from '../../redux/user';
import { collection, addDoc ,doc, getDoc,setDoc ,updateDoc} from "firebase/firestore"; 
import { db } from '../../firebaseConfig';
import { useDispatch,useSelector } from "react-redux"
const Task = ({task,index}) => {

const [checked,setchecked] = useState(false)
const {date,priority,taskName} = task


const user = useSelector(state =>state.user)

const dispatch = useDispatch()

const deleteTask = () =>{
  Alert.alert('Delete Task', 'Do you really want to delete this task?', [
    {
      text: 'Cancel',
  
      style: 'cancel',
    },
    {text: 'Delete', onPress:()=>{
      const updatedTasks = [...user.tasks];
      const removedTask = updatedTasks.splice(index, 1);
      dispatch(setTasks(updatedTasks))
      deleteFromDb(updatedTasks)
    },style:"destructive"},
  ]);
}

 const deleteFromDb = async (data) =>{
 
 
  const userDocRef = doc(db, "user", user.id);
  await updateDoc(userDocRef, {
      "tasks": data,
  });


}

  return (
    
     
      <View style={[tailwind` rounded-lg w-2.3/5   p-4  mx-2 mt-4`,{backgroundColor:"#404661"}]}>
  
      <BouncyCheckbox
  size={30}
  fillColor="#0f1117"
  unfillColor="#eaf3fe"
  text={taskName}
textStyle={[tailwind`text-base`,{color:"#eaf3fe"}]}
  innerIconStyle={{ borderWidth: 2 }}
style={tailwind`text-2xl`}
  onPress={(isChecked) => {
    setchecked(isChecked)
  }}
/>

<Text style={[tailwind`text-sm text-center py-4`,{color:"#eaf3fe",textDecorationLine:checked ?"line-through" : "none"}]}>Due Date: {date}</Text>
<Text style={[tailwind`text-base text-center`,{color:"#eaf3fe",textDecorationLine:checked ?"line-through" : "none"}]}>{priority} Priority</Text>
<View style={tailwind`mt-2 flex-row justify-end`}>
<TouchableOpacity onPress={deleteTask}>
    <Ionicons size={25} color={"#eaf3fe"} name='trash-outline'/>
</TouchableOpacity>
</View>

    </View>
    
  
    
  )
}

export default Task

