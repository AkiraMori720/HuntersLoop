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
  Animated
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import ImageView from 'react-native-image-view';
import StarRating from 'react-native-star-rating';
import ReadMore from 'react-native-read-more-text';
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from 'react-native-loading-spinner-overlay';

import { Colors, Images, Constants } from '@constants';
import ReviewModal from '../../components/ReviewModal';
import { setData } from '../../service/firebase';

export default function ServiceDetailScreen({ navigation, route }) {
  const serviceItem = route.params.serviceItem;
  const [page, setPage] = useState('hunt');
  console.log('serviceItem', serviceItem);

  const [reviewModal, setReviewModal] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [reviews, setReviews] = useState([]);

  const SECTIONS = [
    {
      id: 0,
      title: 'Hunting Guidelines',
      content: serviceItem.guide,
    },
    {
      id: 1,
      title: 'Terms and Conditions',
      content: serviceItem.terms,
    },
    {
      id: 2,
      title: 'Reviews',
      content: serviceItem
    },
  ];

  const [detailImgs, setDetailImgs] = useState([]);
  const [detailImgView, setDetailImgView] = useState(false);
  const [detailImgIndex, setDetailImgIndex] = useState(0);

  const [activeSections, setActiveSections] = useState([]);
  const [hunter, setHunter] = useState();

  const makeDetailImgs = () => {
    var imgs = [];
    serviceItem.detailImgs.forEach(each => {
      imgs.push({
        source: {
          uri: each
        },
        title: '',
        width: width,
        height: height * 0.5
      })
    });
    setDetailImgs(imgs);
  }

  const getReviews = () => {
    var reviews = Constants.reviews.filter(each => each.sid == serviceItem.id);
    var nReviews = [];
    reviews.forEach((each) => {
      var user = Constants.users.find(e => e.id == each.uid);
      var item = {
        userImg: user.img,
        userName: user.name,
        rating: each.sRating,
        desc: each.sDesc
      };
      nReviews.push(item);
    })
    setReviews(nReviews);
  }

  const onBack = () => {
    if (page === 'hunt') {
      navigation.goBack(null)
    }
    else {
      setPage('hunt')
    }
  }

  const toggleDetailImgView = (index) => {
    setDetailImgView(!detailImgView);
    setDetailImgIndex(index);
  }

  const toggleReviewModal = () => {
    setReviewModal(!reviewModal)
  }

  const confirmReviewService = (rating, review) => {
    setReviewModal(!reviewModal);
    setSpinner(true);

    //check already, update or add
    var index = Constants.reviews.findIndex(each => each.uid == Constants.user?.id && each.sid == serviceItem.id);
    var reviewItem = Constants.reviews.find(each => each.uid == Constants.user?.id && each.sid == serviceItem.id);
    var action = '';
    var newItem = '';

    if (index == -1) {
      action = 'add';
      newItem = {
        uid: Constants.user?.id,
        sid: serviceItem.id,
        sRating: rating,
        sDesc: review,
        type: 'service',
        status: 'ready'
      }
    }
    else {
      action = 'update';
      newItem = {
        ...reviewItem,
        sRating: rating,
        sDesc: review,
        status: 'ready'
      }
    }

    setData('reviews', action, newItem)
      .then(() => {
        console.log('review success');
        Alert.alert(
          "Sent Successfully!",
          "After acceptance, this review will be published",
          [
            { text: "OK", onPress: () => { setSpinner(false); } }
          ],
        );
      })
      .catch((err) => {
        console.log('review error:', err);
        Alert.alert(
          "Some Error!",
          "",
          [
            { text: "OK", onPress: () => { setSpinner(false); } }
          ],
        );
      })
  }

  const getReviewLength = (serviceItem) => {
    var reviews = Constants.reviews.filter(each => each.sid == serviceItem.id);
    return reviews.length;
  }

  const getHunter = () => {
    var business = Constants.business.find(each => each.id == serviceItem.bid);
    var user = Constants.users.find(each => each.bid == business.id);
    if (user) setHunter(user);
  }


  useEffect(() => {
    makeDetailImgs();
    getReviews();
    getHunter();
  }, []);


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

  const renderCollapseHeader = (section) => {
    var isActive = activeSections.includes(section.id);
    return (
      <View style={styles.collapseHeader}>
        <Text style={styles.labelTxt}>{section.title}</Text>
        {
          isActive ?
            <EntypoIcon name="chevron-thin-down" style={styles.arrowIcon}></EntypoIcon>
            :
            <EntypoIcon name="chevron-thin-right" style={styles.arrowIcon}></EntypoIcon>
        }
      </View>
    )
  }

  const renderCollapseContent = (section) => {
    return (
      <View style={styles.collapseContent}>
        {
          (section.id == 0 || section.id == 1) &&
          <Text style={styles.valueTxt}>{section.content}</Text>
        }
        {
          section.id == 2 &&
          <>
            {
              reviews.map((each, index) => (
                <View key={index}>
                  <View style={styles.topLine}>
                    <Image style={styles.reviewerImg} source={each.userImg ? { uri: each.userImg } : Images.profileImg} />
                    <View style={styles.nameAndRatingPart}>
                      <Text style={styles.reviewerName}>{each.userName}</Text>
                      <View style={styles.ratingPart}>
                        <StarRating
                          starSize={15}
                          fullStarColor={Colors.yellowToneColor}
                          disabled={true}
                          maxStars={5}
                          rating={each.rating}
                          selectedStar={(rating) => { }}
                        />
                        <Text style={styles.reviewTxt}>{each.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewDescTxt}>{each.desc}</Text>
                </View>
              ))
            }
          </>
        }
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.header}>
        <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => onBack()}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt} numberOfLines={1} ellipsizeMode='tail'>{serviceItem.name}</Text>
        </View>
        { serviceItem.mode != 'view' && <View style={styles.iconReviewContainer}>
          <TouchableOpacity onPress={() => {
            if (Constants.user) {
              setReviewModal(!reviewModal)
            }
            else {
              showAlert();
            }
          }}>
            <EntypoIcon name="flag" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>}
      </View>

      <View style={styles.topImgContainer}>
        <Image style={styles.topImg} source={serviceItem.img ? { uri: serviceItem.img } : Images.noImg} resizeMode='cover' />
      </View>

      <ScrollView style={styles.detailImgContainer} horizontal={true} >
        {
          detailImgs.map((each, index) =>
            <TouchableOpacity key={index} onPress={() => toggleDetailImgView(index)} style={styles.detailImg}>
              <Image style={{ width: '100%', height: '100%', resizeMode:'cover' }} source={{ uri: each.source.uri }} />
            </TouchableOpacity>
          )
        }
      </ScrollView>
      <View>
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: width,
            height: height
          }}
        >
          <ImageView
            images={detailImgs}
            imageIndex={detailImgIndex}
            isVisible={detailImgView}
            onClose={toggleDetailImgView}
          />
        </Animated.View>
      </View>

      <View style={styles.titlePriceLine}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{serviceItem.name}</Text>
        <Text style={styles.price}>
          {
            serviceItem.price ? `$${serviceItem.price}` : ''
          }
        </Text>
      </View>

      <Text style={styles.itemTitle}>{Constants.business.find(each => each.id == serviceItem.bid).name}</Text>

      <View style={styles.reviewLine}>
        <View style={styles.ratingPart}>
          <StarRating
            starSize={15}
            fullStarColor={Colors.yellowToneColor}
            disabled={true}
            maxStars={5}
            rating={serviceItem.rating}
            selectedStar={(rating) => { }}
          />
          <Text style={styles.reviewTxt}>{serviceItem.rating?.toFixed(1)}</Text>
        </View>
        <View style={styles.reviewPart}>
          <EntypoIcon name="message" style={styles.reviewIcon}></EntypoIcon>
          <Text style={styles.reviewTxt}>{getReviewLength(serviceItem)} {getReviewLength(serviceItem) < 2 ? 'review' : 'reviews'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollBody}>
        {
          page === 'hunt' &&
          <>
            <View style={styles.aboutPart}>
              <Text style={styles.labelTxt}>About the Hunt:</Text>
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={(handlePress) => (
                  <Text style={{ color: Colors.readMoreLessColor, marginTop: 5, marginRight: 5, textAlign: 'right', textDecorationLine: 'underline', fontStyle: 'italic' }} onPress={handlePress}>
                    Read more
                  </Text>
                )}
                renderRevealedFooter={(handlePress) => (
                  <Text style={{ color: Colors.readMoreLessColor, marginTop: 5, marginRight: 5, textAlign: 'right', textDecorationLine: 'underline', fontStyle: 'italic' }} onPress={handlePress}>
                    Show less
                  </Text>
                )}
              >
                <Text style={styles.valueTxt}>{serviceItem.about}</Text>
              </ReadMore>
            </View>
            <View style={styles.accordionPart}>
              <Accordion
                sections={SECTIONS}
                activeSections={activeSections}
                renderHeader={renderCollapseHeader}
                renderContent={renderCollapseContent}
                onChange={(activeSections) => setActiveSections(activeSections)}
              />
            </View>
            {
              (serviceItem.mode !== 'view') &&
              <TouchableOpacity style={styles.btn} onPress={() => setPage('hunter')}>
                <Text style={styles.btnTxt}>CONTACT GUIDE</Text>
              </TouchableOpacity>
            }
          </>
        }
        {
          page === 'hunter' &&
          <>
            <View style={styles.collapseHeader}>
              <Text style={styles.labelTxt}>Hunter Guide</Text>
            </View>
            <View style={[styles.collapseContent, { alignItems: 'center' }]}>
              <Image style={styles.hunterImg} source={hunter?.img ? { uri: hunter.img } : Images.profileImg} />
              <Text style={styles.labelTxt}>{hunter?.name ? hunter.name : ''}</Text>
            </View>
            <Text style={styles.hunterDesc}>{serviceItem.hunterDesc}</Text>
            {
              hunter &&
              <TouchableOpacity style={styles.btn} onPress={() => {
                if (Constants.user) {
                  navigation.navigate('Message', { screen: 'Chat', params: { chateeId: hunter?.id } })
                }
                else {
                  showAlert();
                }
              }}>
                <Text style={styles.btnTxt}>SEND MESSAGE</Text>
              </TouchableOpacity>
            }
          </>
        }
      </ScrollView>

      {
        reviewModal &&
        <ReviewModal toggleModal={toggleReviewModal} confirmReview={confirmReviewService} />
      }
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
  iconReviewContainer: {
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

  topImgContainer: {
    width: width,
    height: '30%',
    // height: '30%',
    paddingTop: normalize(3, 'height'),
    paddingBottom: normalize(4, 'height')
  },
  topImg: {
    width: '100%',
    height: '100%'
  },

  detailImgContainer: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  detailImg: {
    width: 100,
    height: 100,
    marginLeft: 5
  },

  titlePriceLine: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(5),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  title: {
    width: '70%',
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.blueTitleColor,
  },
  price: {
    width: '30%',
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.greenPriceColor,
    textAlign: 'right'
  },
  itemTitle: {
    fontSize: RFPercentage(2),
    color: Colors.greyColor,
    marginLeft: normalize(10),
  },

  reviewLine: {
    height: '4%',
    flexDirection: 'row',
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  ratingPart: {
    width: normalize(100),
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewPart: {
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

  scrollBody: {
    width: '100%',
    marginBottom: normalize(5, 'height')
  },
  aboutPart: {
    width: '100%',
    padding: normalize(10)
  },
  labelTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: "600",
    color: Colors.blackColor
  },
  valueTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },

  accordionPart: {
    width: '100%',
    padding: normalize(10),
  },
  collapseHeader: {
    width: '95%',
    height: normalize(40, 'height'),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.greyWeakColor,
    borderTopWidth: normalize(2),
    borderBottomWidth: normalize(2)
  },
  arrowIcon: {
    fontSize: RFPercentage(2.2),
    color: Colors.readMoreLessColor
  },
  collapseContent: {
    width: '95%',
    alignSelf: 'center',
    paddingTop: normalize(10, 'height'),
    paddingBottom: normalize(10, 'height'),
  },
  topLine: {
    flexDirection: 'row',
  },
  reviewerImg: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(15)
  },
  nameAndRatingPart: {
    marginLeft: normalize(7)
  },
  reviewerName: {
    fontSize: RFPercentage(2.2),
    color: Colors.blueTitleColor
  },
  reviewDescTxt: {
    fontSize: RFPercentage(2.2),
    fontStyle: 'italic',
    color: Colors.blackColor,
    marginLeft: normalize(42),
    marginTop: normalize(5, 'height'),
    marginBottom: normalize(10, 'height')
  },

  btn: {
    width: '80%',
    height: normalize(40, 'height'),
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: normalize(8),
    marginBottom: normalize(10, 'height')
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,
  },

  hunterImg: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(50),
    alignSelf: 'center',
  },
  hunterDesc: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,
    minHeight: normalize(50, 'height'),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingBottom: normalize(10),
  },
});