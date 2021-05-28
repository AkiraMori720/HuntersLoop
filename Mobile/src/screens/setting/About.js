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

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { Colors, Images } from '@constants';

export default function AboutScreen({ navigation }) {

  function onContact() {
    navigation.navigate('Contact');
  }

  return (
    <ImageBackground style={styles.container} source={Images.authBack}>
      <View style={styles.backIconRow}>
        <TouchableOpacity onPress={() => navigation.goBack(null)}>
          <EntypoIcon name="chevron-thin-left" style={styles.backIcon}></EntypoIcon>
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTxt}>About the App</Text>
      </View>
      <View style={styles.body}>

        <View style={styles.tipContainer}>
          <Text style={styles.tip}>
            Version 1.00
            {'\n'}
            Copyright 2020 - Hunter.com
            {'\n'}
            James Stroleny Inc.
          </Text>
        </View>

        <View style={styles.descContainer}>
          <ScrollView>
            <Text style={styles.desc}>
              Hunter’s Loop is an advertising hub and directory for hunting and fishing guides. Operators and guides can advertise businesses, set up business profiles and go PRO level to enhance heir features within the app. It also has a messaging function that is used for communication between the User and Establishment.
              To search for businesses, you can search by using keywords, location and type of activities. You may also filter results by proximity, price range, type of activity and others. View species available for hunting and number of hunts or games an establishment is offering, as well as reviews and ratings from past transactions.
              PRO businesses sees what their Public Profile looks like. Create posts, upload photos and videos, post updates and see a timeline of recent activities and posts. Provide information such as business name, profile photo, activity description, portfolio, services offered, amount, etc. Public Profile (search result) PRO results are also featured at the top of the list including corresponding logos or profile photos.
          </Text>
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => onContact()}>
          <Text style={styles.btnTxt}>CONTACT US</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  backIconRow: {
    width: '9%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: normalize(50, 'height'),
    zIndex: 10,
    // marginTop: normalize(50, 'height'),        
  },
  backIcon: {
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
  },
  label: {
    width: '100%',
    height: '43%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelTxt: {
    fontSize: RFPercentage(3),
    color: Colors.whiteColor
  },
  body: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(20, 'height'),
  },

  tipContainer: {
    width: '80%',
    marginTop: normalize(20, 'height'),
  },
  tip: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,
    textAlign: 'center'
  },
  descContainer: {
    width: '100%',
    height: normalize(150, 'height'),
    marginTop: normalize(20, 'height'),
  },
  desc: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,
  },

  btn: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(50, 'height'),
    borderRadius: normalize(8),
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },
});