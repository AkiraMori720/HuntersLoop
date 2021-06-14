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

import AsyncStorage from '@react-native-community/async-storage';
import RateModal from 'react-native-store-rating';

import { Colors, Images, Constants } from '@constants';
import { setData, signOut } from '../../service/firebase';

export default function SettingListScreen({ navigation }) {
  const [notifications, setNotifications] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [refresh, setRefresh] = useState(false);

  function toggleModal() {
    setRateModal(!rateModal);
  }

  function onRateNow() {
    //to do    
    toggleModal();
  }

  function onSignout() {
    Alert.alert(
      'Are you sure want to log out?',
      '',
      [
        {
          text: "OK", onPress: () => {
            signOut();
            AsyncStorage.removeItem('user');
            navigation.navigate('Auth');
          }
        },
        { text: "CANCEL", onPress: () => { } }
      ],
    );
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

  function switchAccount(role) {
    if (role == 'business' && !Constants.user.bid) {
      return Alert.alert('Switch account Error', "You didn't create business account.")
    }

    Alert.alert(
      'Are you sure want to switch to ' + role + ' account?',
      '',
      [
        {
          text: "OK", onPress: async () => {
            const user = Constants.user;
            user.role = role;
            await setData('users', 'update', user)
            .then(() => {
              Constants.user = user;
              setRefresh(!refresh);
            })
            .catch((err) => {
              console.log('update error:', err);
            })
          }
        },
        { text: "CANCEL", onPress: () => { } }
      ],
    );
  }

  useEffect(() => {
    
  });

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Settings</Text>
        </View>
      </View>

      {/* <View style={styles.itemLine}>
        <View style={styles.iconPart}><EntypoIcon name="bell" style={styles.iconLabel}></EntypoIcon></View>
        <TouchableOpacity style={styles.titlePart}><Text style={styles.itemTxt}>Notifications</Text></TouchableOpacity>
        <View style={styles.iconPart}>
          <ToggleSwitch
            isOn={notifications}
            onColor={Colors.yellowToneColor}
            offColor={Colors.greyWeakColor}
            size="medium"
            onToggle={isOn => setNotifications(isOn)}
          />
        </View>
      </View> */}

      <View style={styles.itemLine}>
        <View style={styles.iconPart}><EntypoIcon name="star" style={styles.iconLabel}></EntypoIcon></View>
        <TouchableOpacity style={styles.titlePart} onPress={() => {
          if (Constants.user) {
            toggleModal()
          }
          else {
            showAlert();
          }
        }}><Text style={styles.itemTxt}>Rate App</Text></TouchableOpacity>
        <View style={styles.iconPart}></View>
      </View>

      <View style={styles.itemLine}>
        <View style={styles.iconPart}><EntypoIcon name="clock" style={styles.iconLabel}></EntypoIcon></View>
        <TouchableOpacity style={styles.titlePart} onPress={() => navigation.navigate('Contact')}><Text style={styles.itemTxt}>Contact Us</Text></TouchableOpacity>
        <View style={styles.iconPart}><EntypoIcon name="chevron-thin-right" style={styles.itemTxt}></EntypoIcon></View>
      </View>

      <View style={styles.itemLine}>
        <View style={styles.iconPart}><EntypoIcon name="clipboard" style={styles.iconLabel}></EntypoIcon></View>
        <TouchableOpacity style={styles.titlePart} onPress={() => navigation.navigate('About')}><Text style={styles.itemTxt}>About App</Text></TouchableOpacity>
        <View style={styles.iconPart}><EntypoIcon name="chevron-thin-right" style={styles.itemTxt}></EntypoIcon></View>
      </View>

      <View style={styles.itemLine}>
        <View style={styles.iconPart}><EntypoIcon name="lock" style={styles.iconLabel}></EntypoIcon></View>
        <TouchableOpacity style={styles.titlePart} onPress={() => navigation.navigate('Policy')}><Text style={styles.itemTxt}>Privacy Policy</Text></TouchableOpacity>
        <View style={styles.iconPart}><EntypoIcon name="chevron-thin-right" style={styles.itemTxt}></EntypoIcon></View>
      </View>

      <View style={styles.itemLine}>
        <View style={styles.iconPart}><EntypoIcon name="news" style={styles.iconLabel}></EntypoIcon></View>
        <TouchableOpacity style={styles.titlePart} onPress={() => navigation.navigate('Terms')}><Text style={styles.itemTxt}>Terms and Conditions</Text></TouchableOpacity>
        <View style={styles.iconPart}><EntypoIcon name="chevron-thin-right" style={styles.itemTxt}></EntypoIcon></View>
      </View>

      {
        (Constants.user && Constants.user.role != "business") && Constants.user.bid &&
        <View style={styles.itemLine}>
          <View style={styles.iconPart}><EntypoIcon name="users" style={styles.iconLabel}></EntypoIcon></View>
          <TouchableOpacity style={styles.titlePart} onPress={() => { switchAccount('business') }}><Text style={styles.itemTxt}>Switch to Business Account</Text></TouchableOpacity>
          {/* <View style={styles.iconPart}><EntypoIcon name="chevron-thin-right" style={styles.itemTxt}></EntypoIcon></View> */}
        </View>
      }
      {
        (Constants.user && Constants.user.role != "user") &&
        <View style={styles.itemLine}>
          <View style={styles.iconPart}><EntypoIcon name="users" style={styles.iconLabel}></EntypoIcon></View>
          <TouchableOpacity style={styles.titlePart} onPress={() => { switchAccount('user') }}><Text style={styles.itemTxt}>Switch to User Account</Text></TouchableOpacity>
          {/* <View style={styles.iconPart}><EntypoIcon name="chevron-thin-right" style={styles.itemTxt}></EntypoIcon></View> */}
        </View>
      }

      {
        Constants.user && Constants.user.role != "business" &&
        <View style={styles.itemLine}>
          <View style={styles.iconPart}><EntypoIcon name="suitcase" style={styles.iconLabel}></EntypoIcon></View>
          <TouchableOpacity style={styles.titlePart} onPress={() => { Constants.refreshFlag = true; navigation.navigate('Request') }}><Text style={styles.itemTxt}>{Constants.user?.bid?'Update a Business Account':'Create a Business Account'}</Text></TouchableOpacity>
          <View style={styles.iconPart}><EntypoIcon name="chevron-thin-right" style={styles.itemTxt}></EntypoIcon></View>
        </View>
      }

      {
        Constants.user &&
        <TouchableOpacity style={styles.logoutPart} onPress={() => onSignout()}>
          <EntypoIcon name="log-out" style={styles.iconLogout}></EntypoIcon>
          <Text style={styles.itemTxt}>Log Out</Text>
        </TouchableOpacity>
      }

      <RateModal
        modalTitle="If you love our app, we would appreciate if you take a couple of seconds to rate us in the app market!"
        rateBtnText={'RATE NOW'}
        cancelBtnText={'LATER'}
        totalStarCount={5}
        defaultStars={5}
        isVisible={true}
        sendBtnText={'Send'}
        commentPlaceholderText={'Write text'}
        emptyCommentErrorMessage={'Empty Rate'}
        playStoreUrl={'https://play.google.com/store/apps/details?id=com.brainyapps.hunters'}
        iTunesStoreUrl={'https://apps.apple.com/us/app/hunter-loop/id1536214645'}
        isModalOpen={rateModal}
        storeRedirectThreshold={3}
        style={{
          paddingHorizontal: 30,
          alignItems: 'center'
        }}
        onStarSelected={(e) => {
          console.log('change rating', e);
        }}
        onClosed={() => {
          console.log('pressed cancel button...')
          setRateModal(false)
        }}
        sendContactUsForm={(state) => {
          // alert(JSON.stringify(state));
          setRateModal(false)
          console.log(state)
        }}
        styles={{
          button: {
            backgroundColr: 'transparent',
            borderColor: 'transparent',
            textTransform: 'uppercase'
          },
          buttons:{
            alignSelf: 'center'
          }
        }}
        ratingProps={{
          selectedColor: 'red',
        }}
      // modalProps={{
      //   animationType: 'fade',
      // }}
      />
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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

  itemLine: {
    width: '90%',
    height: normalize(50, 'height'),
    flexDirection: 'row',
    alignSelf: 'center',
    borderColor: Colors.greyWeakColor,
    borderBottomWidth: normalize(3)
  },
  iconPart: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titlePart: {
    width: '80%',
    justifyContent: 'center',
    paddingLeft: normalize(10)
  },
  iconLabel: {
    fontSize: RFPercentage(3),
    color: Colors.yellowToneColor,
  },
  itemTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
  },

  logoutPart: {
    width: '80%',
    position: 'absolute',
    flexDirection: 'row',
    left: normalize(30),
    bottom: normalize(20, 'height'),
    alignItems: 'center',
    alignSelf: 'center'
  },
  iconLogout: {
    width: '10%',
    fontSize: RFPercentage(2.5),
    color: Colors.logoutColor,
  },

  modalBody: {
    width: '100%',
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    padding: normalize(20)
  },
  rateLabel: {
    fontSize: RFPercentage(3),
    color: Colors.blackColor,
  },
  rateTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
    lineHeight: 24,
    marginTop: normalize(20, 'height')
  },
  starRatingPart: {
    width: '60%',
    alignSelf: 'center',
    marginTop: normalize(20, 'height')
  },

  btnLine: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
});

