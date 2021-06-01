import React from 'react';

import {
    Alert,
    BackHandler,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import normalize from 'react-native-normalize';
import {RFPercentage} from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import {SliderPicker} from 'react-native-slider-picker';

import {Colors, Constants, Images} from '@constants';
import BusinessItem from '../../components/BusinessItem';

import {getData, setData} from '../../service/firebase';
import {getDistance} from 'geolib';
import StarRating from 'react-native-star-rating';
import {Collapse, CollapseBody, CollapseHeader} from 'accordion-collapse-react-native';

EntypoIcon.loadFont();

export default class BusinessListScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            business: Constants.business.filter(each => each.status === 'approved'),
            services: Constants.services,
            isBusiness: Constants.user?.role === 'business',
            refresh: false,
            distanceSearch: false,
            distance: 1000,
            categorySearch: false,
            categories: Constants.categories,
            activeCategories: []
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.unSubscribeFocus = navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true; });
            const isBusiness = Constants.user?.role === 'business';
            console.log('isBusiness', isBusiness, this.state.isBusiness);
            if(isBusiness && isBusiness !== this.state.isBusiness && !this.state.business.find(one => one.id == Constants.user.bid)){
                Alert.alert('', 'Your business request is not approved yet');
            }
            this.setState({isBusiness});
        });
        this.unSubscribeBlur = navigation.addListener('blur', () => {
            if(this.backHandler && this.backHandler.remove){
                this.backHandler.remove();
                this.backHandler = null;
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const { distanceSearch, categorySearch, activeCategories, distance, keyword, refresh } = this.state;
        if(prevState.distanceSearch !== distanceSearch ||
            prevState.categorySearch !== categorySearch
        ){
            if (distanceSearch && categorySearch) {
                let filtered = this.getBusinessByCategory();
                filtered = this.getBusinessByDistance(filtered, distance);
                filtered = this.getBusinessByKeyword(filtered, keyword);
                this.setState({ business: filtered });
            }
            else if (distanceSearch && !categorySearch) {
                let filtered = this.getBusinessByDistance(Constants.business.filter(each => each.status === 'approved'), distance);
                filtered = this.getBusinessByKeyword(filtered, keyword);
                this.setState({ business: filtered, activeCategories: [] });
            }
            else if (!distanceSearch && categorySearch) {
                let filtered = this.getBusinessByCategory();
                filtered = this.getBusinessByKeyword(filtered, keyword);
                this.setState({ business: filtered });
            }
            else if (!distanceSearch && !categorySearch) {
                let filtered = Constants.business.filter(each => each.status === 'approved');
                this.setState({ business: filtered, activeCategories: [] });
            }
        }
        if(prevState.activeCategories !== activeCategories){
            let filtered = this.getBusinessByCategory();
            filtered = this.getBusinessByDistance(filtered, distance);
            filtered = this.getBusinessByKeyword(filtered, keyword);
            this.setState({ business: filtered });
        }
        if(prevState.refresh !== refresh) {
            if (Constants.refreshFlag) {
                Constants.refreshFlag = false;
                this.getBusiness();
            }
        }
    }

    componentWillUnmount(){
        if(this.unSubscribeFocus){
            this.unSubscribeFocus();
        }
        if(this.unSubscribeBlur){
            this.unSubscribeBlur();
        }
    }

    getBusiness = async () => {
        await getData('business')
            .then((res) => {
                if (res) {
                    Constants.business = res;
                }
            })
    }

    onBusinessItem = (item) => {
        const { navigation } = this.props;
        Constants.backRoute = 'Home';
        navigation.navigate('ServiceList', { businessItem: item })
    }

    /////////////////////
    onCategorySearch = (category) => {
        const { activeCategories } = this.state;
        let aCategories = [...activeCategories];
        let index = aCategories.findIndex(each => each.id == category.id);
        if (index == -1) {
            aCategories.push(category)
        }
        else {
            aCategories.splice(index, 1);
        }
        this.setState({ activeCategories: aCategories });
    }

    getBusinessByCategory = () => {
        const { activeCategories, categorySearch, services } = this.state;

        if (!categorySearch) {
            return Constants.business.filter(each => each.status === 'approved');
        }

        let bids = [];
        services.forEach(each => {
            if (activeCategories?.findIndex(e => e.id == each.cid) > -1) {
                bids.push(each.bid);
            }
        });

        let filtered = Constants.business.filter(each => bids.includes(each.id) && each.status === 'approved');
        console.log('activeCategories', activeCategories);
        console.log('filtered', filtered.length);
        return filtered;
    }
    ///////////////////
    onDistanceSearch = (distanceValue) => {
        const { keyword } = this.state;

        let filtered = this.getBusinessByCategory();
        filtered = this.getBusinessByDistance(filtered, distanceValue);
        filtered = this.getBusinessByKeyword(filtered, keyword);
        this.setState({
            business: filtered,
            distance: distanceValue
        });
    }
    getDistanceMile = (item) => {
        let myLocation = (Constants.location.latitude && Constants.location.latitude) ? Constants.location : Constants.user?.location;

        if ((!myLocation?.latitude || !myLocation?.longitude) ||
            (!item.location?.latitude || !item.location?.longitude)) {
            return 0;
        }
        else {
            if (!myLocation) return 0;
            let distance = getDistance(myLocation, item.location);
            let distanceMile = distance / 1000 / 1.6;
            return distanceMile.toFixed(2);
        }
    }
    getBusinessByDistance = (result, distance) => {
        const { distanceSearch } = this.state;

        if (!distanceSearch) return result;
        return result.filter(each => this.getDistanceMile(each) < distance && each.status === 'approved');
    }
    ///////////////////
    onSearch = (text) => {
        const { distance } = this.state;
        let filtered = this.getBusinessByCategory();
        filtered = this.getBusinessByDistance(filtered, distance);
        filtered = this.getBusinessByKeyword(filtered, text);
        this.setState({
            business: filtered,
            keyword: text
        });
    }
    getBusinessByKeyword = (result, text) => {
        if (!text) return result;
        return result.filter(each => (each.name?.toLowerCase().includes(text.toLowerCase()) || each.address?.toLowerCase().includes(text.toLowerCase())) && each.status === 'approved');
    }

    onPressProfile = () => {
        const { navigation } = this.props;

        if (Constants.user) {
            if (Constants.user.role == 'business') {
                navigation.navigate('BusinessProfile')
            } else {
                navigation.navigate('Profile')
            }
        }
        else {
            this.showAlert();
        }
    }

    showAlert = () => {
        const { navigation } = this.props;
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

    onDeleteService = (service_id) => {
        try {
            setData('services', 'delete', { id: service_id }).then(res => {
                const service_index = Constants.services.findIndex(each => each.id == service_id);
                Alert.alert('', 'Deleted service successfully.');
                Constants.services.splice(service_index, 1);
                this.setState({ refresh: !this.state.refresh });
            }).catch(error => {
                Alert.alert('', 'Deleting service was failed.');
            })
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    }

    // let myServices = [];
    myServices = () => {
        return Constants.services.filter(one => one.bid == Constants.user.bid);
    }

    render = () => {
        const { navigation } = this.props;
        const { business, distanceSearch, categorySearch, distance, categories, activeCategories, refresh, keyword } = this.state;

        let myBusiness = null;
        if (Constants.user && Constants.user.role == 'business') {
            myBusiness = business.find(one => one.id == Constants.user.bid);
            // myServices = services.filter(one => one.bid == Constants.user.bid);
        }

        console.log('business', myBusiness, business, Constants.user);

        if (!myBusiness) {
            return (
                <ImageBackground style={styles.container} source={Images.background}>
                    <View style={styles.header}>
                        <View style={styles.iconProfileContainer}>
                            <TouchableOpacity onPress={this.onPressProfile}>
                                <EntypoIcon name="user" style={styles.headerIcon}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.iconMapContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('MapView')}>
                                <EntypoIcon name="map" style={[styles.headerIcon, { fontSize: RFPercentage(3.2) }]}/>
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
                                    this.showAlert();
                                }
                            }}>
                                <EntypoIcon name="message" style={styles.headerIcon}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.iconSettingContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                                <EntypoIcon name="cog" style={styles.headerIcon}/>
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
                                onChangeText={(text) => this.onSearch(text)}
                            >
                            </TextInput>
                            <TouchableOpacity onPress={() => this.setState({ distanceSearch: !distanceSearch })}>
                                <EntypoIcon name="location-pin" style={[styles.searchBoxIcon, { fontSize: RFPercentage(4.2) }, distanceSearch ? { color: Colors.yellowToneColor } : null]}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ categorySearch: !categorySearch })}>
                                <EntypoIcon name="funnel" style={[styles.searchBoxIcon, categorySearch ? { color: Colors.yellowToneColor } : null]}/>
                            </TouchableOpacity>
                        </View>
                        {
                            distanceSearch &&
                            <View style={styles.distanceSearchPart}>
                                <SliderPicker
                                    minLabel={'0'}
                                    maxLabel={'3000'}
                                    maxValue={3000}
                                    callback={position => this.onDistanceSearch(position)}
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
                                            <TouchableOpacity key={index} style={[styles.categorySearchBtn, activeCategories?.findIndex(e => e.name == each.name) > -1 ? { borderColor: Colors.yellowToneColor } : null]} onPress={() => this.onCategorySearch(each)}>
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
                                return <BusinessItem key={index} item={each} onPress={this.onBusinessItem} onRefresh={() => this.setState({ refresh: !refresh })} showAlert={this.showAlert} />
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
                        <TouchableOpacity onPress={this.onPressProfile}>
                            <EntypoIcon name="user" style={styles.headerIcon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconMapContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('AddService')}>
                            <EntypoIcon name="plus" style={[styles.headerIcon, { fontSize: RFPercentage(3.2) }]}/>
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
                                this.showAlert();
                            }
                        }}>
                            <EntypoIcon name="message" style={styles.headerIcon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconSettingContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                            <EntypoIcon name="cog" style={styles.headerIcon}/>
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
                                const render_services = this.myServices().filter(one => one.cid == category.id);
                                if (render_services.length == 0 ) return null;
                                console.log(category);
                                return (
                                    <Collapse key={category.id} style={{backgroundColor: 'white', marginBottom:5, borderRadius:5}}>
                                        <CollapseHeader>
                                            <View flexDirection='row' style={{padding:10, backgroundColor:''}}>
                                                <EntypoIcon name="chevron-thin-down" style1={[styles.headerIcon, { fontSize: RFPercentage(3.2), marginLeft:10 }]}/>
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
                                                                <EntypoIcon name="user" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(2.5), }]}/>
                                                                <Text style={{marginRight:15, marginLeft:5}}>{one.hunters}</Text>
                                                                <EntypoIcon name="calendar" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(3), }]}/>
                                                                <Text style={{marginLeft:5}}>{one.days}</Text>
                                                                <View style={{flex:1}}/>
                                                                <View style={{ flexDirection:'row' }}>
                                                                    <TouchableOpacity style={{padding:5}} onPress={() => { navigation.navigate('ServiceDetail', { serviceItem: one }) }}>
                                                                        <EntypoIcon name="eye" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(3), }]}/>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={{padding:5}} onPress={() => {navigation.navigate('AddService', { service: one })}}>
                                                                        <EntypoIcon name="pencil" style={[styles.headerIcon, { color:'black', fontSize: RFPercentage(3), }]}/>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={{padding:5}} onPress={() => this.onDeleteService(one.id)}>
                                                                        <EntypoIcon name="trash" style={[styles.headerIcon, { color:'red', fontSize: RFPercentage(3), }]}/>
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