import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Platform,
  Text,
  TextInput,
  ImageBackground,
  Alert
} from 'react-native';

import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { SwipeListView } from 'react-native-swipe-list-view';

import { Colors, Images, Constants } from '@constants';

export default function MessageListScreen({ navigation, route }) {
  const [refresh, setRefresh] = useState(false);
  const [deletedUserIdData, setdeletedUserIdData] = useState([]);

  const [roomChats, setRoomChats] = useState([]);

  useEffect(() => {
    getRoomChats();
  }, []);

  getRoomChats = () => {
    const chatRef = firebase.database().ref('chat');
    chatRef.on('value', snapshot => {
      const allChatsObj = snapshot.val();
      let roomChats = [];

      for (let room in allChatsObj) {        
        var userIds = room.split("-");
        let roomChatsObj = allChatsObj[room];
        
        let keyArr = Object.keys(roomChatsObj);
        keyArr.sort((a,b)=>a<b);
        let roomLastChat = roomChatsObj[keyArr[0]];
        
        if (userIds[0] == Constants.user?.id) {
          roomChats.push({
            chateeId: userIds[1],
            lastChat: roomLastChat
          })
        }
        else if (userIds[1] == Constants.user?.id) {
          roomChats.push({
            chateeId: userIds[0],
            lastChat: roomLastChat
          })
        }
      }

      setRoomChats(roomChats);      
    })
  }

  getTimeFromTimestamp = (createdAt) => {
    var s = new Date(createdAt).toLocaleTimeString("en-US");
    return s;
  }

  onDeleteItem = (item) => {
    var data = [...roomChats];
    data.splice(data.findIndex(each => each.chateeId == item.chateeId), 1);
    setRoomChats(data);
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
          <Text style={styles.titleTxt}>Messages</Text>
        </View>
      </View>

      <View style={styles.body}>
        {
          roomChats.length > 0 &&
          <SwipeListView
            keyExtractor={(item)=>item.chateeId}
            data={roomChats}
            renderItem={({ item }, rowMap) => {
              const chatee = Constants.users.find(e => e.id == item.chateeId);
              return (
                <TouchableHighlight style={styles.rowFront} underlayColor={Colors.whiteColor} onPress={() => navigation.navigate('Chat', { chateeId: item.chateeId })}>
                  <>
                    <Image style={styles.img} source={chatee.img ? { uri: chatee.img } : Images.profileImg} />
                    {/* {
                    item.active &&
                    <View style={styles.activeDot}></View>
                  } */}
                    <View style={styles.rightPart}>
                      <View style={styles.nameAndTimeLine}>
                        <Text style={styles.nameTxt}>{chatee.name ? chatee.name : 'User'}</Text>
                        <Text style={styles.timeTxt}>{getTimeFromTimestamp(item.lastChat.createdAt)}</Text>
                      </View>
                      <Text style={styles.messageTxt} numberOfLines={2} ellipsizeMode='tail'>{item.lastChat.text}</Text>
                    </View>
                  </>
                </TouchableHighlight>
              )
            }}
            renderHiddenItem={(item, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => onDeleteItem(item)}>
                  <EntypoIcon name="trash" style={styles.headerIcon}></EntypoIcon>
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={0}
            rightOpenValue={normalize(-80)}
          />
        }
        {
          roomChats.length == 0 &&
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTxt}>No Chat History</Text>
          </View>
        }
      </View>
    </View>

  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
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
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  rowFront: {
    width: '100%',
    height: normalize(80, 'height'),
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.greyWeakColor,
    borderBottomWidth: normalize(3)
  },
  img: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30)
  },
  activeDot: {
    width: normalize(12),
    height: normalize(12),
    backgroundColor: Colors.greenPriceColor,
    position: 'absolute',
    left: normalize(50),
    top: normalize(50),
    borderRadius: normalize(6)
  },
  rightPart: {
    flex: 1,
    marginLeft: normalize(10)
  },
  nameAndTimeLine: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameTxt: {
    fontSize: RFPercentage(2.5),
    fontWeight: '600',
    color: Colors.blueTitleColor,
  },
  timeTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.greyColor,
  },
  messageTxt: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
  },

  rowBack: {
    width: '100%',
    height: normalize(80, 'height'),
    alignItems: 'flex-end',
  },
  deleteBtn: {
    width: normalize(80),
    height: '100%',
    backgroundColor: '#dd3333',
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(230, 'height'),    
  },
  emptyTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.blackColor
  },
});