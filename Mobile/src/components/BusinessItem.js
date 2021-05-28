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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
EntypoIcon.loadFont();
FontAwesomeIcon.loadFont();

import StarRating from 'react-native-star-rating';

import { getDistance, getPreciseDistance } from 'geolib';

import { Colors, Images, Constants } from '@constants';
import { setData } from '../service/firebase';

export default function BusinessItem({ item, onPress, onRefresh, showAlert }) {
  const onBookmarkBusinessItem = async (item, action) => {
    if (!Constants.user) {
      showAlert();
      return;
    }
    if (action === 'delete') {
      var index = Constants.user.favorbids.findIndex(each => each == item.id);
      if (index != -1) Constants.user.favorbids.splice(index, 1);
    }

    if (action === 'add') {
      if (Constants.user.favorbids.findIndex(each => each == item.id) == -1) {
        Constants.user.favorbids.push(item.id);
      }
    }

    var favorites = [];
    Constants.user.favorbids.forEach(each => {
      var bItem = Constants.business.find(e => e.id == each);
      if (bItem) favorites.push(bItem);
    })

    Constants.favorites = favorites;

    await setData('users', 'update', Constants.user)
      .then(() => {
        onRefresh();
      })
      .catch((err) => {
        console.log('bookmark setting error:', err);
      })
  }

  const getCategoriesTxt = () => {
    var txt = '';
    var selfServices = [];
    Constants.services.forEach(each => {
      if (each.bid == item.id) {
        selfServices.push(each);
      }
    })
    selfServices.forEach((each, index) => {
      var category = Constants.categories.find(e => e.id == each.cid);
      if (category) {
        if (index < selfServices.length - 1) txt += category.name.toUpperCase() + ', ';
        else txt += category.name.toUpperCase()
      }
    })
    return txt;
  }

  const getServiceLength = () => {
    var selfServices = [];
    Constants.services.forEach(each => {
      if (each.bid == item.id) {
        selfServices.push(each);
      }
    });
    return selfServices.length;
  }

  const getDistanceMile = (item) => {
    let myLocation = (Constants.location.latitude && Constants.location.latitude) ? Constants.location : Constants.user?.location;

    if ((!myLocation?.latitude || !myLocation?.longitude) ||
      (!item.location?.latitude || !item.location?.longitude)) {
      return 0;
    }
    else {
      if (!myLocation) return 0;
      var distance = getDistance(myLocation, item.location);
      var distanceMile = distance / 1000 / 1.6;
      return distanceMile.toFixed(2);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => { onPress(item) }}>
        <View style={styles.topPart}>
          <Image style={styles.titleImg} source={item.icon ? { uri: item.icon } : Images.logo} />
          <View style={styles.topRight}>
            <View style={styles.titleLine}>
              <Text style={styles.titleTxt} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
              <View style={styles.ratingAndBookmark}>
                <StarRating
                  starSize={15}
                  fullStarColor={Colors.yellowToneColor}
                  disabled={true}
                  maxStars={5}
                  rating={item.rating}
                  selectedStar={(rating) => { }}
                />
                <Text style={styles.ratingTxt}>{item.rating?.toFixed(1)}</Text>
                <TouchableOpacity onPress={() => onBookmarkBusinessItem(item, Constants.user?.favorbids?.includes(item.id) ? 'delete' : 'add')}>
                  <EntypoIcon name="bookmark" style={[styles.iconBookmark, Constants.user?.favorbids?.includes(item.id) ? { color: Colors.yellowToneColor } : { color: Colors.greyColor }]}></EntypoIcon>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.addressLine}>
              <EntypoIcon name="location-pin" style={styles.address}></EntypoIcon>
              <Text style={styles.address} numberOfLines={1} ellipsizeMode='tail'>{item.address}</Text>
            </View>
          </View>
        </View>
        <View style={styles.imgPart}>
          <Image style={styles.img} source={item.img ? { uri: item.img } : Images.noImg} resizeMode='cover' />
        </View>
        <View style={styles.bottomPart}>
          <Text style={styles.descTxt} numberOfLines={1} ellipsizeMode='tail'>{item.desc}</Text>
        </View>
        <View style={styles.footerPart}>
          <View style={styles.footerTopLine}>
            <EntypoIcon name="renren" style={styles.iconCategory}></EntypoIcon>
            <Text style={styles.footerTxt} numberOfLines={1} ellipsizeMode='tail'>{getCategoriesTxt()}</Text>
          </View>
          <View style={styles.footerBottomLine}>
            <EntypoIcon name="trophy" style={styles.iconCategory}></EntypoIcon>
            <Text style={styles.footerTxt}>{getServiceLength()} {getServiceLength() < 2 ? 'Hunt' : 'Hunts'}</Text>
            <Text style={styles.footerDistance}>{getDistanceMile(item)} mi</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '93%',
    height: normalize(300, 'height'),
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginBottom: normalize(15, 'height'),
    borderRadius: normalize(10)
  },

  topPart: {
    width: '100%',
    // height: '18%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: normalize(15),
    paddingRight: normalize(15),
    paddingTop: normalize(10, 'height'),
    paddingBottom: normalize(10, 'height')
  },
  titleImg: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(25)
  },
  topRight: {
    width: '85%',
    height: '100%',
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blueTitleColor,
    marginLeft: normalize(3)
  },
  ratingAndBookmark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingTxt: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    marginLeft: normalize(10),
    marginRight: normalize(10),
  },
  iconBookmark: {
    fontSize: RFPercentage(3.5),
    transform: [{ scaleX: 1.5 }]
  },
  addressLine: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {    
    fontSize: RFPercentage(2),
    color: Colors.greyColor
  },

  imgPart: {
    width: width * 0.93,
    height: normalize(width * 0.93 / 2.4, 'height'),
    // height: '52%',
    // borderWidth: 2
  },
  img: {
    width: '100%',
    height: '100%'
  },

  bottomPart: {
    height: '13%',
    flexDirection: 'row',
    alignItems: 'center',    
    paddingLeft: normalize(15),
    paddingRight: normalize(15),
    // borderWidth: 2
  },
  descTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.greyColor
  },

  footerPart: {
    height: '15%',
    justifyContent: 'center',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    // borderWidth: 2
  },
  footerTopLine: {
    flexDirection: 'row'
  },
  iconCategory: {
    fontSize: RFPercentage(2.5),
    color: Colors.yellowToneColor,
  },
  footerTxt: {
    width: '60%',
    fontSize: RFPercentage(2.2),
    color: Colors.greyColor,
    marginLeft: normalize(7),
  },
  footerBottomLine: {
    flexDirection: 'row'
  },
  footerDistance: {
    width: '30%',
    textAlign: 'right',
    fontSize: RFPercentage(2.2),
    color: Colors.greyColor,
  },

});