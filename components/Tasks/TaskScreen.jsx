import React, { useState, useEffect } from 'react';
import {
  View,
TouchableOpacity,
  FlatList,
} from 'react-native';
  import {ReactNativeAsyncStorage} from "@react-native-async-storage/async-storage"
import tailwind from 'twrnc';
import {Ionicons} from "@expo/vector-icons"
import Task from './Task';
import AddTaskBtn from './AddTaskBtn';
import EmptyTaskScreen from './EmptyTaskScreen';
import TaskModal from './TaskModal';
//import { Notifications } from '@react-native-community/notifications';
import { useSelector,useDispatch } from "react-redux"
const TaskScreen = () => {

  const tasks = useSelector(state =>state.user.tasks)
 
const dispatch = useDispatch()
const [showModal,setShowModal] = useState(false)
const [allTasks,setAllTask] = useState([])
  function render({item,index}){
    
return <Task task={item} index={index}/>
  }

function toggleModal(){
setShowModal(state => !state)
}





  return (
    <View style={[tailwind`flex-1 `,{backgroundColor:"#0f1117"}]}>

     {showModal && <TaskModal  closeModal={toggleModal}/>}
<FlatList data={tasks} ListEmptyComponent={EmptyTaskScreen} columnWrapperStyle={tailwind`justify-around`} numColumns={2} renderItem={render}/>
<TouchableOpacity onPress={toggleModal} style={[tailwind`w-15 h-15 rounded-full items-center justify-center absolute right-5 bottom-5`,{backgroundColor:"#404661"}]}>
<Ionicons name='add' size={40} color="#eaf3fe"/>
     </TouchableOpacity>
    </View>
  );
};



export default TaskScreen
