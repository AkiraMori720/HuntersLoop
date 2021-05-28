import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Button, Alert } from "reactstrap";

import firebase from "firebase/app";

import { getData, setData } from '../../../store/actions';
import { Icons } from '../../../constants';
import defaultUserImg from '../../../assets/images/defaultUserImg.png';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '',
      params: '',
      user: '',
      users: [],
      newMessage: '',
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.isMount = false;
  }

  componentDidMount() {
    const { match: { path } } = this.props;
    const { match: { params } } = this.props;
    this.setState({
      path: path,
      params: params
    });

    let user = this.props.auth.user;
    if (!user) {
      user = JSON.parse(localStorage.getItem("authUser"))
    }
    this.setState({user: user});

    this.props.getData('users');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.users.length != this.props.data.users.length) {
      this.setState({ users: this.props.data.users }, () => {
        this.isMount = true;
        const chatRef = firebase.database().ref('chat');
        chatRef.on('value', this.messageHandler)
      });
    }
  }

  componentWillUnmount() {
    this.isMount = false;
    const chatRef = firebase.database().ref('chat');
    chatRef.off('value', this.messageHandler);
  }

  toggleMenu() {
    this.props.toggleMenuCallback();
  }

  messageHandler = (snapshot) => {
    if (!this.isMount) return;

    const allChatsObj = snapshot.val();
    let roomChatFeatureArrs = [];
    for (let room in allChatsObj) {
      var userIds = room.split("-");
      let roomChatsObj = allChatsObj[room];
      let roomLastChat = roomChatsObj[Object.keys(roomChatsObj)[Object.keys(roomChatsObj).length - 1]];
      let roomChatCount = Object.keys(roomChatsObj).length;
      if (userIds[0] == this.state.user.id) {
        roomChatFeatureArrs.push({
          chateeId: userIds[1],
          count: roomChatCount,
          lastChat: roomLastChat,
        })
      }
      else if (userIds[1] == this.state.user.id) {
        roomChatFeatureArrs.push({
          chateeId: userIds[0],
          count: roomChatCount,
          lastChat: roomLastChat
        })
      }
    }

    let savedRoomChatFeatureArrsObj = localStorage.getItem('roomChatFeatureArrs');
    if (savedRoomChatFeatureArrsObj) {
      let savedRoomChatFeatureArrs = JSON.parse(savedRoomChatFeatureArrsObj);
      if (roomChatFeatureArrs.length > savedRoomChatFeatureArrs.length) {
        for (var i = 0; i < roomChatFeatureArrs.length; i++) {
          var index = savedRoomChatFeatureArrs.findIndex(each => each.chateeId == roomChatFeatureArrs[i].chateeId);
          var isNewChatRoom = index == - 1;
          if (isNewChatRoom) {
            var chatee = this.state.users.find(e => e.id == roomChatFeatureArrs[i].chateeId);
            var newMessage = {
              chatee: chatee,
              message: roomChatFeatureArrs[i].lastChat.text
            }
            this.setState({ newMessage: newMessage })
            setTimeout(() => {
              if (this.isMount) {
                this.setState({ newMessage: '' })
              }
            }, 5000)
            break;
          }
        }
      }
      else if (roomChatFeatureArrs.length == savedRoomChatFeatureArrs.length) {
        roomChatFeatureArrs.forEach((each, index) => {
          if (each.count != savedRoomChatFeatureArrs[index].count) {
            if (each.lastChat.user._id == each.chateeId) {
              var chatee = this.state.users.find(e => e.id == each.chateeId);
              var newMessage = {
                chatee: chatee,
                message: each.lastChat.text
              }
              this.setState({ newMessage: newMessage })
              setTimeout(() => {
                if (this.isMount) {
                  this.setState({ newMessage: '' })
                }
              }, 5000)
            }
          }
        })
      }
    }

    localStorage.setItem("roomChatFeatureArrs", JSON.stringify(roomChatFeatureArrs));
  }

  render() {
    let storeUser = this.props.auth.user;
    let role = storeUser && storeUser.role;
    if (!role) {
      let storageUser = JSON.parse(localStorage.getItem("authUser"));
      role = storageUser && storageUser.role;
    }

    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <div className="d-flex align-items-center ml-3">
                  <button type="button" onClick={this.toggleMenu} className="btn btn-sm font-size-16 header-item waves-effect" id="vertical-menu-btn">
                    <i className={`${Icons.menu}`}></i>
                  </button>
                  <CardImg src={this.state.user.img ? this.state.user.img : defaultUserImg} alt="No Image" className="profileImg ml-2 rounded-circle avatar-sm border border-white" style={{ width: 40, height: 40 }} />
                  <div className="ml-2 profileLabel">
                    <span className="text-white">Welcome, {this.state.user.name ? this.state.user.name.split(" ")[0] + '!' : this.state.user.role + '!'}</span>
                    <br />
                    <span className="font-size-14 text-secondary">version 1.00</span>
                  </div>
                </div>
              </div>

              {
                role === 'business' &&
                <div className="d-flex align-items-center ml-4">
                  {
                    this.state.path === '/profile' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.profile} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">PROFILE</span>
                    </div>
                  }
                  {
                    this.state.path === '/profile/edit' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.profile} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">EDIT PROFILE</span>
                    </div>
                  }
                  {
                    this.state.path === '/services' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.services} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">SERVICES</span>
                    </div>
                  }
                  {
                    (this.state.path === '/services/add' || this.state.path === '/services/edit') &&
                    <>
                      <div className="d-flex align-items-center">
                        <i className={`${Icons.services} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                        <span className="font-size-20 text-white ml-3">SERVICES</span>
                      </div>
                    </>
                  }
                  {
                    this.state.path === '/chat' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.messages} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">MESSAGES</span>
                    </div>
                  }
                  {
                    this.state.path === '/socialupdate' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.socialUpdate} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">SOCIAL UPDATE</span>
                    </div>
                  }
                  {
                    this.state.path === '/settings' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.settings} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">SETTINGS</span>
                    </div>
                  }

                </div>
              }
              {
                role === 'admin' &&
                <div className="d-flex align-items-center ml-4">
                  {
                    this.state.path === '/admin/reports' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.reports} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">REPORTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/reports/detail' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.reports} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">REPORTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/users/all' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.allUsers} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">All USERS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/users/banned' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.bannedUsers} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BANNED USERS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BUSINESS ACCOUNTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts/requests' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BUSINESS ACCOUNTS REQUESTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts/requests/detail' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BUSINESS ACCOUNTS REQUESTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts/view' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">VIEW BUSINESS ACCOUNTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/pricing' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.pricing} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">PRICING</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/changepwd' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.changePwd} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">ChANGE PASSWORD</span>
                    </div>
                  }
                </div>
              }
            </div>

            {
              this.state.newMessage &&
              <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', width: '100vw', height: 70 }}>

                <Alert color="danger" className="d-flex align-items-center" style={{ minWidth: 500, height: 60 }}>
                  <CardImg src={this.state.newMessage.chatee.img ? this.state.newMessage.chatee.img : defaultUserImg} alt="No Image" className="profileImg ml-3 rounded-circle avatar-sm border border-white" style={{ width: 30, height: 30 }} />
                    &nbsp;&nbsp;
                    [{this.state.newMessage.chatee.name}]
                    &nbsp;&nbsp;
                    {this.state.newMessage.message}
                </Alert>

              </div>
            }
          </div>
        </header>

      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    ...state
  };
};

export default connect(mapStatetoProps, {
  getData
})(withRouter(Header));
