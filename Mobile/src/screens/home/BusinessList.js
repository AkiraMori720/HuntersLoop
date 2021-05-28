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
    BackHandler
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useIsFocused } from '@react-navigation/native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { SliderPicker } from 'react-native-slider-picker';

import { Colors, Images, Constants } from '@constants';
import BusinessItem from '../../components/BusinessItem';

import { getData } from '../../service/firebase';
import { getDistance } from 'geolib';
import StarRating from 'react-native-star-rating';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';

export default function BusinessListScreen({ navigation }) {
    console.log('render BusinessListScreen');

    const [keyword, setKeyword] = useState('');
    const [business, setBusiness] = useState(Constants.business.filter(each => each.status === 'approved'));
    const [services, setServices] = useState(Constants.services);
    const [refresh, setRefresh] = useState(false);

    const [distanceSearch, setDistanceSearch] = useState(false);
    const [distance, setDistance] = useState(1000);

    const [categorySearch, setCategorySearch] = useState(false);
    const [categories, setCategories] = useState(Constants.categories);
    const [activeCategories, setActiveCategories] = useState([]);

    // useEffect(()=>{
    //   const onBackPress = () => {      
    //     return true;
    //   };
    //   BackHandler.addEventListener(
    //     'hardwareBackPress', onBackPress
    //   );

    //   return () => {  
    //     BackHandler.removeEventListener(
    //       'hardwareBackPress', onBackPress
    //     );
    //   }
    // })

    if (useIsFocused() && Constants.refreshFlag) {
        Constants.refreshFlag = false;
        getBusiness();
    }

    async function getBusiness() {
        await getData('business')
            .then((res) => {
                if (res) {
                    Constants.business = res;
                }
            })
    }

    if (useIsFocused() && Constants.refreshFlag) {
        Constants.refreshFlag = false;
        getBusiness();
    }

    onBusinessItem = (item) => {
        Constants.backRoute = 'Home';
        navigation.navigate('ServiceList', { businessItem: item })
    }

    /////////////////////
    onCategorySearch = (category) => {
        var aCategories = [...activeCategories];
        var index = aCategories.findIndex(each => each.id == category.id);
        if (index == -1) {
            aCategories.push(category)
        }
        else {
            aCategories.splice(index, 1);
        }
        setActiveCategories(aCategories);
    }

    useEffect(() => {
        var filtered = getBusinessByCategory();
        filtered = getBusinessByDistance(filtered, distance);
        filtered = getBusinessByKeyword(filtered, keyword);
        setBusiness(filtered);
    }, [activeCategories]);
    getBusinessByCategory = () => {
        if (!categorySearch) {
            var result = Constants.business.filter(each => each.status === 'approved');
            return result;
        }

        var bids = [];
        services.forEach(each => {
            if (activeCategories?.findIndex(e => e.id == each.cid) > -1) {
                bids.push(each.bid);
            }
        });

        var filtered = Constants.business.filter(each => bids.includes(each.id) && each.status === 'approved');
        console.log('activeCategories', activeCategories);
        console.log('filtered', filtered.length);
        return filtered;
    }
    ///////////////////
    onDistanceSearch = (distanceValue) => {
        var filtered = getBusinessByCategory();
        filtered = getBusinessByDistance(filtered, distanceValue);
        filtered = getBusinessByKeyword(filtered, keyword);
        setBusiness(filtered);
        setDistance(distanceValue);
    }
    getDistanceMile = (item) => {
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
    getBusinessByDistance = (result, distance) => {
        if (!distanceSearch) return result;
        var filtered = result.filter(each => getDistanceMile(each) < distance && each.status === 'approved');
        return filtered;
    }
    ///////////////////
    function onSearch(text) {
        var filtered = getBusinessByCategory();
        filtered = getBusinessByDistance(filtered, distance);
        filtered = getBusinessByKeyword(filtered, text);
        setBusiness(filtered);
        setKeyword(text);
    }
    getBusinessByKeyword = (result, text) => {
        if (!text) return result;
        var filtered = result.filter(each => (each.name?.toLowerCase().includes(text.toLowerCase()) || each.address?.toLowerCase().includes(text.toLowerCase())) && each.status === 'approved');
        return filtered;
    }

    useEffect(() => {
        if (distanceSearch && categorySearch) {
            var filtered = getBusinessByCategory();
            filtered = getBusinessByDistance(filtered, distance);
            filtered = getBusinessByKeyword(filtered, keyword);
            setBusiness(filtered);
        }
        else if (distanceSearch && !categorySearch) {
            filtered = getBusinessByDistance(Constants.business.filter(each => each.status === 'approved'), distance);
            filtered = getBusinessByKeyword(filtered, keyword);
            setBusiness(filtered);
            setActiveCategories([]);
        }
        else if (!distanceSearch && categorySearch) {
            var filtered = getBusinessByCategory();
            filtered = getBusinessByKeyword(filtered, keyword);
            setBusiness(filtered);
        }
        else if (!distanceSearch && !categorySearch) {
            setBusiness(Constants.business.filter(each => each.status === 'approved'));
            setActiveCategories([]);
        }
    }, [distanceSearch, categorySearch]);

    onRefresh = () => {
        setRefresh(!refresh)
    }

    onPressProfile = () => {
        if (Constants.user) {
            if (Constants.user.role == 'business') {
                navigation.navigate('BusinessProfile')
            } else {
                navigation.navigate('Profile')
            }
        }
        else {
            showAlert();
        }
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

    // let myServices = [];
    myServices = () => {
        return Constants.services.filter(one => one.bid == Constants.user.bid);
    }

    
    let myBusiness = null;
    if (Constants.user && Constants.user.role == 'business') {
        myBusiness = business.find(one => one.id == Constants.user.bid);
        // myServices = services.filter(one => one.bid == Constants.user.bid);
    }

    if (!myBusiness) { 
        return (
            <ImageBackground style={styles.container} source={Images.background}>
                <View style={styles.header}>
                    <View style={styles.iconProfileContainer}>
                        <TouchableOpacity onPress={onPressProfile}>
                            <EntypoIcon name="user" style={styles.headerIcon}></EntypoIcon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconMapContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('MapView')}>
                            <EntypoIcon name="map" style={[styles.headerIcon, { fontSize: RFPercentage(3.2) }]}></EntypoIcon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleTxt}>Hunters Loop</Text>
                    </View>
                    <View style={styles.iconMessageContainer}>
                        <TouchableOpacity onPress={() => {
                            if (Constants.user) {
                                navigation.navigate('Message')
                            }
                            else {
                                showAlert();
                            }
                        }}>
                            <EntypoIcon name="message" style={styles.headerIcon}></EntypoIcon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconSettingContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                            <EntypoIcon name="cog" style={styles.headerIcon}></EntypoIcon>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.searchOverlay}>
                    <View style={styles.searchBoxContainer}>
                        <TextInput
                            style={styles.inputBox}
                            autoCapitalize='none'
                            placeholder={'Search'}
                            placeholderTextColor={Colors.greyWeakColor}
                            value={keyword}
                            onChangeText={(text) => onSearch(text)}
                        >
                        </TextInput>
                        <TouchableOpacity onPress={() => setDistanceSearch(!distanceSearch)}>
                            <EntypoIcon name="location-pin" style={[styles.searchBoxIcon, { fontSize: RFPercentage(4.2) }, distanceSearch ? { color: Colors.yellowToneColor } : null]}></EntypoIcon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCategorySearch(!categorySearch)}>
                            <EntypoIcon name="funnel" style={[styles.searchBoxIcon, categorySearch ? { color: Colors.yellowToneColor } : null]}></EntypoIcon>
                        </TouchableOpacity>
                    </View>
                    {
                        distanceSearch &&
                        <View style={styles.distanceSearchPart}>
                            <SliderPicker
                                minLabel={'0'}
                                maxLabel={'3000'}
                                maxValue={3000}
                                callback={position => onDistanceSearch(position)}
                                defaultValue={distance}
                                labelFontColor={Colors.whiteColor}
                                labelFontWeight={'200'}
                                showFill={true}
                                fillColor={Colors.yellowToneColor}
                                labelFontSize={22}
                                labelFontWeight={'bold'}
                                showNumberScale={true}
                                showSeparatorScale={true}
                                buttonBackgroundColor={Colors.yellowToneColor}
                                scaleNumberFontWeight={'200'}
                                buttonDimensionsPercentage={6}
                                heightPercentage={1}
                                widthPercentage={80}
                            />
                            <Text style={{ fontSize: RFPercentage(2.5), fontWeight: 'bold', color: Colors.whiteColor, position: 'absolute', alignSelf: 'center' }}>{distance} mi</Text>
                        </View>
                    }
                    {
                        categorySearch &&
                        <View style={styles.categorySearchPart}>
                            {
                                categories.map((each, index) => {
                                    return (
                                        <TouchableOpacity key={index} style={[styles.categorySearchBtn, activeCategories?.findIndex(e => e.name == each.name) > -1 ? { borderColor: Colors.yellowToneColor } : null]} onPress={() => onCategorySearch(each)}>
                                            <Text style={styles.btnTxt}>
                                                {each.name}
                                            </Text>
                                            {/* <TouchableOpacity onPress={() => {
                        var cates = [...categories];
                        cates.splice(cates.findIndex(e => e.id == each.id), 1);
                        setCategories(cates);
                        }}>
                        <EntypoIcon name="circle-with-cross" style={styles.iconClose}></EntypoIcon>
                        </TouchableOpacity> */}
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    }
                </View>


                <ScrollView style={styles.scrollBody}>
                    {
                        business.map((each, index) => {
                            if (Constants.user?.bid) {
                                if (Constants.user?.bid == each.id) return null;
                            }
                            return <BusinessItem key={index} item={each} onPress={onBusinessItem} onRefresh={onRefresh} showAlert={showAlert} />
                        })
                    }
                    {
                        business.length == 0 &&
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTxt}>No Items</Text>
                        </View>
                    }
                </ScrollView>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground style={styles.container} source={Images.background}>
            <View style={styles.header}>
                <View style={styles.iconProfileContainer}>
                    <TouchableOpacity onPress={onPressProfile}>
                        <EntypoIcon name="user" style={styles.headerIcon}></EntypoIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconMapContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('AddService')}>
                        <EntypoIcon name="plus" style={[styles.headerIcon, { fontSize: RFPercentage(3.2) }]}></EntypoIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleTxt}>Hunters Loop</Text>
                </View>
                <View style={styles.iconMessageContainer}>
                    <TouchableOpacity onPress={() => {
                        if (Constants.user) {
                            navigation.navigate('Message')
                        }
                        else {
                            showAlert();
                        }
                    }}>
                        <EntypoIcon name="message" style={styles.headerIcon}></EntypoIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconSettingContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                        <EntypoIcon name="cog" style={styles.headerIcon}></EntypoIcon>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollBody}>
                <View style={{ width: '100%', padding: 10 }}>
                    <View style={{ width: '100%', borderRadius: 10, overflow: 'hidden', backgroundColor: 'white', alignSelf: 'center' }}>
                        <Image style={{ width: '100%', height: 250, alignSelf: 'center', }} resizeMode={'cover'} source={{ uri: myBusiness.img }} />
                        <View style={{ padding: 10 }}>
                            <Text>{myBusiness.name}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <StarRating
                                    starSize={15}
                                    fullStarColor={Colors.yellowToneColor}
                                    disabled={true}
                                    maxStars={5}
                                    rating={myBusiness.rating}
                                    selectedStar={(rating) => { }}
                                />
                                <Text style={{ marginLeft: 5 }} >{myBusiness.rating}</Text>
                            </View>
                        </View>

                    </View>
                </View>
                <View style={{ width: '100%', padding: 10 }}>
                {
                    Constants.categories.map(category => {
                        const render_services = myServices().filter(one => one.cid == category.id);
                        if (render_services.length == 0 ) return null;
                        // console.log({render_services});
                        return (
                            <Collapse key={category.id} style={{backgroundColor: 'white', marginBottom:5, borderRadius:5}}>
                                <CollapseHeader>
                                    <View flexDirection='row' style={{padding:10, backgroundColor:''}}>
                                        <EntypoIcon name="chevron-thin-down" style1={[styles.headerIcon, { fontSize: RFPercentage(3.2), marginLeft:10 }]}></EntypoIcon>
                                        <Text style={{textTransform:'uppercase', marginLeft:5}} >{category.name} ({render_services.length}) </Text>
                                    </View>
                                </CollapseHeader>
                                <CollapseBody>
                                    {
                                        render_services.map(one => {
                                            one.mode = 'view';
                                            return (
                                                <View key={one.id} style={{padding: 10, borderBottomWidth:1, borderColor:'black'}}>
                                                    <Text style={{fontWeight:'bold'}}>{one.name}</Text>
                                                    <Text>{one.about}</Text>
                                                    <Text style={{fontSize:10}}>{one.season.from} ~ {one.season.to}</Text>
                                                    <View style={{flexDirection:'row', paddingTop:5}}>
                                                        <EntypoIcon name="user" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(2.5), }]}></EntypoIcon>
                                                        <Text style={{marginRight:15, marginLeft:5}}>{one.hunters}</Text>
                                                        <EntypoIcon name="calendar" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(3), }]}></EntypoIcon>
                                                        <Text style={{marginLeft:5}}>{one.days}</Text>
                                                        <View style={{flex:1}}></View>
                                                        <View style={{ flexDirection:'row' }}>
                                                            <TouchableOpacity style={{padding:5}} onPress={() => { navigation.navigate('ServiceDetail', { serviceItem: one }) }}>
                                                                <EntypoIcon name="eye" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(3), }]}></EntypoIcon>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{padding:5}} onPress={() => {navigation.navigate('AddService', { service: one })}}>
                                                            <EntypoIcon name="pencil" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(3), }]}></EntypoIcon>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{padding:5}} onPress={() => {}}>
                                                            <EntypoIcon name="trash" style={[styles.headerIcon, { color:'red', fontSize: RFPercentage(3), }]}></EntypoIcon>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                    
                                </CollapseBody>
                            </Collapse>
                        )
                    })
                }
                </View>





                {/* {
          business.map((each, index) => {
            if (Constants.user?.bid) {
              if (Constants.user?.bid == each.id) return null;
            }
            return <BusinessItem key={index} item={each} onPress={onBusinessItem} onRefresh={onRefresh} showAlert={showAlert} />
          })
        }
        {
          business.length == 0 &&
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTxt}>No Items</Text>
          </View>
        } */}
            </ScrollView>
        </ImageBackground>
    );

    
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    header: {
        width: '100%',
        height: normalize(70, 'height'),
        flexDirection: 'row',
        backgroundColor: Colors.blackColor
    },
    iconProfileContainer: {
        width: '12.5%',
        justifyContent: 'center',
        paddingLeft: normalize(20)
    },
    iconMapContainer: {
        width: '12.5%',
        justifyContent: 'center',
        paddingLeft: normalize(20)
    },
    titleContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconMessageContainer: {
        width: '12.5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSettingContainer: {
        width: '12.5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerIcon: {
        fontSize: RFPercentage(3.5),
        color: Colors.whiteColor,
    },
    titleTxt: {
        fontSize: RFPercentage(3),
        fontWeight: '600',
        color: Colors.yellowToneColor,
    },

    searchOverlay: {
        backgroundColor: Colors.blackColor,
        width: '100%',
        // height: normalize(60, 'height'),
        opacity: 0.6,
        justifyContent: 'center'
    },
    searchBoxContainer: {
        width: '90%',
        height: normalize(40, 'height'),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: Colors.whiteColor,
        borderRadius: normalize(25),
        borderWidth: normalize(3),
        marginTop: normalize(10, 'height'),
        marginBottom: normalize(10, 'height'),
        paddingLeft: normalize(10)
    },
    inputBox: {
        width: '75%',
        fontSize: RFPercentage(2.5),
        color: Colors.whiteColor,
        paddingLeft: normalize(5)
    },
    searchBoxIcon: {
        fontSize: RFPercentage(3.5),
        color: Colors.whiteColor,
        marginRight: normalize(10)
    },
    distanceSearchPart: {

    },
    categorySearchPart: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: normalize(7, 'height'),
        paddingLeft: normalize(10),
        paddingRight: normalize(10),
        paddingBottom: normalize(5, 'height'),
    },
    categorySearchBtn: {
        // width: normalize(80),
        // height: normalize(20, 'height'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: normalize(8),
        marginBottom: normalize(8, 'height'),
        paddingLeft: normalize(7),
        paddingRight: normalize(7),
        borderColor: '#333',
        borderWidth: 3
    },
    btnTxt: {
        fontSize: RFPercentage(2.5),
        color: Colors.yellowToneColor,
    },
    iconClose: {
        fontSize: RFPercentage(2.2),
        color: Colors.greyWeakColor,
        marginLeft: normalize(5)
    },

    scrollBody: {
        width: '100%',
        height: '100%',
        marginTop: normalize(10, 'height'),
        marginBottom: normalize(5, 'height'),
    },

    emptyContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(230, 'height')
    },
    emptyTxt: {
        fontSize: RFPercentage(2.2),
        fontWeight: '600',
        color: Colors.whiteColor
    },
});