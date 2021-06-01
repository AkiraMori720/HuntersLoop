import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Text,
  ImageBackground,
  PermissionsAndroid,
  Alert
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import KeyboardManager from 'react-native-keyboard-manager';

import GetLocation from 'react-native-get-location';

import {
  request, requestMultiple,
  check, checkMultiple,
  checkNotifications, requestNotifications,
  PERMISSIONS, RESULTS
} from 'react-native-permissions';

import Spinner from 'react-native-loading-spinner-overlay';

import { Colors, Images, Constants } from '@constants';
import {getUser, getData, checkInternet, setFcmToken} from '../service/firebase';

export default function SplashScreen({ navigation }) {

  const [spinner, setSpinner] = useState(false);
  const [checkInternetTimer, setCheckInternetTimer] = useState();

  useEffect(() => {
    if (Platform.OS === 'ios') keyboardManager();

    if (Platform.OS == 'android') {
      requestPermissionAndroid()
        .then(() => {
          requestLocation();
          // getAllData();
        })
        .catch((err) => {
          console.log('request permission error', err);
          requestLocation();
        })
    }
    else {
      requestPermissionIOS()
        .then(() => {
          requestLocation();
          // getAllData();
        })
        .catch((err) => {
          console.log('request permission error', err);
          requestLocation();
        })
    }
  }, [])

  const keyboardManager = () => {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableDebugging(false);
      KeyboardManager.setKeyboardDistanceFromTextField(10);
      KeyboardManager.setPreventShowingBottomBlankSpace(true);
      KeyboardManager.setEnableAutoToolbar(true);
      KeyboardManager.setToolbarDoneBarButtonItemText("Done");
      KeyboardManager.setToolbarManageBehaviour(0);
      KeyboardManager.setToolbarPreviousNextButtonEnable(false);
      KeyboardManager.setShouldToolbarUsesTextFieldTintColor(false);
      KeyboardManager.setShouldShowTextFieldPlaceholder(true); // deprecated, use setShouldShowToolbarPlaceholder
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
      KeyboardManager.setOverrideKeyboardAppearance(false);
      KeyboardManager.setShouldResignOnTouchOutside(true);
      KeyboardManager.resignFirstResponder();
      KeyboardManager.isKeyboardShowing()
        .then((isShowing) => {
        });
    }
  }

  const requestPermissionAndroid = async () => {
    try {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);
      if (results[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
        results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
        results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('all permission granted');

      }
      else {
        console.log('permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const requestPermissionIOS = () => {
    return new Promise((resolve, reject) => {
      requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then(
        (statuses) => {
          // console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
          // console.log('Photo Library', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);          
          resolve();
        }
      ).catch((err) => {
        reject(err)
      })
    })
  }

  const requestLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then(location => {
        Constants.location.latitude = location.latitude;
        Constants.location.longitude = location.longitude;
        // console.log('location', Constants.location);
        checkInternetProcedure();
      })
      .catch(ex => {
        // GetLocation.openAppSettings();
        checkInternetProcedure(); //temp
      });
  }

  async function checkInternetProcedure() {
    var isConnected = await checkInternet();
    if (!isConnected) {
      Alert.alert('Please check your internet connection.');
      var checkInternetTimer = setInterval(timer, 1000);  
      setCheckInternetTimer(checkInternetTimer);
      return;
    }
    getAllData();
  }

  async function timer(){
    var isConnected = await checkInternet();
    if (isConnected) {
      getAllData();
    }
  }

  const getAllData = async () => {
    if(checkInternetTimer) clearInterval(checkInternetTimer);
    setSpinner(true);
    await getData('users').then(res => Constants.users = res);
    await getData('business').then(res => Constants.business = res);
    await getData('services').then(res => Constants.services = res);
    await getData('categories').then(res => Constants.categories = res);
    await getData('reviews').then(res => {
      if (Array.isArray(res)) {
        Constants.reviews = res.filter(each => each.status === 'accepted')
      }
    });
    await getData('memberships').then(res => Constants.memberships = res.sort((a, b) => a.dispOrder - b.dispOrder));
    goScreen();
  }

  const goScreen = () => {
    AsyncStorage.getItem('user')
      .then(async (user) => {
        // console.log('user', user)
        if (user) {
          Constants.user = JSON.parse(user);
          setSpinner(false);
          await setFcmToken(Constants.user.id);
          navigation.navigate("Home", { screen: 'BusinessList' });
          if(Constants.notification){
            setTimeout(() => navigation.navigate("Home", { screen: '' }, 1000));
          }
        }
        else {
          // navigation.navigate('Auth')
          setSpinner(false);
          navigation.navigate("Home", { screen: 'BusinessList' });
          Constants.notification = null;
        }
      })
  }

  return (
    <ImageBackground style={styles.container} source={Images.background}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={Images.logo} />
      </View>
      <View style={styles.logoFooterContainer}>
        <Image style={styles.logoFooter} source={Images.logoFooter} />
      </View>
    </ImageBackground>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  logoContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '40%',
    resizeMode: 'contain',
  },
  logoFooterContainer: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoFooter: {
    width: '50%',
    height: '80%',
    resizeMode: 'contain'
  },
});