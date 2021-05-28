import React, { useState, useEffect, useRef } from 'react';

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
    Alert,
    KeyboardAvoidingView,
    Linking
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { Colors, Images, Constants } from '@constants';
import FavoriteItem from '../../components/FavoriteItem';

import { setData, uploadMedia } from '../../service/firebase';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function BusinessProfileEdit({ navigation, route }) {
    const [business, setBusiness] = useState();
    const [refresh, setRefresh] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [fromTime, setFromTime] = useState(new Date());
    const [toTime, setToTime] = useState(new Date());

    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    const [logoImagePath, setLogoImagePath] = useState();
    const [iconImagePath, setIconImagePath] = useState();
    const [imagesPath, setImagesPath] = useState([]);
    

    useEffect(() => {
        if (Constants.user && Constants.user.role == 'business') {
            const myBusiness = {...Constants.business.find(one => one.id == Constants.user.bid)};
            setBusiness(myBusiness);
            
            if (myBusiness.operatingHours.from) {
                const from = myBusiness.operatingHours.from;
                var hours = from.split(':')[0] * 1;
                if (from.toLowerCase().includes('pm')) {
                    hours += 12;
                }
                fromTime.setHours(hours);
                var mins = parseInt(from.split(':')[1]);
                fromTime.setMinutes(mins);
                setFromTime(fromTime);
            }
            if (myBusiness.operatingHours.to) {
                const to = myBusiness.operatingHours.to;
                var hours = to.split(':')[0] * 1;
                if (to.toLowerCase().includes('pm')) {
                    hours += 12;
                }
                toTime.setHours(hours);
                const mins = parseInt(to.split(':')[1]);
                toTime.setMinutes(mins);
                setToTime(toTime);
            }
        }
    }, [])

    if (!business) return null;


    updateBusiness = (key, value) => {
        business[key] = value;
        setBusiness(business);
        setRefresh(!refresh);
    }

    onUpdateImage = (index = null) => {
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                // console.log(response);
                if (Platform.OS != "android") {
                    response.path = response.uri; 
                }
                if (index === 'logo') {
                    business.img = response.uri;
                    setLogoImagePath(response.path);
                } else if (index === 'icon'){
                    business.icon = response.uri;
                    setIconImagePath(response.path);
                } else {
                    business.slideImgs[index] = response.uri
                    imagesPath[index] = response.path
                    setImagesPath(imagesPath);
                }
                setBusiness(business)
                setRefresh(!refresh)
            }
        });
    };

    uploadPhoto = (localPath, fbPath) => {
        console.log({localPath, fbPath})
        return new Promise(async (resolve, reject) => {
            var platformPhotoLocalPath = Platform.OS === "android" ? localPath : localPath.replace("file://", "")
            // let newPath = '';
            // await ImageResizer.createResizedImage(platformPhotoLocalPath, 400, 200, 'PNG', 50, 0, null)
            //     .then(response => {
            //         newPath = response.uri;
            //         console.log({newPath})
            //     })
            //     .catch(err => {
            //         console.log('image resizer error', err);
            //     });
                console.log(platformPhotoLocalPath);

            await uploadMedia('business', fbPath, platformPhotoLocalPath)
                .then((downloadURL) => {
                    if (!downloadURL) return;
                    // console.log('downloadURL', downloadURL)
                    // setImgDownloadUrl(downloadURL);
                    resolve(downloadURL);
                })
                .catch((err) => {
                    console.log('upload photo error', err);
                    reject(err);
                })
        })
    }

    onSave = async () => {
        setSpinner(true);
        if (business.img && business.img.substring(0,4) != 'http' && logoImagePath) {
            business.img = await uploadPhoto(logoImagePath, business.id + '/main');
        }

        if (business.icon && business.icon.substring(0,4) != 'http' && iconImagePath) {
            business.icon = await uploadPhoto(iconImagePath, business.id + '/icon');
        }

        const slideImgs = [];
        for (let index = 0; index < business.slideImgs.length; index++) {
            const image_uri = business.slideImgs[index];
            if (image_uri) {
                if (image_uri.substring(0,4) == 'http') {
                    slideImgs.push(image_uri)
                } else if (imagesPath[index]) {
                    slideImgs.push(await uploadPhoto(imagesPath[index], business.id + '/detail_' + slideImgs.length) )
                }
            }
        }

        business.slideImgs = slideImgs
        try {
            setData('business', 'update', business).then(res => {
                Alert.alert('', 'update business successfully.');
                const index = Constants.business.findIndex(each => each.id == business.id);
                console.log('updated business', index);
                Constants.business.splice(index, 1, business);
                setSpinner(false);

                if (route.params.refresh) {
                    route.params.refresh();
                }
            })
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    }
    

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={''}
            />
            <View style={styles.header}>
                <View style={styles.iconHomeContainer}>
                    <TouchableOpacity onPress={() => { Constants.refreshFlag = true; navigation.goBack(null) }}>
                        <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleTxt}>Edit Business Profile</Text>
                </View>
            </View>

            <View style={styles.body}>
                <ScrollView keyboardShouldPersistTaps='always' style={{alignSelf: 'center'}}>
                    <Text style={styles.logoTxt}>Company Logo</Text>
                    <View style={styles.logo}>
                        <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage('logo')}>
                            {business.img ?
                                <Image style={styles.logoImg} source={{ uri: business.img }} resizeMode='cover' />
                                :
                                <>
                                    <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                    <Text style={styles.logoTxt}>Update Image</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.logoTxt}>Company Icon</Text>
                    <View style={styles.logo}>
                        <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage('icon')}>
                            {business.icon ?
                                <Image style={styles.logoImg} source={{ uri: business.icon }} resizeMode='cover' />
                                :
                                <>
                                    <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                    <Text style={styles.logoTxt}>Update Image</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.logoTxt}>Slide Images</Text>
                    <View style={styles.logo}>
                        <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(0)}>
                            {business.slideImgs[0] ?
                                <Image style={styles.logoImg} source={{ uri: business.slideImgs[0] }} resizeMode='cover' />
                                :
                                <>
                                    <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                    <Text style={styles.logoTxt}>Update Image</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logo}>
                        <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(1)}>
                            {business.slideImgs[1] ?
                                <Image style={styles.logoImg} source={{ uri: business.slideImgs[1] }} resizeMode='cover' />
                                :
                                <>
                                    <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                    <Text style={styles.logoTxt}>Update Image</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logo}>
                        <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(2)}>
                            {business.slideImgs[2] ?
                                <Image style={styles.logoImg} source={{ uri: business.slideImgs[2] }} resizeMode='cover' />
                                :
                                <>
                                    <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                    <Text style={styles.logoTxt}>Update Image</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.logoTxt}>Address</Text>
                    <TextInput
                        style={styles.inputBox}
                        autoCapitalize='none'
                        // placeholder={'Address'}
                        placeholderTextColor={Colors.greyColor}
                        // keyboardType='decimal-pad'
                        value={business.address}
                        onChangeText={(text) => updateBusiness('address', text)}
                    ></TextInput>

                    <Text style={styles.logoTxt}>Email</Text>
                    <TextInput
                        style={styles.inputBox}
                        autoCapitalize='none'
                        // placeholder={'Address'}
                        placeholderTextColor={Colors.greyColor}
                        // keyboardType='decimal-pad'
                        value={business.email}
                        onChangeText={(text) => updateBusiness('email', text)}
                    ></TextInput>

                    <Text style={styles.logoTxt}>Website</Text>
                    <TextInput
                        style={styles.inputBox}
                        autoCapitalize='none'
                        // placeholder={'Address'}
                        placeholderTextColor={Colors.greyColor}
                        // keyboardType='decimal-pad'
                        value={business.site}
                        onChangeText={(text) => updateBusiness('site', text)}
                    ></TextInput>

                    <Text style={styles.logoTxt}>Phone number</Text>
                    <TextInput
                        style={styles.inputBox}
                        autoCapitalize='none'
                        // placeholder={'Address'}
                        placeholderTextColor={Colors.greyColor}
                        // keyboardType='decimal-pad'
                        value={business.phone}
                        onChangeText={(text) => updateBusiness('phone', text)}
                    ></TextInput>

                    <Text style={styles.logoTxt}>Operating Hours</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={{flex:1, marginRight:2}} onPress={() => setShowStartTime(true)}>
                            <Text style={[styles.inputBox, {padding: 10, flex:1}]}>{business.operatingHours.from} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1, marginLeft:2}} onPress={() => setShowEndTime(true)}>
                            <Text style={[styles.inputBox, {padding: 10, flex:1}]}>{business.operatingHours.to} </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.logoTxt}>Information</Text>
                    <TextInput
                        style={[styles.inputBox, {alignItems:'flex-start', height:'auto'}]}
                        autoCapitalize='none'
                        placeholder={'About the hunt'}
                        placeholderTextColor={Colors.greyColor}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical='top'
                        value={business.desc}
                        onChangeText={(text) => updateBusiness('desc', text)}
                    ></TextInput>

                </ScrollView>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => onSave()}>
                    <Text style={styles.btnTxt}>SAVE</Text>
                </TouchableOpacity>
            </View>

            {showStartTime && (
                <DateTimePicker
                // testID="dateTimePicker"
                value={fromTime}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={(e, time) => {
                    if (!business.operatingHours) { business.operatingHours = {} }
                    business.operatingHours.from = getTimeString(time);
                    setFromTime(time)
                    setShowStartTime(false);
                }}
                />
            )}
            {showEndTime && (
                <DateTimePicker
                // testID="dateTimePicker"
                value={fromTime}
                mode='time'
                is24Hour={true}
                display="default"
                onChange={(e, time) => {
                    if (!business.operatingHours) { business.operatingHours = {} }
                    business.operatingHours.to = getTimeString(time);
                    setToTime(time)
                    setShowEndTime(false);
                }}
                />
            )}
        </KeyboardAvoidingView>
    );
}

