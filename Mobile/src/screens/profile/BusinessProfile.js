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
import { getUser, getData, setData } from '../../service/firebase';
import StarRating from 'react-native-star-rating';
import Collapse from 'accordion-collapse-react-native/build/components/Collapse';
import CollapseHeader from 'accordion-collapse-react-native/build/components/CollapseHeader';
import CollapseBody from 'accordion-collapse-react-native/build/components/CollapseBody';

export default function BusinessProfile({ navigation }) {

    const [profile, setProfile] = useState(Constants.user);
    const [reviews, setReviews] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (Constants.user?.id) {
            getReviews();
        }

    }, []);

    getReviews = async () => {
        setSpinner(true);
        await getData('reviews').then(res => {
            if (Array.isArray(res)) {
                setReviews(res.filter(each => each.bid == profile.bid));
            }
            setSpinner(false);
        });
    }

    let business = null;
    if (Constants.user && Constants.user.role == 'business') {
        business = Constants.business.find(one => one.id == Constants.user.bid);
    }

    onUpdateReviewStatus = async (review, status) => {
        Alert.alert('', 'Are you sure to ' + status + ' the review?',
            [
                {
                    text: 'OK', onPress: async () => {
                        review.status = status;
                        setSpinner(true);
                        await setData('reviews', 'update', review)
                        .then(() => {
                            setSpinner(false);
                        })
                        .catch((err) => {
                            setSpinner(false);
                            console.log('update status error:', err);
                        })
                    }
                },
                {
                    text: 'CANCEL', onPress: () => { }
                }
            ]
        );
    }

    onEditPage = () => {
        navigation.navigate('BusinessProfileEdit', { refresh: () => 
            {
                setRefresh(!refresh)
            }
        });
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
                    <Text style={styles.titleTxt}>Business Profile</Text>
                </View>
                <View style={styles.iconEditContainer}>
                    <TouchableOpacity onPress={onEditPage}>
                        <EntypoIcon name="new-message" style={styles.headerIcon}></EntypoIcon>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.topContainer}>
                <Image style={styles.img} source={business.img ? { uri: business.img } : Images.profileImg} resizeMode='cover' />
                <Text style={styles.name}>{profile.name ? profile.name : 'No name'}</Text>
                <View style={[styles.addressLine, {flexDirection:'row'}]}>
                    <StarRating
                        starSize={15}
                        fullStarColor={Colors.yellowToneColor}
                        disabled={true}
                        maxStars={5}
                        rating={business.rating}
                        selectedStar={(rating) => { }}
                    />
                    <Text style={{ marginLeft: 5, color:'white', marginTop:-2 }} >{business.rating.toFixed(1)}</Text>
                </View>
                <View style={styles.addressLine}>
                    <EntypoIcon name="location-pin" style={styles.profileIcon}></EntypoIcon>
                    <Text style={styles.address}>{business.address ? business.address : 'No address'}</Text>
                </View>
                
                <View style={styles.addressLine}>
                    <EntypoIcon name="globe" style={styles.profileIcon}></EntypoIcon>
                    <Text style={styles.address}>{business.site ? business.site : 'No Website'}</Text>
                </View>
                <View style={styles.addressLine}>
                    <EntypoIcon name="phone" style={styles.profileIcon}></EntypoIcon>
                    <Text style={styles.address}>{business.phone ? business.phone : 'No Phone number'}</Text>
                </View>
                <View style={styles.addressLine}>
                    <EntypoIcon name="clock" style={styles.profileIcon}></EntypoIcon>
                    <Text style={styles.address}>{business.operatingHours ? (business.operatingHours.from + ' - ' + business.operatingHours.to) : 'No Operating Hours'}</Text>
                </View>
            </View>

            <ScrollView style={styles.favoritesBody}>
                <Collapse style={{backgroundColor: 'white', marginBottom:5, borderRadius:5, overflow: 'hidden'}}>
                    <CollapseHeader>
                        <View flexDirection='row' style={{padding:10, backgroundColor:''}}>
                            <EntypoIcon name="chevron-thin-down" style1={[styles.headerIcon, { fontSize: RFPercentage(3.2), marginLeft:10 }]}></EntypoIcon>
                            <Text style={{marginLeft:5}} >Information</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <Text style={{padding:10, fontSize:10}} >{business.desc}</Text>
                    </CollapseBody>
                </Collapse>
                <Collapse style={{backgroundColor: 'white', marginBottom:5, borderRadius:5, overflow: 'hidden'}}>
                    <CollapseHeader>
                        <View flexDirection='row' style={{padding:10, backgroundColor:''}}>
                            <EntypoIcon name="chevron-thin-down" style1={[styles.headerIcon, { fontSize: RFPercentage(3.2), marginLeft:10 }]}></EntypoIcon>
                            <Text style={{marginLeft:5}} >Reviews ({reviews.length})</Text>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        { reviews.map(review => {   
                            const user = Constants.users.find(one=>one.id == review.uid);
                            return (<View key={review.id} style={{padding:10, marginTop:5, borderBottomWidth:1, borderBottomColor:Colors.greyColor}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{width:30, height:30, borderRadius:15}} source={user.img ? { uri: user.img } : Images.profileImg} resizeMode='cover' />
                                    <View>
                                        <Text style={{marginLeft:5}} >{user.name}</Text>
                                        <View style={[{flexDirection:'row', marginLeft:5}]}>
                                            <StarRating
                                                starSize={15}
                                                fullStarColor={Colors.yellowToneColor}
                                                disabled={true}
                                                maxStars={5}
                                                rating={review.bRating}
                                            />
                                            <Text style={{ marginLeft: 5, color:'black', fontSize:10 }} >{review.bRating.toFixed(1)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:1}}></View>
                                    <View style={{flexDirection:'row'}}>
                                        { review.status == 'ready' ?
                                        <>
                                        <TouchableOpacity onPress={() => onUpdateReviewStatus(review, 'accepted')}  style={{width:80, backgroundColor:Colors.yellowToneColor, alignItems:'center', borderRadius:5, padding:5}}>
                                            <Text style={{color:'black'}}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => onUpdateReviewStatus(review, 'reported')} style={{width:80, backgroundColor:'#e03930', alignItems:'center', borderRadius:5, padding:5, marginLeft:5}}>
                                            <Text style={{color:'white'}}>Report</Text>
                                        </TouchableOpacity>
                                        </> :
                                        <Text style={{color:review.status=='accepted'?Colors.greenPriceColor:'#e03930', textTransform:'capitalize'}}>{review.status}</Text>
                                        }
                                    </View>
                                </View>
                                <Text style={{ marginLeft: 5, color:'black', fontSize:10, paddingTop:10 }} >{review.bDesc}</Text>
                            </View>);
                        })}
                    </CollapseBody>
                </Collapse>
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
        // backgroundColor: Colors.greyWeakColor
        backgroundColor: Colors.greyStrongColor,

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
    profileIcon: {
        fontSize: RFPercentage(2),
        color: Colors.whiteColor,
    },
    titleTxt: {
        fontSize: RFPercentage(3.5),
        fontWeight: '600',
        color: Colors.yellowToneColor,
    },

    topContainer: {
        width: '100%',
        // height: '40%',
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: Colors.greyStrongColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: '80%',
        height: normalize(150),
        // borderRadius: normalize(75),
        // borderWidth: normalize(2),
        // borderColor: Colors.greyWeakColor
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
        marginTop: normalize(5, 'height'),
    },
    address: {
        fontSize: RFPercentage(2),
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
        // marginTop: normalize(15, 'height'),
        padding: 10
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