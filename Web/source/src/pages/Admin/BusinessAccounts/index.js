import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Media, Button } from "reactstrap";

import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import SweetAlert from 'react-bootstrap-sweetalert';
import RatingTooltip from 'react-rating-tooltip';

import { getData, setData } from '../../../store/actions'

import { Icons } from '../../../constants';
import defaultLogoImg from '../../../assets/images/logo.png';
import noImg from '../../../assets/images/noImg.jpg';

class BusinessAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      business: [],
      services: [],
      memberships: [],

      keyword: '',

      successAlert: false,
      successAlertText: '',
      errorAlert: false,
      errorAlertText: '',
      operation: ''
    }
  }

  componentDidMount() {
    this.props.getData('users');
    this.props.getData('business');
    this.props.getData('services');
    this.props.getData('memberships');
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

    let memberships = prevProps.data.memberships;
    if (memberships && prevState.memberships.length != memberships.length) {
      this.setState({ memberships: memberships })
    }

    //////////////////////////////
    if (!prevProps.data.success && this.props.data.success) {
      this.setState({ successAlert: true });
      this.props.getData('business');
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({ errorAlert: true });
    }
  }

  onDeactivate = (business) => {
    business.active = false;
    this.props.setData('business', 'update', this.state.business, business);

    this.setState({
      successAlertText: 'Account deactivated.',
      errorAlertText: 'Account deactivate error.'
    });
  }

  onActivate = (business) => {
    business.active = true;
    this.props.setData('business', 'update', this.state.business, business);

    this.setState({
      successAlertText: 'Account activated.',
      errorAlertText: 'Account activate error.'
    });
  }

  onApproveRequest = (business) => {
    business.status = 'approved';
    this.props.setData('business', 'update', this.state.business, business);

    this.setState({
      successAlertText: 'Business Request approved.',
      errorAlertText: 'Business Request error.',
      operation: 'approve account'
    });
  }

  onDeleteRequest = (business) => {
    business.status = 'deleted';
    this.props.setData('business', 'update', this.state.business, business);

    this.setState({
      successAlertText: 'Business Request deleted.',
      errorAlertText: 'Business delete error.',
      operation: 'delete request'
    });
  }

  renderBusinessAccounts = () => {
    var filtered = this.state.business.filter(each => each.name.toLowerCase().includes(this.state.keyword.toLowerCase()) && each.status === 'approved');
    return (
      <Container>
        {
          filtered.map((each, index) => {
            return (
              <CardBody key={index} className="bg-white" style={{ borderBottom: '2px solid #eee' }}>
                <Row>
                  <Col className="col-10 d-flex align-items-center" onClick={() => { }}>
                    <CardImg className="img-fluid rounded-circle" src={each.icon ? each.icon : each.img ? each.img : defaultLogoImg} alt="No Image" style={{ width: 40, height: 40, border: '2px solid #f7d907' }} />
                    <CardText className="mx-3">{each.name}</CardText>
                  </Col>
                  <Col className="col-2 d-flex align-items-center px-0">
                    <Button className="rounded d-flex justify-content-center align-items-center" color="#f7d907" style={{ backgroundColor: "#f7d907" }} onClick={() => this.props.history.push('/admin/businessaccounts/view', { bid: each.id })}>
                      <span>VIEW</span>
                    </Button>
                    {
                      each.active &&
                      <Button className="rounded d-flex justify-content-center align-items-center ml-3" color="e03930" style={{ backgroundColor: "#e03930", width: 105 }} onClick={() => this.onDeactivate(each)}>
                        <span className="text-white">DEACTIVATE</span>
                      </Button>
                    }
                    {
                      !each.active &&
                      <Button className="rounded d-flex justify-content-center align-items-center ml-3" color="0db51a" style={{ backgroundColor: "#0db51a", width: 105 }} onClick={() => this.onActivate(each)}>
                        <span className="text-white">ACTIVATE</span>
                      </Button>
                    }
                  </Col>
                </Row>
              </CardBody>
            )
          })
        }

        <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
          <div className="d-flex align-items-center">
            <Button
              color='#f7d907'
              className="btn waves-effect waves-light"
              style={{ backgroundColor: '#f7d907' }}
              onClick={() => this.props.history.push('/admin/businessaccounts/requests')}
            >
              <b className="text-dark">VIEW ACCOUNT REQUESTS</b>
            </Button>
            <div className="form-group row ml-1 mb-0">
              <div className="col-md-3">
                <input className="form-control" type="text" defaultValue='' placeholder='Search' style={{ width: 200 }} onChange={(e) => this.setState({ keyword: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  renderBusinessAccountView = () => {
    if (this.props.data.business.length == 0) return;
    const bid = this.props.location.state.bid;
    const business = this.state.business.find(each => each.id == bid);
    const membership = this.state.memberships.find(each => each.id == business.mid);
    const services = this.state.services.filter(each => each.bid == bid);
    if (!business) return;

    return (
      <Container>
        <Row>
          <Col className="col-3">
            <CardBody className="bg-white">
              <CardImg className="img-fluid" src={business.img} alt="No Image" style={{ borderRadius: 10 }} />
              <CardTitle className="mt-3">{business.name}</CardTitle>
              <CardText className="d-flex justify-content-between">{membership?.level}<i className="text-success">${membership?.price}</i></CardText>
              <CardText><i className={`${Icons.location}`}></i><span className="ml-2">{business.address}</span></CardText>
              <CardText><i className={`${Icons.domain}`}></i><span className="ml-2">{business.site}</span></CardText>
              <CardText><i className={`${Icons.phone}`}></i><span className="ml-2">{business.phone}</span></CardText>
              <CardText><i className={`${Icons.timer}`}></i><span className="ml-2">{business.operatingHours.from} - {business.operatingHours.to}</span></CardText>
            </CardBody>
          </Col>
          <Col className="col-9">
            {
              services.map((each, index) => {
                return (
                  <div key={index} className="mb-3">
                    <CardBody className="bg-white w-75">
                      <div className="modal-header border-0 d-flex align-items-center bg-white p-0">
                        <div className="d-flex align-items-center">
                          <div className="mx-2">
                            <span className="text-info font-size-16">{each.name}</span>
                            <br />
                            <span className="font-size-12"><i className={`${Icons.location} mr-2`}></i>{each.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="modal-body p-0 bg-white mt-3">
                        <CardImg className="img-fluid" src={each.img ? each.img : noImg} alt="No Image" style={{ height: 300 }} />
                        <CardTitle className="d-flex justify-content-between align-items-center mt-3">
                          <span className="text-success font-size-18"><b>${each.price}</b></span>
                          <span className="">{each.days} days, {each.hunters} {each.hunters > 1 ? 'hunters' : 'hunter'}</span>
                        </CardTitle>
                        <CardText>
                          <span>{each.about}</span>
                        </CardText>
                        <CardText>
                          <span><b>Hunting Season:</b></span>
                          <span>{each.season.from} to {each.season.to}</span>
                        </CardText>
                        <hr />
                        <CardTitle className="d-flex justify-content-between align-items-center">
                          {/* <span className="text-info font-size-12" style={{ cursor: "pointer" }}><b>VIEW SERVICE</b></span> */}
                          <div className="d-flex justify-content-end align-items-center" style={{ marginTop: -18 }}>
                            <RatingTooltip
                              max={5}
                              defaultRating={each.rating}
                              disabled={true}
                              // onChange={rate => {
                              //   var hunt = { ...each };
                              //   hunt.rating = rate;
                              //   this.setState({ each: hunt })
                              // }}
                              ActiveComponent={
                                <i
                                  key={"active_1"}
                                  className="mdi mdi-star font-size-16"
                                  style={{ color: '#f7d907' }}
                                />
                              }
                              InActiveComponent={
                                <i
                                  key={"active_01"}
                                  className="mdi mdi-star-outline text-muted font-size-16"
                                />
                              }
                            />
                            <span className="mt-3" style={{ marginLeft: -10 }}>{each.rating.toFixed(1)}</span>
                          </div>
                        </CardTitle>
                      </div>
                    </CardBody>

                  </div>
                )
              })
            }
          </Col>
        </Row>
      </Container>
    )
  }

  renderBusinessAccountRequests = () => {
    return (
      <Container>
        {
          this.props.data.business.map((each, index) => {
            if (each.status === 'approved' || each.status === 'deleted') return;
            return (
              <CardBody key={index} className="bg-white" style={{ borderBottom: '2px solid #eee' }}>
                <Row onClick={() => this.props.history.push('/admin/businessaccounts/requests/detail', { business: each })} style={{ cursor: "pointer" }}>
                  <Col className="col-10 d-flex align-items-center">
                    <CardImg className="img-fluid rounded" src={each.img ? each.img : noImg} alt="No Image" style={{ width: 200, height: 130 }} />
                    <CardBody>
                      <span className="font-size-16"><b>{each.name}</b></span>
                      <div className="d-flex align-items-center"><i className={`${Icons.location}`}></i><span className="ml-2">{each.address}</span></div>
                      <div className="d-flex align-items-center"><i className={`${Icons.domain}`}></i><span className="ml-2">{each.site}</span></div>
                      <div className="d-flex align-items-center"><i className={`${Icons.email}`}></i><span className="ml-2">{each.email}</span></div>
                    </CardBody>
                  </Col>
                  <Col className="col-2 d-flex align-items-center px-0">
                    <i>Request Date:</i>
                    <i className="ml-1">{each.requestDate}</i>
                  </Col>
                </Row>
              </CardBody>
            )
          })
        }
        {
          this.props.data.business.filter(each => each.status === 'ready').length == 0 &&
          <CardBody className="d-flex justify-content-center align-items-center">
            <CardTitle>NO REQUESTED BUSINESS</CardTitle>
          </CardBody>
        }
      </Container>
    )
  }

  renderBusinessAccountRequestDetail = () => {
    const business = this.props.location.state.business;
    if (!business) return;
    const membership = this.state.memberships.find(each => each.id == business.mid);
    const user = this.state.users.find(each => each.bid == business.id);

    return (
      <Container>
        <CardBody>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Business Logo</label>
            <div className="col-md-4">
              <CardImg className="img-fluid" src={business.img ? business.img : noImg} alt="No Image" style={{ borderRadius: 10 }} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Business Name</label>
            <div className="col-md-6">
              <input className="form-control" type="text" disabled={true} defaultValue={business.name} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Address</label>
            <div className="col-md-6">
              <input className="form-control" type="text" disabled={true} defaultValue={business.address} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-tel-input" className="col-md-2 col-form-label text-right">Contact number</label>
            <div className="col-md-6">
              <input className="form-control" type="tel" disabled={true} defaultValue={business.phone} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-email-input" className="col-md-2 col-form-label text-right">Email</label>
            <div className="col-md-6">
              <input className="form-control" type="email" disabled={true} defaultValue={business.email} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-url-input" className="col-md-2 col-form-label text-right">Website</label>
            <div className="col-md-6">
              <input className="form-control" type="url" disabled={true} defaultValue={business.site} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Subscription Plan</label>
            <div className="col-md-6">
              <input className="form-control" type="text" disabled={true} defaultValue={membership ? membership.level : ''} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Username</label>
            <div className="col-md-6">
              <input className="form-control" type="text" disabled={true} defaultValue={user?.name} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Temporary Password</label>
            <div className="col-md-6">
              {/* <input className="form-control" type="text" defaultValue={business.tempPwd} /> */}
              <input className="form-control" type="text" disabled={true} defaultValue={'123456'} />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="example-time-input" className="col-md-2 col-form-label text-right">Operating Hours</label>
            <div className="col-md-6 d-flex px-0">
              <div className="col-md-6">
                <input className="form-control" type="text" disabled={true} defaultValue={business.operatingHours.from} id="operating-hour-input-from" />
              </div>
              <div className="col-md-6">
                <input className="form-control" type="text" disabled={true} defaultValue={business.operatingHours.to} id="operating-hour-input-to" />
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="example-tel-input" className="col-md-2 col-form-label text-right">Information</label>
            <div className="col-md-6">
              <textarea className="form-control" id="information" rows="10" disabled={true} defaultValue={business.desc}></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
            <div className="d-flex align-items-center">
              <Button
                color='#f7d907'
                className="btn waves-effect waves-light"
                style={{ backgroundColor: '#f7d907' }}
                onClick={() => { this.onApproveRequest(business) }}
              >
                <b className="text-dark">
                  {
                    (this.state.operation === 'approve account' && this.props.data.loading) && <i className="bx bx-loader bx-spin font-size-18 align-middle mr-2"></i>
                  }
                  APPROVE ACCOUNT</b>
              </Button>
              <Button
                color='#e03930'
                className="btn waves-effect waves-light ml-2"
                style={{ backgroundColor: '#e03930' }}
                onClick={() => { this.onDeleteRequest(business) }}
              >
                <b className="text-white">
                  {
                    (this.state.operation === 'delete request' && this.props.data.loading) && <i className="bx bx-loader bx-spin font-size-18 align-middle mr-2"></i>
                  }
                  DELETE REQUEST</b>
              </Button>

            </div>
          </div>
        </CardBody>
      </Container>
    )
  }

  render() {
    if (this.props.data.loading && this.props.match.path === '/admin/businessaccounts') {
      return (
        <React.Fragment>
          <div className="page-content d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary m-1" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>
          <div className="page-content">

            {this.state.successAlert &&
              <SweetAlert
                title={this.state.successAlertText}
                onConfirm={() => {
                  this.setState({ successAlert: false });
                  if (this.state.operation === 'approve account') {
                    this.setState({ operation: '' }, () => {
                      this.props.history.push('/admin/businessaccounts/');
                    })
                  }
                  if (this.state.operation === 'delete request') {
                    this.setState({ operation: '' }, () => {
                      this.props.history.push('/admin/businessaccounts/');
                    })
                  }
                }}
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

            {
              this.props.match.path === '/admin/businessaccounts' && this.renderBusinessAccounts()
            }
            {
              this.props.match.path === '/admin/businessaccounts/view' && this.renderBusinessAccountView()
            }
            {
              this.props.match.path === '/admin/businessaccounts/requests' && this.renderBusinessAccountRequests()
            }
            {
              this.props.match.path === '/admin/businessaccounts/requests/detail' && this.renderBusinessAccountRequestDetail()
            }
          </div>
        </React.Fragment>
      );
    }
  }
}

const mapStatetoProps = state => {
  return {
    ...state
  };
};

export default connect(mapStatetoProps, {
  getData, setData
})(withRouter(BusinessAccounts));

