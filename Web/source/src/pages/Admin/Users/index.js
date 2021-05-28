import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Media, Button } from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import SweetAlert from 'react-bootstrap-sweetalert';

import { getData, setData } from '../../../store/actions'

import defaultUserImg from '../../../assets/images/defaultUserImg.png';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      keyword: '',

      successAlert: false,
      successAlertText: '',
      errorAlert: false,
      errorAlertText: ''
    }
  }

  componentDidMount() {
    this.props.getData('users');
  }

  componentDidUpdate(prevProps, prevState) {
    let users = prevProps.data.users;
    if (users && prevState.users.length != users.length) {
      this.setState({ users: users });
    }

    //////////////////////////////
    if (!prevProps.data.success && this.props.data.success) {
      this.setState({ successAlert: true });
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({ errorAlert: true });
    }
  }

  onLiftBanUser = (user) => {
    user.active = true;
    this.props.setData('users', 'update', this.state.users, user);

    this.setState({
      successAlertText: 'User has lifted.',
      errorAlertText: 'Lift Ban has failed.'
    })
  }

  onBanUser = (user) => {
    user.active = false;
    this.props.setData('users', 'update', this.state.users, user);

    this.setState({
      successAlertText: 'User has banned.',
      errorAlertText: 'Ban has failed.'
    })
  }

  renderAllUsers = () => {
    var filtered = this.state.users.filter(each => each.name.toLowerCase().includes(this.state.keyword.toLowerCase()));
    var validUsers = filtered.filter(each => each.active && each.role != 'admin');
    return (
      <div>
        {
          validUsers.map((each, index) => (
            <CardBody key={index} className="bg-white" style={{ borderBottom: '2px solid #eee' }}>
              <Row>
                <Col className="col-10 d-flex align-items-center">
                  <CardImg className="img-fluid rounded-circle" src={each.img ? each.img : defaultUserImg} alt="No Image" style={{ width: 40, height: 40, border: '2px solid #f7d907' }} />
                  <CardText className="mx-3">{each.name ? each.name : ''}</CardText>
                </Col>
                <Col className="col-2 d-flex justify-content-end align-items-center pr-3">
                  <Button className="rounded d-flex justify-content-center align-items-center" color="#f7d907" style={{ backgroundColor: "#f7d907" }} onClick={()=>this.onBanUser(each)}>BAN THIS USER</Button>
                </Col>
              </Row>
            </CardBody>
          ))
        }
        {
          validUsers.length == 0 &&
          <CardBody className="d-flex justify-content-center align-items-center">
            <CardTitle>NO USERS</CardTitle>
          </CardBody>
        }
      </div>
    )
  }

  renderBannedUsers = () => {
    var filtered = this.state.users.filter(each => each.name.toLowerCase().includes(this.state.keyword.toLowerCase()));
    var bannedUsers = filtered.filter(each => each.active == false && each.role != 'admin');
    return (
      <div>
        {
          bannedUsers.map((each, index) => {
            return (
              <CardBody key={index} className="bg-white" style={{ borderBottom: '2px solid #eee' }}>
                <Row>
                  <Col className="col-10 d-flex align-items-center">
                    <CardImg className="img-fluid rounded-circle" src={each.img ? each.img : defaultUserImg} alt="No Image" style={{ width: 40, height: 40, border: '2px solid #f7d907' }} />
                    <CardText className="mx-3">{each.name ? each.name : ''}</CardText>
                  </Col>
                  <Col className="col-2 d-flex justify-content-end align-items-center pr-3">
                    <Button className="border-0 rounded" color="#000000" style={{ backgroundColor: "#f7d907" }} onClick={() => this.onLiftBanUser(each)}>LIFT BAN</Button>
                  </Col>
                </Row>
              </CardBody>
            )
          })
        }
        {
          bannedUsers.length == 0 &&
          <CardBody className="d-flex justify-content-center align-items-center">
            <CardTitle>NO BANNED USER</CardTitle>
          </CardBody>
        }
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">

          {this.state.successAlert &&
            <SweetAlert
              title={this.state.successAlertText}
              onConfirm={() => this.setState({ successAlert: false })}
            ></SweetAlert>
          }
          {this.state.errorAlert &&
            <SweetAlert
              title={this.state.errorAlertText}
              onConfirm={() => this.setState({ errorAlert: false })}
            >
              {" "}
              <span>{this.props.data.error}</span>
            </SweetAlert>
          }

          <Container>
            {
              this.props.match.path === '/admin/users/all' && this.renderAllUsers()
            }
            {
              this.props.match.path === '/admin/users/banned' && this.renderBannedUsers()
            }
          </Container>

          <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
            <div className="d-flex align-items-center">
              <div className="form-group row ml-1 mb-0">
                <div className="col-md-3">
                  <input className="form-control" type="text" defaultValue='' placeholder='Search' style={{ width: 200 }} onChange={(e) => this.setState({ keyword: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        </div>
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
  getData, setData
})(withRouter(Users));

