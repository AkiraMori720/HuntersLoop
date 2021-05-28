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
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useIsFocused } from '@react-navigation/native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import { Colors, Images, Constants } from '@constants';
import FavoriteItem from '../../components/FavoriteItem';
import { getUser, getData } from '../../service/firebase';

export default function ProfileScreen({ navigation }) {

  const [profile, setProfile] = useState(Constants.user);
  const [refresh, setRefresh] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    if (Constants.user?.id) {
      updateLocalUser();
      getFavorites();
    }
  }, []);

  if (useIsFocused() && Constants.refreshFlag) {
    Constants.refreshFlag = false;
    updateLocalUser();
    getFavorites();
  }

  updateLocalUser = async () => {
    await getUser(Constants.user?.id)
      .then((user) => {
        if (user) {
          Constants.user = user;
          AsyncStorage.setItem('user', JSON.stringify(user));
          setProfile(user);
        }
      })
  }

  getFavorites = () => {
    var favorites = [];
    Constants.user?.favorbids.forEach(each => {
      var item = Constants.business.find(e => e.id == each);
      if (item) {
        if (favorites.findIndex(each => each.id == item.id) == -1) favorites.push(item);
      }
    })
    Constants.user?.favorsids.forEach(each => {
      var item = Constants.services.find(e => e.id == each);
      if (item) {
        if (favorites.findIndex(each => each.id == item.id) == -1) favorites.push(item);
      }
    })
    Constants.favorites = favorites;
    setRefresh(!refresh);
  }

  onPressItem = (item) => {
    if (item.bid) {//service
      navigation.navigate('Home', { screen: 'ServiceDetail', params: { serviceItem: item } })
    }
    else {//business
      Constants.backRoute = 'Profile';
      navigation.navigate('Home', { screen: 'ServiceList', params: { businessItem: item } })
    }
  }

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.header}>
        <View style={styles.iconHomeContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}>
            <EntypoIcon name="home" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>User Profile</Text>
        </View>
        <View style={styles.iconEditContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
            <EntypoIcon name="new-message" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.topContainer}>
        <Image style={styles.img} source={profile.img ? { uri: profile.img } : Images.profileImg} />
        <Text style={styles.name}>{profile.name ? profile.name : 'No name'}</Text>
        <View style={styles.addressLine}>
          <EntypoIcon name="location-pin" style={styles.headerIcon}></EntypoIcon>
          <Text style={styles.address}>{profile.address ? profile.address : 'No address'}</Text>
        </View>
      </View>

      <View style={styles.favoritesHeader}>
        <Text style={styles.favoritesHeaderTxt}>My Favorites</Text>
      </View>

      <ScrollView style={styles.favoritesBody}>
        {
          Constants.favorites && Constants.favorites.map((each, index) =>
            <FavoriteItem key={index} item={each} onPressItem={onPressItem} />
          )
        }
        {
          Constants.favorites.length == 0 &&
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTxt}>No Favorites</Text>
          </View>
        }
      </ScrollView>
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.greyWeakColor
  },
  header: {
    width: '100%',
    height: normalize(70, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.blackColor
  },
  iconHomeContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconEditContainer: {
    width: '20%',
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

  topContainer: {
    width: '100%',
    height: '40%',
    backgroundColor: Colors.greyStrongColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: normalize(150),
    height: normalize(150),
    borderRadius: normalize(75),
    borderWidth: normalize(2),
    borderColor: Colors.greyWeakColor
  },
  name: {
    fontSize: RFPercentage(3.5),
    fontWeight: '600',
    color: Colors.whiteColor,
    marginTop: normalize(20, 'height'),
  },
  addressLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(10, 'height'),
  },
  address: {
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
    marginLeft: normalize(10)
  },

  favoritesHeader: {
    width: '100%',
    height: '8%',
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoritesHeaderTxt: {
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.blackColor
  },
  favoritesBody: {
    width: '100%',
    maxHeight: normalize(250, 'height'),
    marginTop: normalize(15, 'height')
  },

  emptyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(80, 'height')
  },
  emptyTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.blackColor
  },
});