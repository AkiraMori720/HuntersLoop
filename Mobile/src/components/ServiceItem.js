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
  ImageEditor
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
EntypoIcon.loadFont();
FontAwesomeIcon.loadFont();

import StarRating from 'react-native-star-rating';

import { Colors, Images, Constants } from '@constants';
import { setData } from '../service/firebase';

export default function ServiceItem({ item, onPress, onRefresh, showAlert }) {
  onBookmarkServiceItem = async (item, action) => {
    if (!Constants.user) {
      showAlert();
      return;
    }

    if (action === 'delete') {
      var index = Constants.user?.favorsids.findIndex(each => each == item.id);
      if (index != -1) Constants.user?.favorsids.splice(index, 1);
    }

    if (action === 'add') {
      if (Constants.user?.favorsids.findIndex(each => each == item.id) == -1) {
        Constants.user?.favorsids.push(item.id);
      }
    }

    var favorites = [];
    Constants.user?.favorsids.forEach(each => {
      var sItem = Constants.services.find(e => e.id == each);
      if (sItem) favorites.push(sItem);
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

  getReviewLength = (item) => {
    var reviews = Constants.reviews.filter(each => each.sid == item.id);
    return reviews.length;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.topLine}>
          <View style={styles.titleAndAddressPart}>
            <Text style={styles.titleTxt} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
            <View style={styles.addressLine}>
              <EntypoIcon name="location-pin" style={styles.address}></EntypoIcon>
              <Text style={styles.address} numberOfLines={1} ellipsizeMode='tail'>{item.address}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onBookmarkServiceItem(item, Constants.user?.favorsids?.includes(item.id) ? 'delete' : 'add')}>
            <EntypoIcon name="bookmark" style={[styles.iconBookmark, Constants.user?.favorsids?.includes(item.id) ? { color: Colors.yellowToneColor } : { color: Colors.greyColor }]}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.imgLine}>
          <Image style={styles.img} source={item.img ? { uri: item.img } : Images.noImg} resizeMode='cover' />
        </View>
        <View style={styles.priceLine}>
          {
            item.isContactPrice ?
              <Text style={styles.daysHuntersTxt} numberOfLines={2}>Contact guide for package price</Text>
              :
              <Text style={styles.priceTxt}>
                {
                  item.price ? `$${item.price}` : ''
                }
              </Text>
          }
          <Text style={styles.daysHuntersTxt}>{item.days} {item.days < 2 ? 'Day' : 'Days'}, {item.hunters} {item.hunters < 2 ? 'Hunter' : 'Hunters'}</Text>
        </View>
        <View style={styles.descLine}>
          <Text style={styles.descTxt} numberOfLines={2} ellipsizeMode='tail'>{item.about}</Text>
        </View>
        <View style={styles.seasonLine}>
          <Text style={styles.seasonTxtLabel}>Hunting Season:</Text>
          <Text style={styles.seasonTxt}>{item.season.from} to {item.season.to}</Text>
        </View>
        <View style={styles.reviewLine}>
          <View style={styles.reviewPart}>
            <EntypoIcon name="message" style={styles.reviewIcon}></EntypoIcon>
            <Text style={styles.reviewTxt}>{getReviewLength(item)} {getReviewLength(item) < 2 ? 'review' : 'reviews'}</Text>
          </View>
          <View style={styles.ratingPart}>
            <StarRating
              starSize={15}
              fullStarColor={Colors.yellowToneColor}
              disabled={true}
              maxStars={5}
              rating={item.rating}
              selectedStar={(rating) => { }}
            />
            <Text style={styles.reviewTxt}>{item.rating?.toFixed(1)}</Text>
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
    height: normalize(360, 'height'),
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginBottom: normalize(15, 'height'),
    borderRadius: normalize(10)
  },

  topLine: {
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAndAddressPart: {
    width: '88%',
    height: '100%',
    justifyContent: 'center',
    marginLeft: normalize(10),
  },
  titleTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blueTitleColor
  },
  addressLine: {
    flexDirection: 'row'
  },
  address: {
    fontSize: RFPercentage(2),
    color: Colors.greyColor
  },

  iconBookmark: {
    fontSize: RFPercentage(3.5),
    transform: [{ scaleX: 1.5 }]
  },

  imgLine: {
    width: width * 0.93,
    height: normalize(width * 0.93 / 2.4, 'height'),
    // height: '45%',
    // borderWidth: 2
  },
  img: {
    width: '100%',
    height: '100%'
  },

  priceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(10),
    // borderWidth: 2
  },
  priceTxt: {
    fontSize: RFPercentage(3),
    color: Colors.greenPriceColor
  },
  daysHuntersTxt: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    color: Colors.blackColor,
    maxWidth: normalize(200, 'width'),
  },

  descLine: {
    height: '10%',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    // borderWidth: 2
  },
  descTxt: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor
  },

  seasonLine: {
    // height: '10%',    
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingBottom: normalize(10, 'height'),
    borderColor: Colors.greyWeakColor,
    borderBottomWidth: 2
  },
  seasonTxtLabel: {
    fontSize: RFPercentage(2),
    fontWeight: "600",
    color: Colors.blackColor
  },
  seasonTxt: {
    fontSize: RFPercentage(2),
    fontStyle: 'italic',
    color: Colors.blackColor
  },

  reviewLine: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  reviewPart: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingPart: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewIcon: {
    fontSize: RFPercentage(2.2),
    color: Colors.greyColor
  },
  reviewTxt: {
    fontSize: RFPercentage(2),
    color: Colors.greyColor,
    marginLeft: normalize(7)
  },
});