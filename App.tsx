import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Home from './src/components/Home';
import MusicPlayer from './src/components/MusicPlayer';

export class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MusicPlayer" component={MusicPlayer} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
