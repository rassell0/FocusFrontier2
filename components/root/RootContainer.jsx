import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Pomadoro from '../pomadoro/Pomadoro';
import {Ionicons} from "@expo/vector-icons"
import { collection, addDoc ,doc, getDoc,setDoc} from "firebase/firestore"; 
import { db } from '../../firebaseConfig';
import TaskScreen from '../Tasks/TaskScreen';
import TrackerScreen from '../Tracker/TrackerScreen';
import AsyncStorage from "@react-native-async-storage/async-storage"
import {useSelector,useDispatch} from "react-redux"

import * as Notifications from 'expo-notifications';
import { setId, setTasks,setSessions } from '../../redux/user'; 
const RootContainer = () => {
    const Tab = createBottomTabNavigator()

const idk = useSelector(state => state.user) 
console.log(idk)
const dispatch = useDispatch()
useEffect(() => {
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to receive notifications was denied!');
    }
  };

//  requestNotificationPermission();
}, []);

useEffect(()=>{

  async function config(){
    const id = await AsyncStorage.getItem("id")

if(!id){
  //10.2.3.232 maddie
  // 192.168.1.71 mine
   fetch("http://192.168.1.71:4000/createUser").then(res =>{
      return res.json()
    }).then(res=>{
      AsyncStorage.setItem("id",res._id)
     dispatch(setId(res._id))
    }).catch(err =>{
      console.log(err)
    })
}else{
  fetch("http://192.168.1.71:4000/getUser",{
    method:"POST",
    body:JSON.stringify({id}),
    headers:{
      "Content-Type":"application/json" 
    }
  }).then(res =>{
return res.json()
  }).then(res =>{
   
    dispatch(setId(res._id))
    dispatch(setTasks(res.tasks))
     dispatch(setSessions(res.sessions))
  }).catch(err =>{
    console.log(err)
  })
}
  } 
   
   //AsyncStorage.clear() 
  config()     
},[])


 
  return ( 
  <NavigationContainer>
<Tab.Navigator screenOptions={{
  tabBarStyle:{
    backgroundColor:"#404661"
    
  },
headerStyle:{
    backgroundColor:"#404661"
}, 
headerTintColor:"#eaf3fe",
tabBarActiveTintColor:"#eaf3fe",
tabBarInactiveTintColor:"#0f1117",

}}>
     
     <Tab.Screen name='Tracker' options={{
        tabBarIcon:({size,color})=>{return <Ionicons size={size} color={color} name='analytics-outline'/>}
    }} component={TrackerScreen}/>
 <Tab.Screen name='Tasks' options={{
        tabBarIcon:({size,color})=>{return <Ionicons size={size} color={color} name='create-outline'/>}
    }} component={TaskScreen}/>
    <Tab.Screen name='Pomadoro' options={{
        tabBarIcon:({size,color})=>{return <Ionicons size={size} color={color} name='alarm-outline'/>}
    }} component={Pomadoro}/>
   
</Tab.Navigator>
  </NavigationContainer>
  )
}

export default RootContainer
