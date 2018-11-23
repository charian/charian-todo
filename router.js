import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet } from 'react-native';

import Screen1 from './Screen1';



export const Screens = createStackNavigator(

    {
        Screen1 :{
            screen: Screen1,
            navigationOptions: {
                title: 'Screen 1',
                //headerTitleStyle: styles.titleMenu,
                headerLeft: null
            }
        },
    },
    {
        initialRouteName: 'Screen1',
        headerMode:'float',        
    }
);

const styles = StyleSheet.create({
    titleMenu: {
      left: 50
    },
}); 