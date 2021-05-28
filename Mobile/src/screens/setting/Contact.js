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
  Alert,
  KeyboardAvoidingView,
  Linking
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();


import { Colors, Images } from '@constants';

export default function ContactScreen({ navigation }) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [subject, setSubject] = useState();
  const [message, setMessage] = useState();

  function validateEmail () {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  }

  handleEmail = () => {
    if(!name){
      Alert.alert('Please enter name.');
      return;
    }
    if(!email){
      Alert.alert('Please enter email.');
      return;
    }
    if (!validateEmail()) {
      Alert.alert('Please enter valid email.');
      return;
    }
    if(!subject){
      Alert.alert('Please enter subject.');
      return;
    }
    if(!message){
      Alert.alert('Please enter message.');
      return;
    }
    
    Linking.openURL(`mailto:support@example.com?subject=${subject}&body=${message}&name=${name}&email=${email}`)    
    .catch(err=>{
      console.log('email error:', err)
    })
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Contact Us</Text>
        </View>
      </View>

      <ScrollView style={styles.body}>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={'Name'}
          placeholderTextColor={Colors.greyColor}
          value={name}
          onChangeText={(text) => setName(text)}
        >
        </TextInput>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={'Email Address'}
          placeholderTextColor={Colors.greyColor}
          value={email}
          onChangeText={(text) => setEmail(text)}
        >
        </TextInput>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={'Subject/Concern'}
          placeholderTextColor={Colors.greyColor}
          value={subject}
          onChangeText={(text) => setSubject(text)}
        >
        </TextInput>
        <TextInput
          style={[styles.inputBox, { height: normalize(200, 'height'), textAlignVertical: 'top' }]}
          autoCapitalize='none'
          multiline={true}
          placeholder={'Message'}
          placeholderTextColor={Colors.greyColor}
          value={message}
          onChangeText={(text) => setMessage(text)}
        >
        </TextInput>

        <TouchableOpacity style={styles.btn} onPress={() => handleEmail()}>
          <Text style={styles.btnTxt}>SEND</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.whiteColor
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

  body: {
    width: '90%',
    alignSelf: 'center'
  },
  inputBox: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.5),
    borderRadius: normalize(8),
    marginTop: normalize(10, 'height'),
    paddingLeft: normalize(10),
  },

  btn: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
    marginTop: normalize(140, 'height')
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },
});