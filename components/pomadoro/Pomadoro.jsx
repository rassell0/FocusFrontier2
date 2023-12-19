import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
import PomodoroBtns from './PomodoroBtns';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import * as Notifications from 'expo-notifications';
import * as Svg from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addSession } from '../../redux/user';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    };
  },
});

let isInitial = true;

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [currentduration,setCurrentDuration] = useState(0)
  const [key, setKey] = useState(0);
  const [tracker, setTracker] = useState({
    startTime: null,
    endTime: null,
  });
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.user.sessions);
  const uid = useSelector((state) => state.user.id);

  async function addSessiontoDb(data) {
    fetch("http://192.168.1.71:4000/addSession",{
      method:"POST",
      body:JSON.stringify({
        id:uid,
        data
      }),
      headers:{
        "Content-Type":"application/json"
      }
    }) 
  }

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }

  }, [sessions]); 
  

  function notification() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's Up!",
        body: 'Take a quick break. You deserve it!',
        vibrate: true,
        sound: true,
      },
      trigger: null,
    });
  }

  function restNotification() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Break's Over!",
        body: "Let's tackle the next task!",
        vibrate: true,
        sound: true,
      },
      trigger: null,
    });
  }

  function startBreak() {
    setIsResting(true);
    setKey((state) => state + 1);
    setMinutes(5);
    setTracker({
      startTime: null,
      endTime: null, 
    });
  }


  const handleStartPause = () => {
  
    if (!isActive) {
      setTracker((state) => ({
        ...state,
        startTime: new Date(),
      }));
    } else{
      
         const duration =((new Date() - tracker.startTime) / 1000);
         setCurrentDuration(state => state + duration)
         setTracker((state) => ({
          ...state,
          startTime: null,
        })); 
       
    }
    setIsActive(!isActive);

  }; 

   
  const handleReset = () => {
    let endTime = new Date();
if ( tracker.startTime === null && !isResting) { 
    dispatch(
        addSession({
          date: endTime.toISOString().split('T')[0],
          duration:Math.round(currentduration),
          completed:  false,
        })
      );
      addSessiontoDb({
        endTime: endTime.toISOString().split('T')[0],
        duration:Math.round(currentduration),
        completed:  false,
      })
    } else if (tracker.startTime !== null){
      const duration =((endTime - tracker.startTime) / 1000);
      dispatch(
        addSession({
          date: endTime.toISOString().split('T')[0],
          duration:Math.round(currentduration + duration),
          completed:  false,
        })
      );
      addSessiontoDb({
        endTime: endTime.toISOString().split('T')[0],
        duration:Math.round(currentduration + duration),
        completed:  false,
      })
    }
   
    setKey((state) => state + 1);
    setIsActive(false);
    setMinutes(25);
    setTracker({
      startTime: null,
      endTime: null, 
    });
    setCurrentDuration(0)
    setIsResting(false);

  };

  return (
    <View style={[tailwind`flex-1 justify-between items-center`, { backgroundColor: '#0f1117' }]}>
      <View></View>
      <View>
        <CountdownCircleTimer
          isPlaying={isActive}
          duration={minutes * 60}
          colors={['#404661', '#404661', '#404661', '#404661', '#404661', '#404661']}
          colorsTime={[10, 5, 2, 0]}
          size={300}
          key={key}
          onComplete={() => {
            if (isResting) {
              
              restNotification();
              handleReset();
            } else {
              let endTime = new Date();
              //
              const duration = ((endTime - tracker.startTime) / 1000);
              dispatch(
                addSession({
                
                  endTime: endTime.toISOString().split('T')[0],
                  duration:Math.round(currentduration + duration),
                  completed: true,
                })
              );
              addSessiontoDb({
                endTime: endTime.toISOString().split('T')[0],
                duration:Math.round(currentduration + duration),
                completed: true,
              })
              notification();
              startBreak();
            }
            return { shouldRepeat: false };
          }}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            return (
              <Text style={{ fontSize: 80, color: '#eaf3fe' }}>
                {minutes < 10 && '0'}
                {minutes}:{seconds < 10 && '0'}
                {seconds}
              </Text>
            );
          }}
        </CountdownCircleTimer>
      </View>
      <View style={tailwind`flex-row mb-4 w-1/1 justify-around`}>
        <PomodoroBtns onPress={handleReset} name={'RESET'} />
        <PomodoroBtns onPress={handleStartPause} name={isActive ? 'PAUSE' : 'START'} />
      </View>
    </View>
  );
};

export default PomodoroTimer;

