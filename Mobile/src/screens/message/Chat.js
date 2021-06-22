import React, {useState, useEffect} from 'react';

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
    BackHandler,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';
import normalize from 'react-native-normalize';
import {RFPercentage} from 'react-native-responsive-fontsize';
import KeyboardManager from 'react-native-keyboard-manager'

import firebase from '@react-native-firebase/app';

import {
    GiftedChat,
    Time,
    Composer
} from "react-native-gifted-chat";

import EntypoIcon from 'react-native-vector-icons/Entypo';

EntypoIcon.loadFont();

import {Colors, Images, Constants} from '@constants';
import {checkInternet, sendNotifications} from '../../service/firebase';

const ID_MESSAGE_LENGTH = 24;

export default function ChatScreen({navigation, route}) {
    const [messages, setMessages] = useState([]);

    const [inputText, setInputText] = useState('');
    const user = Constants.user;
    const chatee = Constants.users.find(each => each.id == route.params.chateeId);

    const [chatRef, setChatRef] = useState();
    const [chats, setChats] = useState([])
    const chatID = user.id < chatee.id ? user.id + '-' + chatee.id : chatee.id + '-' + user.id;

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        });
        // this.unSubscribeFocus = navigation.addListener('focus', () => {
        //   onOnline();
        // });
        //
        // const unSubscribeBlur = navigation.addListener('blur', () => {
        //   onOffline();
        // });

        onOnline();
        makeChat();

        if (Platform.OS === 'ios') {
            KeyboardManager.setEnable(false);
        }


        return (() => {
            const lastVisitedRef = firebase.database().ref('chat/' + chatID + '/lastVisited/' + user.id);
            lastVisitedRef.set(Date.now());
            onOffline();

            backHandler.remove();
            // if(unSubscribeBlur){
            //   unSubscribeBlur();
            // }
        })
    }, [])

    const onOnline = () => {
        const statusRef = firebase.database().ref('chat/' + chatID + '/status/' + user.id);
        statusRef.set('online');
    }

    const onOffline = () => {
        const statusRef = firebase.database().ref('chat/' + chatID + '/status/' + user.id);
        statusRef.set('offline');
    }

    const makeChat = async () => {
        const chatRef = firebase.database().ref('chat/' + chatID + '/messages');
        setChatRef(chatRef);

        chatRef.on('value', snapshot => {
            const chatsObj = snapshot.val();
            let chats = [];
            for (let key in chatsObj) {
                chats.push(chatsObj[key]);
            }
            chats.sort(function (a, b) {
                return b.createdAt - a.createdAt
            });
            setChats(chats);
        });
    }

    const generateMessageId = () => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < ID_MESSAGE_LENGTH; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const onSendMessage = async () => {
        var isConnected = await checkInternet();
        if (!isConnected) {
            Alert.alert('Please check your internet connection.');
            return;
        }

        const statusRef = firebase.database().ref('chat/' + chatID + '/status/' + chatee.id);
        const status = (await statusRef.once('value')).val();

        const message = {
            _id: generateMessageId(),
            text: inputText
        }

        setInputText('');
        if (message.text.trim() == "") {
            return;
        }

        const chat = {
            _id: message._id,
            text: message.text,
            user: {
                _id: user.id,
                avatar: user.img
            },
            createdAt: new Date().getTime()
        }

        chatRef.push(chat);

        // Send Notification
        if (status === 'offline' && chatee.fcmToken) {
            sendNotifications([chatee.fcmToken], (user.name && user.name.length) ? user.name : 'User', message.text, {
                action: 'message',
                chateeId: user.id
            })
        }
    }

    const renderTime = (props) => {
        return (
            <View style={{flexDirection: "row"}}>
                <Time {...props} />
            </View>
        );
    }

    const renderInput = () => {
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    value={inputText}
                    multiline
                    keyboardType='twitter'
                    placeholder='Input Message ...'
                    onChangeText={val => setInputText(val)}
                    style={styles.input}
                />
                {inputText.length > 0 ?
                    <TouchableOpacity style={styles.sendBtn} onPress={() => onSendMessage()}>
                        <Text style={{color: 'blue', fontSize: 16 }}>Send</Text>
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
        );
    }


    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.iconBackContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack(null)}>
                        <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleTxt}>{chatee.name ? chatee.name : 'User'}</Text>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : null} style={styles.giftedChat}
                                  keyboardVerticalOffset={30}>
                <GiftedChat
                    messages={chats}
                    onSend={messages => onSendMessage(messages)}
                    user={{_id: user.id}}
                    isAnimated
                    showAvatarForEveryMessage
                    renderAvatarOnTop={true}
                    alwaysShowSend={true}
                    renderLoading={() => (<ActivityIndicator size="large" color="#0000ff"/>)}
                    renderTime={timeProps => renderTime(timeProps)}
                    renderInputToolbar={() => renderInput()}
                />
            </KeyboardAvoidingView>

        </View>
    );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
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
        fontSize: RFPercentage(3.5),
        fontWeight: '600',
        color: Colors.yellowToneColor,
    },

    giftedChat: {
        width: '100%',
        height: '86%',
        backgroundColor: Colors.whiteColor,
    },
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.greyColor
    },
    input:{
        flexGrow: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        fontSize: 14,
        borderRadius:16,
        backgroundColor: 'white'
    },
    sendBtn: {
        padding: 4,
        marginHorizontal: 8
    }
});
