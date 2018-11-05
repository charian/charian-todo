import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import Weather from './Weather';

export default class App extends Component {
  state = {
    isLoaded: true
  }
  render() {
    const {isLoaded} = this.state;
    return (
      <View style={styles.container}>
        {isLoaded ? <Weather /> : <View style={styles.loading}>
          <Text style={styles.loadingText}>Getting the SUPER Cool Weather</Text>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loading: {
    flex: 1,
    backgroundColor: '#181740',
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingRight: 20
  },
  loadingText: {
    fontSize: 38,
    marginBottom: 150,
    color: '#fff'
  }
});
