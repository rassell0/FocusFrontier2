import { View, Text,Dimensions } from 'react-native'
import React, { useEffect,useState } from 'react'
import { LineChart } from 'react-native-chart-kit'
import tailwind from 'twrnc'
import { useSelector } from 'react-redux'
const WeekGraph = () => {
  const sessions = useSelector(state => state.user.sessions)
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const getISOWeek = (date) => {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7));
    const yearStart = new Date(dt.getFullYear(), 0, 1);
    return Math.ceil(((dt - yearStart) / 86400000 + 1) / 7);
  };
    const {width,height} = Dimensions.get("window")





    useEffect(() => {
      
      const currentDate = new Date();
      const currentWeek = getISOWeek(currentDate);
  
      // Initialize an array to hold data for each day of the week
      const weeklyDataArray = [0, 0, 0, 0, 0, 0, 0];
  
      // Populate the array with session data
      sessions.forEach((session) => {
   
        const sessionDate = new Date(session.endTime).getDay();
     
        if (getISOWeek(session.endTime) === currentWeek && session.completed === true) {
          weeklyDataArray[sessionDate] += 1;
        }
      });
  
      // Update the state with the calculated data
      setWeeklyData(weeklyDataArray);
    }, [sessions]);







const idk =[12,6,9,10,7,59,6]
  

      const data = {
        labels: ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"],
        datasets: [
          {
            data: weeklyData,
            color: (opacity = 1) => `rgba(234, 243, 254, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Weekly Sessions"] // optional
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

export default WeekGraph