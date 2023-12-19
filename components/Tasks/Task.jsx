import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tailwind from 'twrnc'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {Ionicons} from "@expo/vector-icons"
import { Alert } from 'react-native';
import { useDispatch,useSelector } from "react-redux"
const Task = ({task,index}) => {

const [checked,setchecked] = useState(false)
const {date,priority,taskName} = task

const tasks = useSelector(state =>state.user.tasks)



const deleteTask = () =>{
  Alert.alert('Delete Task', 'Do you really want to delete this task?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Delete', onPress: () => console.log('OK Pressed'),style:"destructive"},
  ]);
}

 const deleteFromDb = async () =>{
 // const id = await AsyncStorage.getItem("id")
  let temp = tasks
  let idk = temp.splice(index,1)
console.log(idk) 
  return
  const userRef = doc(db, "users",id);
  await updateDoc(userRef, {
    tasks :temp
  }) 
}

  return (
    
     
      <View style={[tailwind` rounded-lg w-2.3/5   p-4 my-4 `,{backgroundColor:"#404661"}]}>
  
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
<TouchableOpacity onPress={deleteFromDb}>
    <Ionicons size={30} color={"#eaf3fe"} name='create-outline'/>
</TouchableOpacity>
</View>

    </View>
    
  
    
  )
}

export default Task

//
//

/**
 * 
 */