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
    ImageBackground,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import moment from 'moment';

import { useIsFocused } from '@react-navigation/native';

import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextInputMask } from 'react-native-masked-text';

import { Colors, Images, Constants } from '@constants';

import { getData, setData, uploadMedia } from '../../service/firebase';

import RNIap, {
    purchaseErrorListener,
    purchaseUpdatedListener,
    ProductPurchase,
    PurchaseError
} from 'react-native-iap';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-datepicker'

purchaseUpdateSubscription = null
purchaseErrorSubscription = null

export default function AddService({ navigation, route }) {
    const [service, setService] = useState({season:{}, detailImgs:[]});
    const [refresh, setRefresh] = useState(true);

    const [mainImagePath, setmainImagePath] = useState();
    const [imagesPath, setImagesPath] = useState([]);
    
    const [logo, setLogo] = useState();
    const [bname, setBname] = useState();
    const [address, setAddress] = useState();
    const [location, setLocation] = useState({});
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [site, setSite] = useState();
    const [membershipId, setMembershipId] = useState();

    const [photoLocalPath, setPhotoLocalPath] = useState('');
    const [imgDownloadUrl, setImgDownloadUrl] = useState('');

    const [spinner, setSpinner] = useState(false);

    let refAddress = useRef();
    let refInput = useRef();

    let inited_IAP = false;

    if (useIsFocused() && Constants.refreshFlag) {
        Constants.refreshFlag = false;
        if (Constants.user?.bid) {
            var business = Constants.business.find(each => each.id == Constants.user?.bid);
            if (business) {
                setLogo(business.img ? business.img : null);
                setBname(business.name);
                setAddress(business.address);
                setLocation(business.location);
                setPhone(business.phone);
                setEmail(business.email);
                setSite(business.site);
                setMembershipId(business.mid);
            }
        }
    }

    useEffect(() => {
        if (address) {
            refAddress.current?.setAddressText(address);
        }

        if (route.params?.service) {
            const param_service = {...route.params.service}
            setService(param_service);
        } else {
            service.bid = Constants.user.bid
            setService(service);
        }
    }, [address])

    onUpdateServiceImage = (index = null) => {
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
                if (index === null) {
                    service.img = response.uri
                    setmainImagePath(response.path);
                } else {
                    service.detailImgs[index] = response.uri
                    let new_paths = imagesPath;
                    new_paths[index] = response.path;
                    setImagesPath(new_paths);
                    
                }
                // setService(service);
                setRefresh(!refresh)
            }
        });
    };

    uploadPhoto = (localPath, fbPath) => {
        return new Promise(async (resolve, reject) => {
            var platformPhotoLocalPath = Platform.OS === "android" ? localPath : localPath.replace("file://", "")
            let newPath = '';
            await ImageResizer.createResizedImage(platformPhotoLocalPath, 400, 200, 'PNG', 50, 0, null)
                .then(response => {
                    newPath = response.uri;
                    console.log({newPath})
                })
                .catch(err => {
                    console.log('image resizer error', err);
                });
                console.log(platformPhotoLocalPath);

            await uploadMedia('services', fbPath, platformPhotoLocalPath)
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

    onPreview = () => {
        if (!service.name) return Alert.alert('', 'Please input the title');
        if (!service.days) return Alert.alert('', 'Please input the Hunt Duration');
        if (!service.hunters) return Alert.alert('', 'Please input the Hunt per package');

        service.mode = 'view';
        navigation.navigate('ServiceDetail', { serviceItem: service });
    }

    onRequest = async () => {
        if (!service.name) return Alert.alert('', 'Please input the title');
        if (!service.days) return Alert.alert('', 'Please input the Hunt Duration');
        if (!service.hunters) return Alert.alert('', 'Please input the Hunt per package');

        setSpinner(true);

        if (!service.id) {
            const upated_service = await setData('services', 'add', {name: service.name});
            service.id = upated_service.id;
            await setService(service);
        }

        if (service.img && service.img.substring(0,4) != 'http' && mainImagePath) {
            service.img = await uploadPhoto(mainImagePath, service.id + '/main');
        }

        const detail_imgs = [];
        for (let index = 0; index < service.detailImgs.length; index++) {
            const image_uri = service.detailImgs[index];
            if (image_uri) {
                if (image_uri.substring(0,4) == 'http') {
                    detail_imgs.push(image_uri)
                } else if (imagesPath[index]) {
                    detail_imgs.push(await uploadPhoto(imagesPath[index], service.id + '/detail_' + detail_imgs.length) )
                }
            }
        }
        
        service.detailImgs = detail_imgs;
        console.log('post service', service)
        try {
            setData('services', 'update', service).then(res => {
                Alert.alert('', 'Publish service successfully.');
                const service_index = Constants.services.findIndex(each => each.id == service.id);
                if (service_index < 0) {
                    Constants.services.push(service)    
                } else {
                    Constants.services.splice(service_index, 1, service);
                }

                setSpinner(false);
            })
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    }

    iap_success = async () => {
        setSpinner(true);
        if (photoLocalPath) {
            await uploadPhoto()
                .then(() => {
                    requestBusiness();
                })
                .catch((err) => {
                    console.log('upload photo error', err);
                    setSpinner(false);
                })
        }
        else {
            requestBusiness();
        }
    }

    updateServiceProperty = (key, value) => {
        service[key] = value;
        setService(service);
        setRefresh(!refresh);
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Spinner
                visible={spinner}
                textContent={''}
            />
            <View style={styles.header}>
                <View style={styles.iconBackContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack(null)}>
                        <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleTxt}>Add a Service</Text>
                </View>
            </View>

            <ScrollView style={[styles.body]} keyboardShouldPersistTaps='always'>
                <View style={[styles.inputBox, { paddingLeft: 5 }]}>
                    <RNPickerSelect
                        items={
                            Constants.categories.map(category => ({
                                    label: category.name.toUpperCase(),
                                    value: category.id
                                })
                            )
                        }
                        onValueChange={(value) => updateServiceProperty('cid', value) }
                        value={service.cid}
                        placeholder={{}}
                        style={{
                            inputAndroid: {
                                color: Colors.blackColor
                            }
                        }}
                    />
                </View>

                <TextInput
                    style={styles.inputBox}
                    autoCapitalize='none'
                    placeholder={'Hunt Title*'}
                    placeholderTextColor={Colors.greyColor}
                    value={service.name}
                    onChangeText={(text) => updateServiceProperty('name', text)}
                ></TextInput>
                <TextInput
                    style={styles.inputBox}
                    autoCapitalize='none'
                    placeholder={'Address'}
                    placeholderTextColor={Colors.greyColor}
                    value={service.address}
                    onChangeText={(text) => updateServiceProperty('address', text)}
                ></TextInput>
                <TextInput
                    style={[styles.inputBox, {alignItems:'flex-start', height:'auto'}]}
                    autoCapitalize='none'
                    placeholder={'About the hunt'}
                    placeholderTextColor={Colors.greyColor}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical='top'
                    value={service.about}
                    onChangeText={(text) => updateServiceProperty('about', text)}
                ></TextInput>
                <TextInput
                    style={[styles.inputBox, {alignItems:'flex-start', height:'auto'}]}
                    autoCapitalize='none'
                    placeholder={'Hunting Guidelines'}
                    placeholderTextColor={Colors.greyColor}
                    value={service.guide}
                    onChangeText={(text) => updateServiceProperty('guide', text)}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical='top'
                ></TextInput>
                <TextInput
                    style={styles.inputBox}
                    autoCapitalize='none'
                    placeholder={'Hunt Duration (day/s)*'}
                    placeholderTextColor={Colors.greyColor}
                    value={service.days}
                    onChangeText={(text) => updateServiceProperty('days', text)}
                    keyboardType='number-pad'
                ></TextInput>
                <TextInput
                    style={styles.inputBox}
                    autoCapitalize='none'
                    placeholder={'Hunt per package*'}
                    placeholderTextColor={Colors.greyColor}
                    value={service.hunters}
                    onChangeText={(text) => updateServiceProperty('hunters', text)}
                    keyboardType='number-pad'
                ></TextInput>
                <TextInput
                    style={styles.inputBox}
                    autoCapitalize='none'
                    placeholder={'Package Price ($)'}
                    placeholderTextColor={Colors.greyColor}
                    keyboardType='decimal-pad'
                    value={service.price}
                    onChangeText={(text) => updateServiceProperty('price', text)}
                ></TextInput>
                <View style={{flexDirection:'row'}}>
                    <CheckBox
                        value={service.isContactPrice}
                        onValueChange={(text) => updateServiceProperty('isContactPrice', text)}
                        // style={styles.checkbox}
                    >
                    </CheckBox>
                    <Text style={{paddingTop:5}}>Contact guide for package price</Text>
                </View>
                
                <Text style={{marginTop:10}}>Hunting Season</Text>
                <View style={{flexDirection:'row'}} >
                    <DatePicker
                        style={{flex:1}}
                        date={service.season.from}
                        mode="date"
                        placeholder="Start Date"
                        format="YYYY-MM-DD"
                        customStyles={{
                        dateInput: {
                            // marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => { 
                            service.season.from = date;
                            setService(service);
                            setRefresh(!refresh)
                        }}
                    />
                    <Text style={{width:10}}></Text>
                    <DatePicker
                        style={{flex: 1}}
                        date={service.season.to}
                        mode="date"
                        placeholder="End Date"
                        format="YYYY-MM-DD"
                        customStyles={{
                        dateInput: {
                            // marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => { 
                            service.season.to = date;
                            setService(service);
                            setRefresh(!refresh)
                        }}
                    />
                </View>

                <Text style={[styles.logoTxt, {marginTop:15}]}>Service Image</Text>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage()}>
                        { service.img ?
                            <Image style={styles.logoImg} source={{ uri: service.img }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Service Image</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <Text style={[styles.logoTxt, {marginTop:15}]}>Detail Images</Text>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(0)}>
                        { service.detailImgs[0] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[0] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 1</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(1)}>
                        { service.detailImgs[1] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[1] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 2</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(2)}>
                        { service.detailImgs[2] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[2] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 3</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(3)}>
                        { service.detailImgs[3] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[3] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 4</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(4)}>
                        { service.detailImgs[4] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[4] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 5</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(5)}>
                        { service.detailImgs[5] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[5] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 6</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(6)}>
                        { service.detailImgs[6] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[6] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 7</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(7)}>
                        { service.detailImgs[7] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[7] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 8</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(8)}>
                        { service.detailImgs[8] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[8] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 9</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.logo}>
                    <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateServiceImage(9)}>
                        { service.detailImgs[9] ?
                            <Image style={styles.logoImg} source={{ uri: service.detailImgs[9] }} resizeMode='cover' />
                            :
                            <>
                                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                                <Text style={styles.logoTxt}>Detail Image 10</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={[styles.inputBox, {alignItems:'flex-start', height:'auto'}]}
                    autoCapitalize='none'
                    placeholder={'Terms and Conditions'}
                    placeholderTextColor={Colors.greyColor}
                    value={service.terms}
                    onChangeText={(text) => setBname(text)}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical='top'
                ></TextInput>

                <View style={styles.btnGroup}>
                    <TouchableOpacity style={styles.btn} onPress={() => onPreview() }>
                        <Text style={styles.btnTxt}>Preview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => onRequest()}>
                        <Text style={styles.btnTxt}>Publish</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>


        </KeyboardAvoidingView>
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
        fontSize: RFPercentage(2.2),
        fontWeight: '600',
        color: Colors.yellowToneColor,
    },

    body: {
        width: '90%',
        height: '90%',
        alignSelf: 'center',
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
        color: Colors.blackColor,
    },

    inputBox: {
        width: '100%',
        height: normalize(45, 'height'),
        backgroundColor: Colors.greyWeakColor,
        fontSize: RFPercentage(2.5),
        borderRadius: normalize(8),
        marginTop: normalize(10, 'height'),
        paddingLeft: normalize(10),
    },

    btnGroup: {
        width: '100%',
        // height: normalize(40, 'height'),
        flexDirection:'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'baseline',
    },

    btn: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.yellowToneColor,
        borderRadius: normalize(8),
        margin: normalize(10, 'height'),
        // marginTop: normalize(40, 'height'),
        padding: 10,
    },
    btnTxt: {
        fontSize: RFPercentage(2.2),
        color: Colors.blackColor
    },
});