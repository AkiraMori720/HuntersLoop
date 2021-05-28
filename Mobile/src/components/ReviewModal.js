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

import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { Colors, Images } from '@constants';

export default function ReviewModal({ toggleModal, confirmReview }) {
  const [ratingValue, setRatingValue] = useState(3);
  const [review, setReview] = useState();

  return (
    <Modal isVisible={true} >
      <View style={styles.modalBody}>
        <Text style={styles.rateLabel}>Rate And Review</Text>
        <View style={styles.starRatingPart}>
          <StarRating
            starSize={30}
            fullStarColor={Colors.yellowToneColor}
            disabled={false}
            maxStars={5}
            rating={ratingValue}
            selectedStar={(rating) => { setRatingValue(rating) }}
          />
          <Text style={styles.rateTxt}>{ratingValue.toFixed(1)}</Text>
        </View>
        <TextInput
          style={[styles.inputBox, { height: normalize(150, 'height'), textAlignVertical: 'top' }]}
          autoCapitalize='none'
          multiline={true}
          placeholder={'Please write your review'}
          placeholderTextColor={Colors.greyColor}
          value={review}
          onChangeText={(text) => setReview(text)}
        >
        </TextInput>
        <View style={styles.btnLine}>
          <TouchableOpacity><Text style={styles.btnTxt} onPress={() => confirmReview(ratingValue, review)}>CONFIRM</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.btnTxt} onPress={() => toggleModal()}>CANCEL</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
    fontSize: RFPercentage(3),
    color: Colors.blackColor,
    lineHeight: 24,
    marginTop: normalize(3, 'height'),    
    marginLeft: normalize(15)
  },
  starRatingPart: {
    width: '60%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: normalize(20, 'height')
  },
  inputBox: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.5),
    borderRadius: normalize(8),
    marginTop: normalize(10, 'height'),
    paddingTop: normalize(10, 'height'),
    paddingLeft: normalize(10),
  },

  btnLine: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  btnTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
    lineHeight: 24,
    marginTop: normalize(20, 'height')
  },
})