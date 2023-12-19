import React ,{useEffect}from 'react';
import { View, Text, TouchableOpacity,Dimensions } from 'react-native';
import tailwind from 'twrnc';
import Divider from './Divider';
import Summary from './Summary';
import Total from './Total';
import { FlatList } from 'react-native';
import WeekGraph from './WeekGraph';
import MonthGraph from './MonthGraph';
import { useSelector } from 'react-redux';


const TrackerScreen = () => {

const data = [<Summary/>,<Total/>,<WeekGraph/>,<MonthGraph/>]

function render({item}){
    return item
}


  return (
    <View style={[tailwind`flex-1 items-center `,{backgroundColor:"#0f1117"}]}>
      
            <FlatList data={data} renderItem={render}/>
      
    </View>
  );
};



export default TrackerScreen;
