import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import loginScreen from './screens/loginScreen';
import registerScreen from './screens/registerScreen';
import chatScreen from './screens/chatScreen';
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component = {loginScreen}/>
        <Stack.Screen name="Register" component = {registerScreen}/>
        <Stack.Screen name="Chat" component = {chatScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
