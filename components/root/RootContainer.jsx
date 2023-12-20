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



async function config2(){
  const id = await AsyncStorage.getItem("id")
if(!id){
  const docRef = await addDoc(collection(db, "user"), {
    sessions:[],
     tasks:[]
   });
   AsyncStorage.setItem("id",docRef.id)
   dispatch(setId(docRef.id))
 }else{
  const docRef = doc(db, "user", id);
const docSnap = await getDoc(docRef);


dispatch(setId(id))
dispatch(setTasks(docSnap.data().tasks))
 dispatch(setSessions(docSnap.data().sessions))

 }
 
}
  



   
 //  AsyncStorage.clear() 
  config2()     
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