function getTimeString(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: Colors.greyWeakColor,
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

    body: {
        backgroundColor: Colors.greyStrongColor,
        height: '77%',
    },
    imgContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: normalize(10, 'height')
    },
    img: {
        width: normalize(150),
        height: normalize(150),
        borderRadius: normalize(75),
        borderWidth: normalize(2),
        borderColor: Colors.greyWeakColor
    },
    imgEditIconBack: {
        width: normalize(25),
        height: normalize(25),
        marginTop: Platform.OS === 'android' ? normalize(120, 'height') : normalize(90, 'height'),
        marginLeft: normalize(-30),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.yellowToneColor,
        borderRadius: normalize(15)
    },
    imgEditIcon: {
        width: '60%',
        height: '60%',
    },

    logo: {
        width: width * 0.9,
        height: normalize(width * 0.9 / 2.4, 'height'),
        backgroundColor: Colors.greyWeakColor,
        marginTop: normalize(10, 'height'),
        borderRadius: normalize(8),
    },
    logoImg: {
        width: '100%',
        height: '100%',
        borderRadius: normalize(8)
    },
    logoBtn: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoTxt: {
        fontSize: RFPercentage(2.5),
        color: 'white',
        marginTop: 10,
    },


    inputContainer: {
        width: '90%',
        flexDirection: 'row',
        alignSelf: 'center',
        // borderWidth: 1
    },
    labelTxt: {
        width: '25%',
        textAlign: 'right',
        fontSize: RFPercentage(2.2),
        fontWeight: '600',
        color: Colors.whiteColor,
        marginTop: normalize(19, 'height'),
        marginRight: normalize(10)
    },
    inputBox: {
        width: '100%',
        height: normalize(45, 'height'),
        backgroundColor: Colors.greyWeakColor,
        fontSize: RFPercentage(2.5),
        borderRadius: normalize(8),
        marginTop: normalize(5, 'height'),
        paddingLeft: normalize(10),
    },

    favoritesHeader: {
        width: '100%',
        height: '8%',
        backgroundColor: Colors.yellowToneColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(10, 'height'),
        marginBottom: normalize(10, 'height'),
    },
    favoritesHeaderTxt: {
        fontSize: RFPercentage(3),
        fontWeight: '600',
        color: Colors.blackColor
    },

    emptyContainer: {
        width: '100%',
        height: normalize(200, 'height'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTxt: {
        fontSize: RFPercentage(2.2),
        fontWeight: '600',
        color: Colors.whiteColor
    },

    btnContainer: {
        width: '100%',
        height: '10%',
        backgroundColor: Colors.greyStrongColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        width: '80%',
        height: normalize(45, 'height'),
        backgroundColor: Colors.yellowToneColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalize(8),
    },
    btnTxt: {
        fontSize: RFPercentage(2.5),
        color: Colors.blackColor
    },
});