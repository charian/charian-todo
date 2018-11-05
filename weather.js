import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { LinearGradient } from 'expo';

export default class Weather extends Component {
    render() {
        return(
            <LinearGradient 
                colors={['#19182E', '#2D2A6A']} 
                style={styles.container} 
            />
        );
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});