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
  TextInput,
  ImageBackground,
  Alert
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import AppIntroSlider from 'react-native-app-intro-slider';

import { Colors, Images } from '@constants';

export default function WelcomeScreen({ navigation }) {
  const slideImgs = [
    Images.background,
    Images.background,
    Images.background
  ]
  return (
    <View style={styles.container}>
      {/* <View style={styles.overlay}></View> */}
      <AppIntroSlider
        keyExtractor={(item, index) => index}
        data={slideImgs}
        showNextButton={false}
        showDoneButton={false}
        dotStyle={{ backgroundColor: Colors.whiteColor, marginBottom: normalize(160, 'height') }}
        activeDotStyle={{ backgroundColor: Colors.yellowToneColor, marginBottom: normalize(160, 'height') }}
        renderItem={(data) => {
          return (
            <ImageBackground style={styles.img} source={data.item} resizeMode='stretch'>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={Images.logo} />
              </View>
              <Text style={styles.labelTxt}>Welcome!</Text>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home', {screen: 'BusinessList'})}>
                <Text style={styles.btnTxt}>CONTINUE</Text>
              </TouchableOpacity>
            </ImageBackground>
          )
        }}
      />
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
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: Colors.blackColor,
    width: '100%',
    height: '100%',
    opacity: 0.6
  },
  img: {
    width: '100%',
    height: '100%'
  },
  logoContainer: {
    width: '100%',
    height: '60%',    
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
  labelTxt: {
    fontSize: RFPercentage(2.4),
    fontWeight: "800",
    color: Colors.whiteColor,
    alignSelf: 'center'
  },
  btn: {
    width: '80%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(150, 'height'),
    borderRadius: normalize(8)
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },
});