/////////////////// reference //////////////
var user = {
  id: '',
  name: '',
  address: '',
  img: '',
  active: true, // related with ban/lift ban
  role: '', //user, business, admin
  email: '', //not used
  pwd: '', //not used
  favorbids: [],
  favorsids: [],
  createdAt: '', //not used
}

var businessItem = {
  id: '',
  name: '',
  icon: '',
  img: '',
  address: '',
  email: '',
  phone: '',
  site: '',
  desc: '',
  rating: '',
  location: {
    latitude: '',
    longitude: ''
  },
  operatingHours: {
    from: '',
    to: ''
  },
  slideImgs: [],
  active: '', //related with ban/lift ban
  status: '', // 'ready', 'approved'  related with approve
  mid: '', //membership id
  requestDate: ''
}

var serviceItem = {
  id: '',
  name: '',
  img: '',
  bid: '', //business id
  cid: '', //category id
  address: '',
  about: '',
  guide: '',
  days: '',
  hunters: '',
  price: '',
  isContactPrice: false,
  rating: '',
  season: {
    from: '',
    to: ''
  },
  detailImgs: [],
  hunterImg: '',
  hunterDesc: '',
  terms: '',
  active: ''
}

var reviewItem = {
  id: '',
  uid: '', // user that reports
  ///////////
  bid: '', // business to be reported
  bDesc: '',
  bRating: '',
  // or //////
  sid: '', // service to be reported
  sDesc: '',
  sRating: '',
  /////////
  type: '', //business or service
  status: '' // 'ready', 'accepted', 'reported'
}

var reportItem = {
  id: '',
  uid: '', //business user id
  rid: []  //review id for report
}
