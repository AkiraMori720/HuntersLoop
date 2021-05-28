import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Media, Button, UncontrolledTooltip } from "reactstrap";

import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "firebase/app";
import "firebase/database";

import { getData, setData } from '../../../store/actions';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import defaultUserImg from '../../../assets/images/defaultUserImg.png';
import { times } from 'chartist';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roomLastChats: [],

      user: {},
      chatee: {},
      chatRef: '',
      chats: [],

      message: '',
    }
    this.isMount = false;
  }

  componentDidMount() {
    let user = this.props.auth.user;
    if (!user) {
      user = JSON.parse(localStorage.getItem("authUser"));
    }
    this.setState({ user: user });

    this.props.getData('users');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.users.length != this.props.data.users.length) {
      this.setState({ users: this.props.data.users }, () => {
        this.isMount = true;
        const chatRef = firebase.database().ref('chat');
        chatRef.on('value', this.roomLastChatHandler)
      });
    }
  }

  componentWillUnmount() {
    this.isMount = false;
    const chatRef = firebase.database().ref('chat');
    chatRef.on('value', this.roomLastChatHandler)
  }

  roomLastChatHandler = (snapshot) => {
    if (!this.isMount) return;

    const allChatsObj = snapshot.val();
    let roomLastChats = [];
    for (let room in allChatsObj) {
      var userIds = room.split("-");
      let roomChatsObj = allChatsObj[room];
      let roomLastChat = roomChatsObj[Object.keys(roomChatsObj)[Object.keys(roomChatsObj).length - 1]];
      if (userIds[0] == this.state.user.id) {
        roomLastChats.push({
          chateeId: userIds[1],
          lastChat: roomLastChat
        })
      }
      else if (userIds[1] == this.state.user.id) {
        roomLastChats.push({
          chateeId: userIds[0],
          lastChat: roomLastChat
        })
      }
    }

    this.setState({ roomLastChats });
  }

  chatOpen = (chatee) => {
    if (!this.isMount) return;

    var chatID = this.state.user.id < chatee.id ? this.state.user.id + '-' + chatee.id : chatee.id + '-' + this.state.user.id;

    const chatRef = firebase.database().ref('chat/' + chatID);
    this.setState({ chatRef: chatRef });

    chatRef.on('value', snapshot => {
      const chatsObj = snapshot.val();
      let chats = [];
      for (let key in chatsObj) {
        chats.push(chatsObj[key]);
      }
      this.setState({
        chats: chats,
        chatee: chatee
      }, () => {
        this._chatAreaScrollBarRef.scrollTop = this._chatAreaScrollBarRef.scrollHeight;
      });
    });
  }

  sendMessage = () => {
    if (!this.state.chatRef) {
      alert('No user!')
      return;
    }

    if (this.state.message !== '') {
      const chat = {
        _id: new Date().getTime(),
        text: this.state.message,
        user: {
          _id: this.state.user.id,
          avatar: this.state.user.img
        },
        createdAt: new Date().getTime()
      }

      this.state.chatRef.push(chat);
      this.setState({ message: '' });
    }
  }

  getTimeFromTimestamp = (createdAt) => {
    var s = new Date(createdAt).toLocaleTimeString("en-US");
    return s;
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid style={{paddingLeft:'75px'}}>>
            <Row>
              <Col className="col-12 d-flex">
                <div className="chat-leftsidebar mr-lg-4">
                  <div>
                    <ul className="list-unstyled chat-list">
                      <PerfectScrollbar style={{ height: "410px" }} >
                        {
                          this.state.roomLastChats && this.state.roomLastChats.map((each, index) => {
                            const chatee = this.state.users.find(e => e.id == each.chateeId);
                            if (!chatee) return null;
                            return (
                              <li key={index} className={chatee.isActive ? "active" : ""}>
                                <Link to="#" onClick={() => { this.chatOpen(chatee) }}>
                                  <Media>
                                    {/* <div className="align-self-center mr-3">
                                      <i className={chatee.status === "online"
                                        ? "mdi mdi-circle text-success font-size-10"
                                        : "mdi mdi-circle font-size-10"
                                      }></i>
                                    </div> */}
                                    <div className="align-self-center mr-3">
                                      <img src={chatee.img ? chatee.img : defaultUserImg} className="rounded-circle avatar-sm" alt="" />
                                    </div>

                                    <Media className="overflow-hidden" body>
                                      <h5 className="text-truncate font-size-14 mb-1">{chatee.name ? chatee.name : 'User'}</h5>
                                      <p className="text-truncate mb-0">{each.lastChat.text}</p>
                                    </Media>
                                    <div className="font-size-11">{this.getTimeFromTimestamp(each.lastChat.createdAt)}</div>
                                  </Media>
                                </Link>
                              </li>
                            )
                          })
                        }
                      </PerfectScrollbar>
                    </ul>
                  </div>
                </div>

                <div className="w-100 user-chat">
                  <Card>
                    <div className="chat-conversation p-3 align-content-end">
                      <ul className="list-unstyled">
                        <PerfectScrollbar containerRef={(ref) => { this._chatAreaScrollBarRef = ref; }} style={{ height: "660px" }}>
                          {/* <li>
                            <div className="chat-day-title">
                              <span className="title">Today</span>
                            </div>
                          </li> */}

                          {
                            this.state.chats.map((chat, index) => {
                              const isMe = chat.user._id == this.state.user.id ? true : false;
                              const chateeImg = this.state.chatee.img ? this.state.chatee.img : defaultUserImg;
                              return (
                                <li key={index} className={isMe ? "right" : ""}>
                                  <div className="conversation-list">
                                    {
                                      isMe ?
                                        (
                                          <div className="ctext-wrap">
                                            <p>
                                              {chat.text}
                                            </p>
                                            <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> {this.getTimeFromTimestamp(chat.createdAt)}</p>
                                          </div>
                                        )
                                        :
                                        (
                                          <Media>
                                            <div className="ctext-wrap ml-2">
                                              <img src={chateeImg} className="rounded-circle avatar-xs" alt="" />
                                              <p>
                                                {chat.text}
                                              </p>
                                              <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> {this.getTimeFromTimestamp(chat.createdAt)}</p>
                                            </div>
                                          </Media>
                                        )
                                    }
                                  </div>
                                </li>
                              )
                            })
                          }

                        </PerfectScrollbar>
                      </ul>
                    </div>

                    <div className="p-3 chat-input-section">
                      <Row>
                        <Col>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control chat-input" placeholder="Enter Message..."
                              value={this.state.message}
                              onChange={(e) => { this.setState({ message: e.target.value }) }}
                              onKeyPress={(e) => { if (e.key === 'Enter') this.sendMessage() }}
                            />
                            {/* <div className="chat-input-links">
                              <ul className="list-inline mb-0">
                                <li className="list-inline-item">
                                  <Link to="#">
                                    <i className="mdi mdi-emoticon-happy-outline" id="Emojitooltip"></i>
                                    <UncontrolledTooltip placement="top" target="Emojitooltip">
                                      Emojis
                                                                                </UncontrolledTooltip >
                                  </Link>
                                </li>
                                <li className="list-inline-item">
                                  <Link to="#">
                                    <i className="mdi mdi-file-image-outline" id="Imagetooltip"></i>
                                    <UncontrolledTooltip placement="top" target="Imagetooltip">
                                      Images
                                                                                </UncontrolledTooltip >
                                  </Link>
                                </li>
                                <li className="list-inline-item">
                                  <Link to="#">
                                    <i className="mdi mdi-file-document-outline" id="Filetooltip"></i>
                                    <UncontrolledTooltip placement="top" target="Filetooltip">
                                      Add Files
                                                                                </UncontrolledTooltip >
                                  </Link>
                                </li>
                              </ul>
                            </div> */}
                          </div>
                        </Col>
                        <Col className="col-auto">
                          <Button type="button" color="primary" onClick={() => this.sendMessage()} className="btn-rounded chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block mr-2">Send</span> <i className="mdi mdi-send"></i></Button>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </div>

              </Col>
            </Row>

          </Container>

        </div>
      </React.Fragment >
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
})(withRouter(Chat));

