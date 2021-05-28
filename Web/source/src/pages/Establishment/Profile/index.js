import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Button } from "reactstrap";
import { TabContent, TabPane, Collapse, NavLink, NavItem, Nav } from "reactstrap";
import classnames from "classnames";

import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import StarRatings from 'react-star-ratings';

import { getData, setData } from '../../../store/actions';

import defaultUserImg from "../../../assets/images/defaultUserImg.png";

import { Icons } from '../../../constants';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      business: '',
      reviews: [],
      reports: []
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
    let user = this.props.auth.user;
    if (!user) {
      user = JSON.parse(localStorage.getItem("authUser"));
    }

    let business = prevProps.data.business.length > 0 && prevProps.data.business.find((each) => each.id == user.bid);
    if (prevState.business != business) {
      this.setState({ business: business })
    }

    if (!business) return;
    let services = this.props.data.services.filter((each) => each.bid == business.id);
    let sids = [];
    services.forEach(each => {
      sids.push(each.id);
    })
    let reviews = this.props.data.reviews.filter((each) => each.bid == business.id || sids.includes(each.sid));

    if (prevState.reviews.length == reviews.length && prevState.reviews.every((each, index) => each === reviews[index])) return;
    this.setState({ reviews: reviews });

    let reports = this.props.data.reports;
    if (prevState.reports.length == reports.length && prevState.reports.every((each, index) => each === reports[index])) return;
    this.setState({ reports: reports });
  } 

  getReviewUser = (id) => {
    let reviewUser = this.props.data.users.find((each) => each.id == id);
    return reviewUser;
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  onAcceptReview = (review) => {
    if (review.status === 'accepted') return;

    //update business rating value
    if (review.bid) {
      var bReviews = this.props.data.reviews.filter(each => each.status === 'accepted' && each.bid == review.bid)
      var bRating = 0;
      bReviews.forEach(each => {
        bRating += each.bRating;
      })
      // console.log(bReviews)
      
      bRating += review.bRating;
      bRating = bRating / (bReviews.length + 1);
      // console.log('brating updated', bRating)

      var { business } = this.state;
      business.rating = bRating;
      this.props.setData('business', 'update', this.props.data.business, business);
    }

    //update service rating value
    if (review.sid) {
      var sReviews = this.props.data.reviews.filter(each => each.status === 'accepted' && each.sid == review.sid)
      var sRating = 0;
      sReviews.forEach(each => {
        sRating += each.sRating;
      })      
      sRating += review.sRating;
      sRating = sRating / (sReviews.length + 1);

      var service = this.props.data.services.find(each => each.id == review.sid);
      service.rating = sRating;
      this.props.setData('services', 'update', this.props.data.services, service);
    }

    //update review status
    review.status = 'accepted';
    this.props.setData('reviews', 'update', this.props.data.reviews, review);
  }

  onReportReview = (review) => {
    if (review.status === 'reported') return;

    review.status = 'reported';
    this.props.setData('reviews', 'update', this.props.data.reviews, review);

    let user = this.props.auth.user;
    if (!user) {
      user = JSON.parse(localStorage.getItem("authUser"));
    }
    var report = {
      uid: user.id,
      rid: review.id
    }
    this.props.setData('reports', 'add', this.props.data.reports, report);
  }

  render() {
    if (!this.state.business) return null;
    return (
      <React.Fragment>
        <div className="page-content">
          <Container style={{paddingLeft:'75px'}}>
            <Row>
              <Col className="col-md-4 col-xs-12">
                <Card className="mb-0">
                  <Row className="no-gutters align-items-center">
                    <Col className="col-12">
                      <CardImg className="img-fluid p-3" src={this.state.business.img} alt="No Image" style={{ borderRadius: 25 }} />
                    </Col>
                    <Col className="col-12">
                      <CardBody className="pt-0">
                        <CardText className="font-size-20 mb-0"><b>{this.state.business.name}</b></CardText>
                        <div className="d-flex">
                          <StarRatings
                            rating={this.state.business.rating}
                            starRatedColor="#F1B44C"
                            starEmptyColor="#2D363F"
                            numberOfStars={5}
                            name='rating'
                            starDimension="14px"
                            starSpacing="3px"
                          />
                          <CardText className="ml-2 mt-1">{this.state.business.rating.toFixed(1)}</CardText>
                        </div>
                        <div className="d-flex my-1 align-items-center">
                          <i className={`${Icons.location} font-size-14 mr-2`}></i>
                          <span>{this.state.business.address}</span>
                        </div>
                        <div className="d-flex my-1 align-items-center">
                          <i className={`${Icons.domain} font-size-14 mr-2`}></i>
                          <span>{this.state.business.site}</span>
                        </div>
                        <div className="d-flex my-1 align-items-center">
                          <i className={`${Icons.phone} font-size-14 mr-2`}></i>
                          <span>{this.state.business.phone}</span>
                        </div>
                        <div className="d-flex my-1 align-items-center">
                          <i className={`${Icons.timer} font-size-14 mr-2`}></i>
                          <span>{this.state.business.operatingHours.from} - {this.state.business.operatingHours.to}</span>
                        </div>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col className="col-md-8 col-xs-12" style={{ backgroundColor: '#ffffff' }}>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: this.state.activeTab === "1"
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      INFORMATION
                        </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      REVIEWS {`(${this.state.reviews.length})`}
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1" className="p-3">
                    <Row>
                      <Col className="col-12">
                        <CardText>
                          {this.state.business.desc}
                        </CardText>
                      </Col>
                    </Row>
                    {/* <hr /> */}
                    <div className="d-flex justify-content-end" style={{ marginTop: 510 }}>
                      <Link to={{ pathname: '/profile/edit', state: { business: this.state.business } }}>
                        <Button
                          color="#f7d907"
                          className="btn waves-effect waves-light "
                          style={{ backgroundColor: '#f7d907' }}
                        >
                          <b>EDIT PROFILE</b>
                        </Button>
                      </Link>
                    </div>
                  </TabPane>
                  <TabPane tabId="2" className="p-3">
                    {
                      this.state.reviews.map((each, index) => {
                        let reviewUser = this.getReviewUser(each.uid);
                        if(!reviewUser) return null;
                        return (
                          <div key={index}>
                            <Row>
                              <Col className="col-12">
                                <Row>
                                  <Col className="col-4 d-flex">
                                    <CardImg src={reviewUser.img ? reviewUser.img : defaultUserImg} alt="No Image" className="profileImg ml-2 rounded-circle avatar-sm border border-white" style={{ width: 40, height: 40 }} />
                                    <Col>
                                      <Col className="col-12 px-0">
                                        <span className="text-info"><b>{reviewUser.name}</b></span>
                                      </Col>
                                      <Col className="col-12 px-0 d-flex">
                                        <StarRatings
                                          rating={each.type === 'business' ? each.bRating : each.sRating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name='rating'
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {
                                          each.type === 'business' &&
                                          <CardText className="ml-2">{each.bRating}</CardText>
                                        }
                                        {
                                          each.type === 'service' &&
                                          <CardText className="ml-2">{each.sRating}</CardText>
                                        }
                                      </Col>
                                    </Col>
                                  </Col>
                                  <Col className="col-4">
                                    <CardTitle>{each.type}</CardTitle>
                                  </Col>
                                  <Col className="col-4 d-flex justify-content-end">
                                    {
                                      (each.status === 'ready' || each.status === 'accepted') &&
                                      <Button
                                        color="#f7d907"
                                        className="btn waves-effect waves-light mr-3"
                                        style={{ backgroundColor: '#f7d907' }}
                                        onClick={() => this.onAcceptReview(each)}
                                      >
                                        <b>{each.status === 'ready' ? 'ACCEPT' : each.status === 'accepted' ? 'ACCEPTED' : ''}</b>
                                      </Button>
                                    }
                                    {
                                      (each.status == 'ready' || each.status === 'reported') &&
                                      <Button
                                        color="#e03930"
                                        className="btn waves-effect waves-light text-white mr-3"
                                        style={{ backgroundColor: '#e03930' }}
                                        onClick={() => this.onReportReview(each)}
                                      >
                                        <b>{each.status === 'ready' ? 'REPORT' : each.status === 'reported' ? 'REPORTED' : 'REPORT'}</b>
                                      </Button>
                                    }
                                  </Col>
                                </Row>
                                <Row>
                                  <Col className="col-12 px-4 py-3">
                                    {
                                      each.type === 'business' &&
                                      <CardText>{each.bDesc}</CardText>
                                    }
                                    {
                                      each.type === 'service' &&
                                      <CardText>{each.sDesc}</CardText>
                                    }
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            {
                              index < this.state.reviews.length - 1 &&
                              <hr className="mt-0" />
                            }
                          </div>
                        )
                      })
                    }
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
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
})(withRouter(Profile));

