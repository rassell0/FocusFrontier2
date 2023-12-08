import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
import PomodoroBtns from './PomodoroBtns';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addSession } from '../../redux/sessions';
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
  const [key, setKey] = useState(0);
  const [tracker, setTracker] = useState({
    startTime: null,
    endTime: null,
  });
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions.sessions);

  async function addSessiontoDb() {
    const id = await AsyncStorage.getItem('id');
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { sessions });
  }

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    addSessiontoDb();
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
  }

  const handleStartPause = () => {
    if (!isActive) {
      setTracker((state) => ({
        ...state,
        startTime: new Date(),
      }));
    } else if (isActive && tracker.startTime !== null) {
      setTracker((state) => ({
        ...state,
        endTime: new Date(),
      }));
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    if (!isResting) {
      let endTime = tracker.endTime ? tracker.endTime : new Date();
      const duration = Math.floor((endTime - tracker.startTime) / 1000);
    dispatch(
        addSession({
          startTime: tracker.startTime.toISOString().split('T')[0],
          endTime: endTime.toISOString().split('T')[0],
          duration,
          completed: isResting ? true : false,
        })
      );
      
    }

    setKey((state) => state + 1);
    setIsActive(false);
    setMinutes(25);
    setTracker({
      startTime: null,
      endTime: null,
    });
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
              const duration = Math.floor((endTime - tracker.startTime) / 1000);
              dispatch(
                addSession({
                  startTime: tracker.startTime.toISOString(),
                  endTime: endTime.toISOString(),
                  duration,
                  completed: true,
                })
              );
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

