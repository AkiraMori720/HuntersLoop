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
  KeyboardAvoidingView
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import { Colors, Images, Constants } from '@constants';
import { signup, createUser, setData, checkInternet } from '../../service/firebase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwdValidObj, setPwdValidObj] = useState({
    sixCharacters: false,
    letter: false,
    number: false,
    specialCharacter: false
  })
  const [spinner, setSpinner] = useState(false);

  validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  }

  onChangeEmail = (text) => {
    setEmail(text);
    if (!text) {
      setEmailValid(false);
      return;
    }

    if (validateEmail()) {
      setEmailValid(true);
    }
    else {
      setEmailValid(false);
    }
  }

  onChangePwd = (text) => {
    setPwd(text);

    var pwdChkObj = {
      sixCharacters: false,
      letter: false,
      number: false,
      specialCharacter: false
    };
    setPwdValidObj(pwdChkObj);

    if (text.length >= 6 && !pwdValidObj.sixCharacters) {
      var pwdChkObj = { ...pwdValidObj, sixCharacters: true };
      setPwdValidObj(pwdChkObj);
      return;
    }
    else if (text.length < 6 && pwdValidObj.sixCharacters) {
      var pwdChkObj = { ...pwdValidObj, sixCharacters: false };
      setPwdValidObj(pwdChkObj);
      return;
    }

    let letterReg = /^[a-zA-Z]+$/;
    let numberReg = /^[0-9]+$/;
    let specialReg = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    let letterNumberReg = /^[a-zA-Z0-9]+$/;
    let letterSpecialReg = /[a-zA-Z !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    let numberSpecialReg = /[0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    let allReg = /[a-zA-z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

    if (letterReg.test(text) && !numberReg.test(text) && !specialReg.test(text) && !numberSpecialReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, letter: true };
      setPwdValidObj(pwdChkObj);
    }
    if (!letterReg.test(text) && numberReg.test(text) && !specialReg.test(text) && !letterSpecialReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, number: true };
      setPwdValidObj(pwdChkObj);
    }
    if (!letterReg.test(text) && !numberReg.test(text) && specialReg.test(text) && !letterNumberReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, specialCharacter: true };
      setPwdValidObj(pwdChkObj);
    }
    if (letterNumberReg.test(text) && !letterReg.test(text) && !numberReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, letter: true, number: true };
      setPwdValidObj(pwdChkObj);
    }
    // if (letterSpecialReg.test(text) && !letterReg.test(text) && !specialReg.test(text)) {
    //   var pwdChkObj = { ...pwdValidObj, letter: true, specialCharacter: true };
    //   setPwdValidObj(pwdChkObj);
    // }
    // if (numberSpecialReg.test(text) && !numberReg.test(text) && !specialReg.test(text)) {
    //   var pwdChkObj = { ...pwdValidObj, number: true, specialCharacter: true };
    //   setPwdValidObj(pwdChkObj);
    // }
    // if (!letterReg.test(text) && !numberReg.test(text) && !specialReg.test(text) && !letterNumberReg.test(text) && !letterSpecialReg.test(text) && !numberSpecialReg.test(text) && allReg.test(text)) {
    //   var pwdChkObj = { ...pwdValidObj, letter: true, number: true, specialCharacter: true };
    //   setPwdValidObj(pwdChkObj);
    // }


  }

  onSignup = async () => {
    if (!email) {
      Alert.alert('Please enter email');
      return;
    }
    if (!emailValid) {
      Alert.alert('Please enter a valid email address');
      return;
    }
    if (!pwd) {
      Alert.alert('Please enter password');
      return;
    }
    // if (!pwdValidObj.sixCharacters || !pwdValidObj.letter || !pwdValidObj.number || !pwdValidObj.specialCharacter) {
    //   Alert.alert('Please endter a valid password');
    //   return;
    // }

    var isConnected = await checkInternet();
    if (!isConnected) {
      Alert.alert('Please check your internet connection.');
      return;
    }

    setSpinner(true);

    await signup(email, pwd)
      .then(async (res) => {
        var user = {
          id: res.user.uid,
          name: '',
          img: '',
          email: email,
          pwd: pwd,
          address: '',
          location: {
            latitude: null,
            longitude: null
          },
          favorbids: [],
          favorsids: [],
          active: true,
          createdAt: moment().format("MM/DD/YYYY"),
          role: 'user'
        }

        await createUser(user)
          .then(() => {
            console.log('create user success');
            Alert.alert(
              'Account created!',
              '',
              [
                {
                  text: "OK", onPress: () => {
                    setSpinner(false);
                    Constants.user = user;
                    AsyncStorage.setItem('user', JSON.stringify(user));
                    navigation.navigate('Welcome');
                  }
                }
              ],
            )
          })
          .catch((err) => {
            console.log('create user error', err);
            setSpinner(false)
          })
      })
      .catch((err) => {
        console.log('signup error', err);
        if (err.code === 'auth/email-already-in-use') {
          Alert.alert(
            'That email address is already in use!',
            '',
            [
              { text: "OK", onPress: () => setSpinner(false) }
            ],
          )
        }
        if (err.code === 'auth/invalid-email') {
          Alert.alert(
            'That email address is invalid!',
            '',
            [
              { text: "OK", onPress: () => setSpinner(false) }
            ],
          );
        }
      })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image style={styles.imgBack} source={Images.authBack} />
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.backIconRow}>
        <TouchableOpacity onPress={() => navigation.goBack(null)}>
          <EntypoIcon name="chevron-thin-left" style={styles.backIcon}></EntypoIcon>
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTxt}>Sign up</Text>
      </View>
      <View style={styles.body}>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={'Email'}
          placeholderTextColor={Colors.greyColor}
          value={email}
          onChangeText={(text) => onChangeEmail(text)}
        >
        </TextInput>
        {
          emailValid &&
          <View style={styles.checkLine}>
            <Image style={{ width: 10, height: 10 }} source={Images.checked} />
            <Text style={styles.checkLbl}>Valid email</Text>
          </View>
        }
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          secureTextEntry={true}
          placeholder={'Password'}
          placeholderTextColor={Colors.greyColor}
          value={pwd}
          onChangeText={(text) => onChangePwd(text)}
        >
        </TextInput>
        {
          pwdValidObj.sixCharacters &&
          <View style={styles.checkLine}>
            <Image style={{ width: 10, height: 10 }} source={Images.checked} />
            <Text style={styles.checkLbl}>At least 6 characters long.</Text>
          </View>
        }
        {
          pwdValidObj.letter &&
          <View style={styles.checkLine}>
            <Image style={{ width: 10, height: 10 }} source={Images.checked} />
            <Text style={styles.checkLbl}>Contains a letter.</Text>
          </View>
        }
        {
          pwdValidObj.number &&
          <View style={styles.checkLine}>
            <Image style={{ width: 10, height: 10 }} source={Images.checked} />
            <Text style={styles.checkLbl}>Contains a number.</Text>
          </View>
        }
        {
          pwdValidObj.specialCharacter &&
          <View style={styles.checkLine}>
            <Image style={{ width: 10, height: 10 }} source={Images.checked} />
            <Text style={styles.checkLbl}>Contains a special character.</Text>
          </View>
        }

        <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.yellowToneColor }]} onPress={() => onSignup()}>
          <Text style={[styles.btnTxt, { color: Colors.blackColor }]}>SIGN UP</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height
  },
  imgBack: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
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
    width: '80%',
    height: '50%',
    // justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(40, 'height'),
    // borderWidth: 2
  },

  btn: {
    width: '100%',
    height: normalize(45, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
    marginTop: normalize(20, 'height')
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.whiteColor
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
  checkLine: {
    width: '90%',
    height: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(10, 'height'),
  },
  checkLbl: {
    fontSize: RFPercentage(1.8),
    color: Colors.greyColor,
    marginLeft: normalize(7)
  },
});