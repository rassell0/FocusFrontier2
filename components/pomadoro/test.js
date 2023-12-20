import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import * as Notifications from 'expo-notifications';
import tailwind from 'twrnc';
import PomodoroBtns from './PomodoroBtns';
import { useDispatch, useSelector } from 'react-redux';
import { addSession, setSessions, setId } from '../../redux/user';



const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [key, setKey] = useState(0);
  const [tracker, setTracker] = useState({
    startTime: null,
    endTime: null,
  });
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.user.sessions);
  const uid = useSelector((state) => state.user.id);

  const addSessionToDb = async (data) => {
    try {
      const response = await fetch('http://192.168.12.71:4000/addSession', {
        method: 'POST',
        body: JSON.stringify({
          id: uid,
          data,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Handle response if needed
    } catch (error) {
      console.error(error);
    }
  };

  const sendNotification = (title, body) => {
    setTimeout(() => {
      Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          vibrate: true,
          sound: true,
        },
        trigger: null,
      });
    }, 1000); // Add a delay of 1 second (adjust as needed)
  };

  const startBreak = () => {
    setIsResting(true);
    setKey((state) => state + 1);
    setMinutes(5);
    setTracker({
      startTime: null,
      endTime: null,
    });
  };

  const handleStartPause = () => {
    setTracker((state) => ({
      ...state,
      startTime: isActive ? null : new Date(),
    }));
    setIsActive(!isActive);
  };

  const handleReset = () => {
    const endTime = new Date();
    const duration = tracker.startTime !== null ? (endTime - tracker.startTime) / 1000 : 0;

    dispatch(
      addSession({
        date: endTime.toISOString().split('T')[0],
        duration: Math.round(currentDuration + duration),
        completed: false,
      })
    );
    addSessionToDb({
      endTime: endTime.toISOString().split('T')[0],
      duration: Math.round(currentDuration + duration),
      completed: false,
    });

    setKey((state) => state + 1);
    setIsActive(false);
    setMinutes(25);
    setTracker({
      startTime: null,
      endTime: null,
    });
    setCurrentDuration(0);
    setIsResting(false);
  };

  return (
    <View style={[tailwind`flex-1 justify-between items-center`, { backgroundColor: '#0f1117' }]}>
      {/* ... other components */}
      <CountdownCircleTimer
        // ... other props
        onComplete={() => {
          if (isResting) {
            sendNotification("Break's Over!", "Let's tackle the next task!");
            handleReset();
          } else {
            const endTime = new Date();
            const duration = (endTime - tracker.startTime) / 1000;

            dispatch(
              addSession({
                endTime: endTime.toISOString().split('T')[0],
                duration: Math.round(currentDuration + duration),
                completed: true,
              })
            );
            addSessionToDb({
              endTime: endTime.toISOString().split('T')[0],
              duration: Math.round(currentDuration + duration),
              completed: true,
            });

            sendNotification("Time's Up!", 'Take a quick break. You deserve it!');
            startBreak();
          }
          return { shouldRepeat: false };
        }}
      >
        {/* ... */}
      </CountdownCircleTimer>
      {/* ... other components */}
    </View>
  );
};

export default PomodoroTimer;
