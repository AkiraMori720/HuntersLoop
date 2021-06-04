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
    KeyboardAvoidingView, Linking,
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { useIsFocused } from '@react-navigation/native';

import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from "react-native-image-crop-picker";

import { Colors, Constants } from '@constants';

import { setData, uploadMedia } from '../../service/firebase';

import CheckBox from '@react-native-community/checkbox';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {check, PERMISSIONS, RESULTS} from "react-native-permissions";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "../../components/DatePicker";

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
            let business = Constants.business.find(each => each.id == Constants.user?.bid);
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

    const onUpdateServiceImage = (index = null) => {
        Alert.alert(
            'Select Image',
            '',
            [
                {
                    text: "Cancel", onPress: () => {
                    }
                },
                {
                    text: "Take photo", onPress: async () => {
                        await takePhoto(index);
                    }
                },
                {
                    text: "From library", onPress: async () => {
                        await pickImage(index);
                    }
                },
            ]);
    };


    const pickImage = async (index = null) => {
        let options = {
            cropping: false,
            compressImageQuality: 0.8,
            enableRotationGesture: true,
            avoidEmptySpaceAroundImage: false,
            mediaType: 'photo'
        };
        try{
            const response = await ImagePicker.openPicker(options);
            if (index === null) {
                service.img = response.path
                setmainImagePath(response.path);
            } else {
                service.detailImgs[index] = response.path
                let new_paths = imagesPath;
                new_paths[index] = response.path;
                setImagesPath(new_paths);
            }
            console.log('response', response);
            // setService(service);
            setRefresh(!refresh)
        } catch (e) {
            console.log('pick error', e)
        }
    };

    const checkCameraPermission = () => {
        return new Promise((resolve, reject) => {
            check(Platform.OS === 'ios'?PERMISSIONS.IOS.CAMERA:PERMISSIONS.ANDROID.CAMERA)
                .then((result) => {
                    if (result == RESULTS.GRANTED) resolve(true);
                    else resolve(false);
                })
                .catch((error) => {
                    resolve(false);
                })
        })
    }

    const takePhoto = async (index = null) => {
        let isCameraPermission = await checkCameraPermission();
        if (!isCameraPermission) {
            Alert.alert(
                'Visit settings and allow camera permission',
                '',
                [
                    {
                        text: "OK", onPress: () => {
                            Linking.openURL('app-settings:');
                        }
                    },
                    {
                        text: "CANCEL", onPress: () => {
                        }
                    }
                ]);
            return;
        }

        let options = {
            cropping: false,
            compressImageQuality: 0.8,
            enableRotationGesture: true,
            avoidEmptySpaceAroundImage: false,
        };
        try{
            const response = await ImagePicker.openCamera(options);
            if (index === null) {
                service.img = response.path
                setmainImagePath(response.path);
            } else {
                service.detailImgs[index] = response.path
                let new_paths = imagesPath;
                new_paths[index] = response.path;
                setImagesPath(new_paths);

            }
            // setService(service);
            setRefresh(!refresh)
        } catch (e) {
            console.log('pick error', e)
        }
    }

    const uploadPhoto = (localPath, fbPath) => {
        return new Promise(async (resolve, reject) => {
            let platformPhotoLocalPath = Platform.OS === "android" ? localPath : localPath.replace("file://", "")
            let newPath = '';
            await ImageResizer.createResizedImage(platformPhotoLocalPath, 800, 400, 'PNG', 100, 0, null)
                .then(response => {
                    newPath = response.uri;
                    console.log({newPath})
                })
                .catch(err => {
                    console.log('image resizer error', err);
                });
            console.log(platformPhotoLocalPath);
            try{
                await uploadMedia('services', fbPath, newPath)
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
            } catch(err){
                console.log('upload photo error', err);
                reject(err);
            }
        })
    }

    const onPreview = () => {
        if (!service.name) return Alert.alert('', 'Please input the title');
        if (!service.days) return Alert.alert('', 'Please input the Hunt Duration');
        if (!service.hunters) return Alert.alert('', 'Please input the Hunt per package');

        service.mode = 'view';
        navigation.navigate('ServiceDetail', { serviceItem: service });
    }

    const onRequest = async () => {
        if (!service.name) return Alert.alert('', 'Please input the title');
        if (!service.days) return Alert.alert('', 'Please input the Hunt Duration');
        if (!service.hunters) return Alert.alert('', 'Please input the Hunt per package');
        if (service.season.from && service.season.to && service.season.from > service.season.to) return Alert.alert('','Please select valid Season');
        if(!service.cid) return Alert.alert('', 'Please select Service Category');

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
                const service_index = Constants.services.findIndex(each => each.id == service.id);
                if (service_index < 0) {
                    Constants.services.push(service)
                } else {
                    Constants.services.splice(service_index, 1, service);
                }

                Alert.alert('', 'Publish service successfully.',[{ text: "OK", onPress: () => {
                        setSpinner(false);
                        navigation.pop();
                    } }]);
            }).catch(error => {
                Alert.alert('', 'Publishing service was failed.', [{ text: "OK", onPress: () => setSpinner(false) }]);
            })
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert('', err.message,[{ text: "OK", onPress: () => setSpinner(false) }]);
        }
    }

    const updateServiceProperty = (key, value) => {
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
                    <Text style={styles.titleTxt}>{ (route.params?.service)?'Edit Service':'Add a Service'}</Text>
                </View>
            </View>

            <ScrollView style={[styles.body]} keyboardShouldPersistTaps='always'>
                { Platform.OS === 'android' ?
                <View style={[styles.inputBox, { paddingLeft: 5, justifyContent: 'center' }]}>
                    <RNPickerSelect
                        items={
                            Constants.categories.map(category => ({
                                    label: category.name.toUpperCase(),
                                    value: category.id
                                })
                            )
                        }
                        useNativeAndroidPickerStyle={false}
                        onValueChange={(value) => updateServiceProperty('cid', value) }
                        value={service.cid}
                        placeholder={{
                            label: 'Select Category',
                            value: null
                        }}
                        style={{
                            inputAndroid: {
                                color: Colors.blackColor
                            },
                            inputIOS: {
                                fontSize: RFPercentage(2.5),
                                color: Colors.blackColor,
                                paddingVertical: 8
                            }
                        }}
                    />
                </View>
                :
                <View style={[styles.inputBox, { paddingLeft: 0, justifyContent: 'center', zIndex: 10 }]}>
                    <DropDownPicker
                        items={
                            Constants.categories.map(category => ({
                                    label: category.name.toUpperCase(),
                                    value: category.id
                                })
                            )
                        }
                        defaultValue={service.cid}
                        containerStyle={{
                            height: '100%'
                        }}
                        style={{
                            backgroundColor: Colors.greyWeakColor
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        labelStyle={{
                            fontSize: RFPercentage(2.5)
                        }}
                        dropDownStyle={{
                            backgroundColor: Colors.greyWeakColor,
                        }}
                        onChangeItem={item => updateServiceProperty('cid', item.value)}
                    />
                </View>
                }
                <TextInput
                    style={styles.inputBox}
                    autoCapitalize='none'
                    placeholder={'Hunt Title*'}
                    placeholderTextColor={Colors.riskColor}
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
                    placeholderTextColor={Colors.riskColor}
                    value={service.days}
                    onChangeText={(text) => updateServiceProperty('days', text)}
                    keyboardType='number-pad'
                ></TextInput>
                <TextInput
                    style={styles.inputBox}
                    autoCapitalize='none'
                    placeholder={'Hunt per package*'}
                    placeholderTextColor={Colors.riskColor}
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
                <View style={{flexDirection:'row', padding: 4, alignItems: 'center'}}>
                    <CheckBox
                        value={service.isContactPrice}
                        style={{width: 24, height: 24}}
                        onValueChange={(text) => updateServiceProperty('isContactPrice', text)}
                    >
                    </CheckBox>
                    <Text style={{paddingTop:5, paddingLeft: 5}}>Contact guide for package price</Text>
                </View>
                
                <Text style={[styles.logoTxt, {marginTop:15}]}>Hunting Season</Text>
                <View style={{flexDirection:'row', marginTop: normalize(10, 'height'), alignItems:'center' }} >
                    <DatePicker
                        style={{flex: 1}}
                        placeholder={'Select Date'}
                        type={'date'}
                        value={service.season.from?(new Date(moment(service.season.from))):null}
                        action={({value}) => {
                            service.season.from = value;
                            setService(service);
                            setRefresh(!refresh);
                        }}
                    />
                    <Text style={{width:60, textAlign: 'center'}}>~</Text>
                    <DatePicker
                        style={{flex: 1}}
                        placeholder={'Select Date'}
                        type={'date'}
                        value={service.season.to?(new Date(moment(service.season.to))):null}
                        minimumDate={new Date()}
                        action={({value}) => {
                            service.season.to = value;
                            setService(service);
                            setRefresh(!refresh);
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
                    style={[styles.inputBox, {alignItems:'flex-start', height:90}]}
                    autoCapitalize='none'
                    placeholder={'Terms and Conditions'}
                    placeholderTextColor={Colors.greyColor}
                    defaultValue={service.terms}
                    onChangeText={(text) => service.terms = text}
                    multiline={true}
                    textAlignVertical='top'
                ></TextInput>

                <View style={styles.btnGroup}>
                    <TouchableOpacity style={styles.btn} onPress={() => onPreview() }>
                        <Text style={styles.btnTxt}>Preview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => onRequest()}>
                        <Text style={styles.btnTxt}>{route.params?.service?'Update':'Publish'}</Text>
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
        fontSize: RFPercentage(3),
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