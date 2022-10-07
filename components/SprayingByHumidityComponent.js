import { View, Text, PanResponder  } from 'react-native';
import React, { useState, useRef } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Switch } from "@react-native-material/core";

const MAX_POINTS = 100;

const SprayingByHumidityComponent = () => {
  const [checked, setChecked] = useState(true);
  const [stateFill,setStateFill] = useState({
    isMoving: false,
    pointsDelta: 0,
    points: 50,
  });

  const _circularProgressRef  = useRef();
  const _panResponder  = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      setStateFill({...stateFill, isMoving: true, pointsDelta: 0 });
    },

    onPanResponderMove: (evt, gestureState) => {
      if (_circularProgressRef.current) {
        _circularProgressRef.current.animate(0, 0);
      }
      // For each 2 pixels add or subtract 1 point
      setStateFill({...stateFill,pointsDelta: Math.round(-gestureState.dy / 2) });
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (_circularProgressRef.current) {
        _circularProgressRef.current.animate(100, 3000);
      }
      let points = stateFill.points + stateFill.pointsDelta;
      setStateFill({
        isMoving: false,
        points: points > 0 ? Math.min(points, MAX_POINTS) : 0,
        pointsDelta: 0,
      });
    },
  });

  const fillCircular = (stateFill.points / MAX_POINTS)*100;

  return (

    <View style={{
      flex: 1,
      alignItems:'center',
      justifyContent:'flex-start',
      height:'95%'
    }} {..._panResponder.panHandlers}>
      <Text style={{
        top:30,
        fontSize:30
      }}>Humidity</Text>
    <AnimatedCircularProgress
      style={{
        top:'20%'
      }}
      size={150}
      width={15}
      fill={fillCircular}
      tintColor="#00e0ff"
      backgroundColor="#3d5875" >
        {fill => <Text style={{    
          textAlign: 'center',
          color: '#7591af',
          fontSize: 20,
          fontWeight: '100',}}>
          {Math.round((MAX_POINTS * fill) / 100)} %</Text>}
      </AnimatedCircularProgress>
    </View>
  )
}

export default SprayingByHumidityComponent