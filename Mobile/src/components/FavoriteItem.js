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

export default function FavoriteItem({ item, onPressItem, onPressBookmark }) {
  return (
    <View style={styles.container}>
      {
        onPressItem &&
        <TouchableOpacity onPress={() => onPressItem(item)}>
          <View style={styles.topLine}>
            <Image style={styles.img} source={item.icon ? { uri: item.icon } : item.img ? { uri: item.img } : Images.logo} />
            <Text style={styles.title}>{item.name}</Text>
            <EntypoIcon name="bookmark" style={styles.icon}></EntypoIcon>
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.desc} numberOfLines={2} ellipsizeMode='tail'>{item.desc ? item.desc : item.about}</Text>
          </View>
        </TouchableOpacity>
      }
      {
        onPressBookmark &&
        <>
          <View style={styles.topLine}>
            <Image style={styles.img} source={item.icon ? { uri: item.icon } : item.img ? { uri: item.img } : Images.logo} />
            <Text style={styles.title}>{item.name}</Text>

            <TouchableOpacity onPress={() => onPressBookmark(item)}>
              <EntypoIcon name="bookmark" style={styles.icon}></EntypoIcon>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.desc} numberOfLines={2} ellipsizeMode='tail'>{item.desc ? item.desc : item.about}</Text>
          </View>
        </>
      }

    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: normalize(100, 'height'),
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginBottom: normalize(15, 'height'),
    borderRadius: normalize(10),
    padding: normalize(15),
  },
  topLine: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(25),
  },
  title: {
    width: '80%',
    fontSize: RFPercentage(2.7),
    fontWeight: '600',
    color: Colors.blueTitleColor,
    marginLeft: normalize(10)
  },
  icon: {
    fontSize: RFPercentage(3.5),
    color: Colors.yellowToneColor,
    transform: [{ scaleX: 1.5 }]
  },
  bottomLine: {
    width: '100%',
    height: '50%',
    paddingTop: normalize(5),
  },
  desc: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
  },
});