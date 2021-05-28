import React, { useState, useEffect, useRef } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Text,
  TextInput,
  ImageBackground,
  Alert,
  BackHandler
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, Images } from '@constants';
import { Constants } from '../../constants';

export default function MapViewScreen({ navigation }) {
  const [business, setBusiness] = useState(Constants.business.filter(each => each.status === 'approved'));
  const [keyword, setKeyword] = useState();

  const [businessResultData, setBusinessResultData] = useState([]);
  const [markerIdData, setMarkerIdData] = useState([]);
  
  let mapRef = useRef();

  useEffect(() => {
    getMarkerData();   
  }, [])

  useEffect(() => {
    getMarkerData();
  }, [business])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(markerIdData)
    }
  }, [markerIdData])

  function getMarkerData () {
    var businessResultData = [];
    var markerIdData = [];
    business.forEach((each) => {
      if (each.location.latitude && each.location.longitude) {
        businessResultData.push(each);
        markerIdData.push(each.id);        
      }
    });
    setBusinessResultData(businessResultData);
    setMarkerIdData(markerIdData);
  }

  function onSearch(text){
    var filtered = Constants.business.filter(each => (each.name?.toLowerCase().includes(text.toLowerCase()) || each.address?.toLowerCase().includes(text.toLowerCase())) && each.status === 'approved');
    if (filtered) setBusiness(filtered);
    else setBusiness([]);
    // setKeyword(text);
  }

  function showAlert() {
    Alert.alert('You should login first!', 'Going to login now?',
      [
        {
          text: 'OK', onPress: () => navigation.navigate('Auth')
        },
        {
          text: 'CANCEL', onPress: () => { }
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => {
            if (Constants.user) {
              navigation.navigate('Profile')
            }
            else {
              showAlert();
            }
          }}>
            <EntypoIcon name="user" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Hunters Loop</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        {
          businessResultData[0]?.location.latitude && businessResultData[0]?.location.longitude &&
          <MapView
            ref={mapRef}
            initialRegion={{
              latitude: businessResultData[0].location.latitude,
              longitude: businessResultData[0].location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest={false}
            zoomControlEnabled={true}
            style={{ flex: 1 }}
            onMapReady={() => {          
              console.log(markerIdData)    
              mapRef.current.fitToSuppliedMarkers(markerIdData, {
                edgePadding:
                {
                  top: 50,
                  right: 50,
                  bottom: 50,
                  left: 50
                }
              })
            }}
          >
            {
              businessResultData.map((each, index) => (
                <Marker
                  key={index}
                  coordinate={each.location}
                  title={each.name}
                  identifier={each.id}
                  image={Images.marker}
                  onCalloutPress={() => {
                    Constants.backRoute = 'Home';
                    navigation.navigate('Home', { screen: 'ServiceList', params: { businessItem: each } })
                  }}
                  style={{ width: 30, height: 30 }}
                />
              ))
            }
          </MapView>
        }
        <View style={styles.searchOverlay}>
          <View style={styles.searchBoxContainer}>
            <TextInput
              style={styles.inputBox}
              autoCapitalize='none'
              placeholder={'Search'}
              placeholderTextColor={Colors.greyWeakColor}
              value={keyword}
              onChangeText={(text) => onSearch(text)}
            >
            </TextInput>
          </View>
        </View>
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(20,20,20,0.7)']} style={styles.btnBackGradient}></LinearGradient>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('BusinessList')}>
          <Text style={styles.btnTxt}>VIEW LIST</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  header: {
    width: '100%',
    height: normalize(70, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.blackColor
  },
  iconBackContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
  },
  titleTxt: {
    fontSize: RFPercentage(3.5),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  mapContainer: {
    flex: 1,
  },
  searchOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: Colors.blackColor,
    width: '100%',
    height: normalize(60, 'height'),
    opacity: 0.6,
    justifyContent: 'center'
  },
  searchBoxContainer: {
    width: '90%',
    height: normalize(40, 'height'),
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: Colors.whiteColor,
    borderRadius: normalize(25),
    borderWidth: normalize(3),
  },
  inputBox: {
    width: '100%',
    height: '100%',
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
    paddingLeft: normalize(10),
    textAlignVertical: 'center',
  },

  btnBackGradient: {
    width: '100%',
    height: normalize(100, 'height'),
    position: 'absolute',
    bottom: 0
  },
  btn: {
    width: '80%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.yellowToneColor,
    position: 'absolute',
    bottom: normalize(45, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: normalize(8),
    zIndex: 110
  },
  btnTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor
  },
});