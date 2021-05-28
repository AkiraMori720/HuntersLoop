import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Media, Button } from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import SweetAlert from 'react-bootstrap-sweetalert';

import { getData, setData } from '../../../store/actions'

import defaultUserImg from '../../../assets/images/defaultUserImg.png';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      business: [],
      services: [],
      reviews: [],
      reports: [],

      successAlert: false,
      successAlertText: '',
      errorAlert: false,
      errorAlertText: ''
    }
  }

  componentDidMount() {
    this.props.getData('users');
    this.props.getData('business');
    this.props.getData('services');
    this.props.getData('reviews');
    this.props.getData('reports');
  }

  componentDidUpdate(prevProps, prevState) {
    let users = prevProps.data.users;
    if (users && prevState.users.length != users.length) {
      this.setState({ users: users });
    }

    let business = prevProps.data.business;
    if (business && prevState.business.length != business.length) {
      this.setState({ business: business });
    }

    let services = prevProps.data.services;
    if (services && prevState.services.length != services.length) {
      this.setState({ services: services })
    }

    let reviews = prevProps.data.reviews;
    if (reviews && prevState.reviews.length != reviews.length) {
      this.setState({ reviews: reviews });
    }

    let reports = prevProps.data.reports;
    if (reports && prevState.reports.length != reports.length) {
      this.setState({ reports: reports });
    }

    //////////////////////////////
    if (!prevProps.data.success && this.props.data.success) {
      this.setState({ successAlert: true });
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({ errorAlert: true });
    }
  }

  getBusinessUserFromReport = (report) => {
    var businessUser = this.state.users.find(each => each.id == report.uid);
    return businessUser;
  }

  getReviewUserFromReport = (report) => {
    var review = this.state.reviews.find(each => each.id == report.rid);
    if(!review) return;
    var user = this.state.users.find(each => each.id == review.uid);
    return user;
  }

  // for detail page
  getReviewContentFromReport = () => {
    var review = this.state.reviews.find(each => each.id == this.props.location.state.report.rid);
    return review ? review.bDesc : '';
  }

  onBanUser = () => {
    var review = this.state.reviews.find(each => each.id == this.props.location.state.report.rid);
    var user = this.state.users.find(each => each.id == review.uid);
    user.active = user.active ? false : true;
    this.props.setData('users', 'update', this.props.users, user);

    this.setState({
      successAlertText: 'User has banned.',
      errorAlertText: 'Ban has failed.'
    })    
  }

  onDeletePost = () => {
    var review = this.state.reviews.find(each => each.id == this.props.location.state.report.rid);
    this.props.setData('reviews', 'delete', this.props.data.reviews, review);

    this.setState({
      successAlertText: 'Posted Review has deleted.',
      errorAlertText: 'Delete has failed.'
    })    
  }

  renderDetail = () => {
    const user = this.getReviewUserFromReport(this.props.location.state.report);
    if(!user) return;    
    const userImg = user && user.img ? user.img : defaultUserImg;
    const userName = user && user.name ? user.name : '';
    
    return (
      <>
        <CardBody className="bg-white" style={{ borderBottom: '2px solid #eee' }}>
          <Row>
            <Col className="col-12 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <CardImg className="img-fluid rounded-circle" src={userImg} alt="No Image" style={{ width: 40, height: 40, border: '2px solid #f7d907' }} />
                <CardText className="mx-3">{userName}</CardText>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <Button className="rounded bg-danger d-flex justify-content-center align-items-center" color="danger" style={{ width: 120 }} onClick={() => { this.onBanUser() }}>{user.active ? 'BAN THIS USER' : 'LIFT BAN'}</Button>
                <Button className="rounded bg-danger d-flex justify-content-center align-items-center ml-3" color="danger" style={{ width: 120 }} onClick={() => { this.onDeletePost() }}>DELETE POST</Button>
              </div>
            </Col>
          </Row>
        </CardBody>
        <CardBody className="bg-white">
          <Row>
            <Col>
              {this.getReviewContentFromReport()}
            </Col>
          </Row>
        </CardBody>
      </>
    )
  }

  renderList = () => {    
    return (
      <>
        {
          this.state.reports.map((each, index) => {
            if(!each) return;
            const businessUser = this.getBusinessUserFromReport(each);
            const businessUserImg = businessUser && businessUser.img ? businessUser.img : defaultUserImg;
            const businessUserName = businessUser && businessUser.name ? businessUser.name : '';
            const reviewUser = this.getReviewUserFromReport(each);
            if(!reviewUser) return;
            const reviewUserName = reviewUser && reviewUser.name ? reviewUser.name : '';

            return (
              <CardBody key={index} className="bg-white" style={{ borderBottom: '2px solid #eee', cursor: "pointer" }}>
                <Row onClick={() => this.props.history.push('/admin/reports/detail', { report: each })}>
                  <Col className="col-10 d-flex align-items-center">
                    <CardImg className="img-fluid rounded-circle" src={businessUserImg} alt="No Image" style={{ width: 40, height: 40, border: '2px solid #f7d907' }} />
                    <CardText className="mx-3"><b>{businessUserName}</b> reported <b>{reviewUserName}</b></CardText>
                  </Col>
                  <Col className="col-2 d-flex justify-content-center align-items-center">
                    <CardText>{each.createdAt}</CardText>
                  </Col>
                </Row>
              </CardBody>
            )
          })
        }
        {
          this.state.reports.length == 0 &&
          <CardBody className="d-flex justify-content-center align-items-center">
            <CardTitle>NO REPORTS</CardTitle>
          </CardBody>
        }
      </>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">

          {this.state.successAlert &&
            <SweetAlert
              title={this.state.successAlertText}
              onConfirm={() => {this.setState({ successAlert: false }); this.props.history.push('/admin/reports')}}
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
              this.props.match.path === '/admin/reports/detail' && this.renderDetail()
            }
            {
              this.props.match.path === '/admin/reports' && this.renderList()
            }
          </Container>
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
})(withRouter(Reports));

