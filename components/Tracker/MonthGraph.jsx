import { View, Text,Dimensions } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit'
import tailwind from 'twrnc'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const MonthGraph = () => {

    const {width,height} = Dimensions.get("window")
    const sessions = useSelector(state => state.user.sessions)
    const [monthlySessions,setMonthlySessions] = useState([0,0,0,0,0,0,0,0,0,0,0,0])
  
    const calculateMonthlyData = (currentMonth, sessions) => {
      const monthlyData = Array(12).fill(0);
  
      sessions.forEach((session) => {
        const sessionMonth = session.endTime.split('-').slice(0, 2).join('-');
        if (session.completed === true && sessionMonth === currentMonth) {
          const monthIndex = parseInt(session.endTime.split('-')[1], 10) - 1;
          monthlyData[monthIndex]++;
        }
      });
  
      return monthlyData;
    };

    const getCurrentMonth = () => {
      const currentDate = new Date();
      return currentDate.toISOString().split('-').slice(0, 2).join('-');
    };
      

    useEffect(() => {
  
      const currentMonth = getCurrentMonth();
      const monthlyData = calculateMonthlyData(currentMonth, sessions);
     setMonthlySessions(monthlyData);
    }, [sessions]);




      const data = {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [
          {
            data: monthlySessions,
            color: (opacity = 1) => `rgba(234, 243, 254, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Monthly Sessions"] // optional
      };
      const chartConfig = {
        backgroundGradientFrom: "#404661",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#404661",
        backgroundGradientToOpacity: 1,
        
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 1,
        useShadowColorFromDataset: false // optional
      };
 
  return (
    <View style={tailwind`my-4 rounded-md`}>
      <LineChart
  data={data}
  width={width * .9}
  height={220}
  chartConfig={chartConfig}
/>
    </View>
  )
}

export default MonthGraph