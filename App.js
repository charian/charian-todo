import React, { Component } from "react";
import {AppRegistry, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import SideMenu from 'react-native-side-menu';

import { Screens } from './router';
import Weather from "./Weather";
import Menu from './Menu';


const API_KEY = "T4pjG2TFl6rGlAhzoYeo3bbLEpkmzeiF";
const datagokr_KEY = "aiMmkue91q4efKfTD0%2FfGF7Zv%2FIFyFZLqLVxcVrI7O9ZEgiKsA1yawel2kBvXgBvwaIAZ7ygUg%2BFJN1ex7n65w%3D%3D";
const kakao_KEY = "d114ff2a6ca1e7124eb497fbfcb660a4"
const token = "b8e396fd8d70334cc7860ccc70ae8ee2bbe42d07"

//seoul sample     	cc5o58o52jem0klr43e0le9ubv
//Key: 226081
//lat: 37.537
//long:126.97

export default class App extends Component{

  state = {
    isLoaded: false,
    error: null,
    isModalVisible: false,
    isModalVisible2: false,
    menuOpen: false,
    locationKey: null,
    temperature: null,
    name: null,
    countrytext: null,
    locationtext: null,
    thenyesterday: null,
    humidity: null,
    cityname: null,
    mtx: null,
    mty: null,
    pmStation: null,
    currentPositionPM25: null,
    currentPositionPM10: null,
    
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this._getWeather(position.coords.latitude, position.coords.longitude);
        console.log(position);
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  }
  _getWeather = (lat, long) => {
    //fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=40.730610,-73.935242`)
    fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat},${long}`)
      .then(response => response.json())
      .then(location => {
        console.log('location data');
        console.log(location);
        this.setState({
          locationKey: location.Key,
          countrytext: location.Country.LocalizedName,
          locationtext: location.AdministrativeArea.LocalizedName,
          cityname: location.ParentCity.LocalizedName
          //isLoaded: true
        })
        return fetch(`https://dataservice.accuweather.com/currentconditions/v1/` + this.state.locationKey + `?apikey=${API_KEY}&details=true`)
      })
      .then(response => response.json())
      .then(locationData => {
        console.log('weather data');
        console.log(locationData);
        this.setState({
          temperature: locationData[0].Temperature.Metric.Value,
          name: locationData[0].WeatherText.replace(/\s/gi,""), //.replace(/\-/g,'')
          thenyesterday: locationData[0].Past24HourTemperatureDeparture.Metric.Value,
          humidity: locationData[0].RelativeHumidity,
          isLoaded: true
        })

        // return fetch(`https://api.waqi.info/feed/geo:${lat};${long}/?token=${token}`)
        // .then(response => response.json())
        // .then(AQI => {
        //   console.log(AQI);
        // })



        //return fetch(`https://dapi.kakao.com/v2/local/geo/transcoord.json?x=-73.935242&y=40.730610&input_coord=WGS84&output_coord=TM`,{
        return fetch(`https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${long}&y=${lat}&input_coord=WGS84&output_coord=TM`,{
          headers: new Headers({'Authorization': 'KakaoAK d114ff2a6ca1e7124eb497fbfcb660a4'}),
        })
        console.log(locationData[0].WeatherText);
      })
      .then(response => response.json())
      .then(wgsTotm => {
        console.log(wgsTotm);
        this.setState({
          mtx: wgsTotm.documents[0].x,
          mty: wgsTotm.documents[0].y
        })
        console.log(wgsTotm.documents[0].x);
        console.log(wgsTotm.documents[0].y);
        return fetch(`http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=` + this.state.mtx + `&tmY=` + this.state.mty + `&pageNo=1&numOfRows=10&ServiceKey=${datagokr_KEY}&_returnType=json`)
      })
      .then(response => response.json())
      .then(airkoreadata => {
        console.log(airkoreadata);
        this.setState({
          pmStation: airkoreadata.list[0].stationName
        })
        console.log(airkoreadata.list[0].stationName);
        return fetch(`http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=` +  encodeURI(this.state.pmStation , "UTF-8") + `&dataTerm=month&pageNo=1&numOfRows=10&ServiceKey=${datagokr_KEY}&ver=1.3&_returnType=json`)
        .then(response => response.json())
        .then(airpolution => {
          console.log(airpolution);
          this.setState({
            currentPositionPM25:airpolution.list[0].pm25Value,
            currentPositionPM10:airpolution.list[0].pm10Value
          })
          console.log(airpolution.list[0].pm25Value);
          console.log(airpolution.list[0].pm10Value);
        })

      })
  };

  //http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=197278.84303036687&tmY=448305.79505367856&pageNo=1&numOfRows=10&ServiceKey=aiMmkue91q4efKfTD0%2FfGF7Zv%2FIFyFZLqLVxcVrI7O9ZEgiKsA1yawel2kBvXgBvwaIAZ7ygUg%2BFJN1ex7n65w%3D%3D&_returnType=json
  //http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=244148.546388&tmY=412423.75772&pageNo=1&numOfRows=10&ServiceKey=aiMmkue91q4efKfTD0%2FfGF7Zv%2FIFyFZLqLVxcVrI7O9ZEgiKsA1yawel2kBvXgBvwaIAZ7ygUg%2BFJN1ex7n65w%3D%3D&ver=1.0
  //http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=244148.546388&tmY=412423.75772&pageNo=1&numOfRows=10&ServiceKey=aiMmkue91q4efKfTD0/fGF7Zv/IFyFZLqLVxcVrI7O9ZEgiKsA1yawel2kBvXgBvwaIAZ7ygUg+FJN1ex7n65w==


  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });
    
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
      selectedItem: 'Screen1',
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
  this.setState({
    isOpen: false,
    selectedItem: item,
  });
  

  render() {
    
    const { isLoaded, error, temperature, name, countrytext, locationtext, thenyesterday, humidity, cityname, currentPositionPM10, currentPositionPM25} = this.state;
    const menu = <Menu onItemSelected={this.onMenuItemSelected} navigator={navigator}/>;
    
    return (
      
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        style={styles.sidemenu}
      >

        <View style={styles.container}>

          <View style={styles.headers}>
            <TouchableOpacity onPress={this.toggle} style={styles.button}>
              <Image style={styles.callLeftmenu} source={require('./assets/images/hamburger-2x.png')}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._toggleModal} style={styles.locationTitle}>
              <Text style={styles.locationTitleText}>{this.state.cityname}</Text>
              <MaterialCommunityIcons name="menu-down" size={32} color="white" style={styles.locationCallIcon} />
            </TouchableOpacity>
          </View>

          <Modal 
          isVisible={this.state.isModalVisible2} 
          animationIn='bounceIn'
          easing='ease-in'
          animationOut='fadeOut' 
          backdropOpacity={0.3}
          >
            <View style={styles.modalContainer2}>
              <View>
                <Text>Current Location</Text>
              </View>
              <View>
                <TouchableOpacity onPress={this._toggleModal2}>
                  <Text>Hide me!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>


          <Modal 
          isVisible={this.state.isModalVisible} 
          animationIn='bounceIn'
          easing='ease-in'
          animationOut='fadeOut' 
          backdropOpacity={0.3}
          >
            <View style={styles.modalContainer}>
              <View>
                <Text>Current Location</Text>
              </View>
              <View>
                <Text>Any Added Location</Text>
              </View>
              <TouchableOpacity onPressOut={this._toggleModal2} style={styles.locationTitle}>
                <View>
                  <Text>ADD New Location{"\n"}by Keyword</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._toggleModal}>
                <Text>Hide me!</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Screens />
          {isLoaded ? (
            <Weather
              weatherName={name}
              temp={Math.ceil(temperature - 0)}
              countryText={countrytext}
              locationText={locationtext}
              cityName={cityname}
              thenYesterday={thenyesterday}
              Humidity={humidity}
              PM10={currentPositionPM10}
              PM25={currentPositionPM25}
            />
          ) : (
            <View style={styles.loading}>
              <Text style={styles.loadingText}>Getting the fucking weather</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          )}
        </View>
      </SideMenu>
    );
  }

}

const styles = StyleSheet.create({
  sidemenu: {
    flex: 1,
    
  },
  container: {
    flex: 1,

  },
  loading: {
    flex: 1,
    backgroundColor: '#181740',
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 1000
  },
  loadingText: {
    fontSize: 38,
    marginBottom: 150,
    color: '#fff'
  },
  locationTitle: {
    alignItems: 'stretch',
    marginLeft: 15,
    flexDirection: 'row',
  },
  locationTitleText: {
    fontSize: 27,
    color: '#fff',
    fontFamily: "Arial Rounded MT Bold",
    marginTop: -6
  },
  locationCallIcon: {
    marginTop: -3
  },
  callLeftmenu: {
    width: 24,
    height: 20,
    
  },
  headers: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 67,
    left: 26,
    zIndex: 100,
  },
  modalLocaton: {
    zIndex: 150,
    backgroundColor: '#fff'
  },
  absolute: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    elevation:4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 99
  },
  modalContainer2: {
    backgroundColor: '#fff',
    elevation:4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 100
  }
});
