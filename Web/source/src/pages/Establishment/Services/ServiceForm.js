import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Button, Form, Alert } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";

import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { getData, setData } from '../../../store/actions';

import RichTextEditor from 'react-rte';

import { Icons } from '../../../constants';
import Logo from '../../../assets/images/logo.png';

import ServiceViewModal from './components/ServiceViewModal';
import ImageUploader from '../../../helpers/image_uploader';

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method: this.props.match.path === '/services/add' ? 'add' : this.props.match.path === '/services/edit' ? 'edit' : '',
      service: {
        name: '',
        img: '',
        cid: '',
        address: '',
        about: '',
        guide: '',
        days: '1',
        hunters: '1',
        price: '',
        isContactPrice: false,
        rating: 0,
        season: {
          from: '',
          to: ''
        },
        detailImgs: [],
        hunterImg: '',
        hunterDesc: '',
        terms: ''
      },
      categories: [],

      previewModal: false,
      aboutTxt: RichTextEditor.createValueFromString('', 'html'),
      guideTxt: RichTextEditor.createValueFromString('', 'html'),

      successAlert: false,
      successAlertTxt: "Publish Success!",

      errorAlert: false,
      errorAlertTxt: "Error!",

    }
  }

  componentDidMount() {
    this.props.getData('services');
    this.props.getData('categories');
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('prev props loading', prevProps.data.loading)
    // console.log('now props loading', this.props.data.loading)        
    if (prevProps.data.services != this.props.data.services) {
      if (this.state.method === 'edit') {
        let service = prevProps.data.services.find(each => each.id == this.props.location.state.serviceId);
        this.setState({ service: service });

        this.setState({
          aboutTxt: RichTextEditor.createValueFromString(service.about, 'html'),
          guideTxt: RichTextEditor.createValueFromString(service.guide, 'html'),
        })
      }
    }

    var categories = this.props.data.categories;
    if (prevState.categories.length != categories.length) {
      this.setState({ categories: categories });
    }

    /////////////////
    if (!prevProps.data.success && this.props.data.success) {
      this.setState({ successAlert: true });
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({ errorAlert: true });
    }
  }

  onChangeEditor = (value, field) => {
    var { service } = this.state;
    service[field] = value.toString('html').replace(/<[^>]+>/g, '');
    this.setState({ service: service });

    if (field == 'about') {
      this.setState({
        aboutTxt: value
      })
    }
    else if (field == 'guide') {
      this.setState({
        guideTxt: value
      })
    }
  }

  onChangeField = (e, field) => {
    var { service } = this.state;
    if(field == 'isContactPrice') service[field] = e.target.checked;
    else service[field] = e.target.value;
    this.setState({ service: service });    
  }

  onChangeSeason = (e, field) => {
    var { service } = this.state;
    service.season[field] = e.target.value;
    this.setState({ service: service });
  }

  togglePreviewModal = () => {
    this.setState({ previewModal: !this.state.previewModal });
  }

  onPublish = () => {
    if (!this.state.service.name) {
      this.setState({
        errorAlert: true,
        errorAlertTxt: "Please enter hunt title!"
      })
      return;
    }

    var { services } = this.props.data;
    if (this.state.method === 'add') {
      var service = { ...this.state.service };
      var bid = JSON.parse(localStorage.getItem("authUser")).bid;
      service.bid = bid;

      if (!service.cid) service.cid = this.state.categories[0].id;

      services.push(this.state.service);
      this.props.setData('services', 'add', services, service);
    }
    else if (this.state.method === 'edit') {
      services.splice(services.findIndex(each => each.id == this.state.service.id), 1, this.state.service);
      this.props.setData('services', 'update', services, this.state.service);
    }
  }

  renderLoading = () => {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: 'transparent', width: '80%', height: '80vh', position: 'absolute', zIndex: 1005 }}>
        <div className="spinner-border text-primary m-1" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid style={{paddingLeft:'75px'}}>
            {
              this.props.data.loading && this.renderLoading()
            }
            {this.state.successAlert &&
              <SweetAlert
                title={this.state.successAlertTxt}
                onConfirm={() => {
                  this.setState({ successAlert: false }, () => {
                    this.props.history.push('/services');
                  })
                }}
              ></SweetAlert>
            }
            {this.state.errorAlert &&
              <SweetAlert
                title={this.state.errorAlertTxt}
                onConfirm={() => this.setState({ errorAlert: false })}
              >
                {" "}
                <span>{this.props.data.error}</span>
              </SweetAlert>
            }
            <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
              <div className="d-flex align-items-center">
                <Button
                  color='#f7d907'
                  className="btn waves-effect waves-light"
                  style={{ backgroundColor: '#f7d907' }}
                  onClick={() => this.togglePreviewModal()}
                >
                  <b className="text-dark">PREVIEW</b>
                </Button>
              </div>
              <div className="d-flex align-items-center ml-3">
                <Button
                  color='#f7d907'
                  className="btn waves-effect waves-light"
                  style={{ backgroundColor: '#f7d907' }}
                  onClick={() => this.onPublish()}
                >
                  <b className="text-dark">PUBLISH</b>
                </Button>
              </div>
            </div>

            {
              this.state.service &&
              <>
                <Row>
                  <Col className="col-md-6">
                    <Card>
                      <CardBody>
                        <div className="form-group row">
                          <label className="col-md-3 col-form-label">Hunt Category<span className="text-danger">*</span></label>
                          <div className="col-md-9">
                            <select className="form-control" value={this.state.service.cid} onChange={(e) => this.onChangeField(e, 'cid')}>
                              {
                                this.state.categories.map((each, index) => (
                                  <option key={index} value={each.id}>{each.name.toUpperCase()}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-md-3 col-form-label">Hunt Title<span className="text-danger">*</span></label>
                          <div className="col-md-9">
                            <input className="form-control" type="text" defaultValue={`${this.state.service.name}`} onChange={(e) => this.onChangeField(e, 'name')} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-md-3 col-form-label">Address</label>
                          <div className="col-md-9">
                            <input className="form-control" type="text" defaultValue={`${this.state.service.address}`} onChange={(e) => this.onChangeField(e, 'address')} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-md-3 col-form-label">About the hunt</label>
                          <div className="col-md-9">
                            {/* <RichTextEditor value={this.state.aboutTxt} onChange={(value) => this.onChangeEditor(value, 'about')} placeholder='Please write here...' /> */}
                            <textarea className="form-control" id="about" rows="6" defaultValue={this.state.service.aboutTxt} onChange={(e) => this.onChangeField(e, 'about')}></textarea>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-md-3 col-form-label">Hunting Guidelines</label>
                          <div className="col-md-9">
                            {/* <RichTextEditor value={this.state.guideTxt} onChange={(value) => this.onChangeEditor(value, 'guide')} placeholder="Please write here..." /> */}
                            <textarea className="form-control" id="guide" rows="6" defaultValue={this.state.service.guideTxt} onChange={(e) => this.onChangeField(e, 'guide')}></textarea>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-md-3 col-form-label">Hunt Duration (day/s)<span className="text-danger">*</span></label>
                          <div className="col-md-9">
                            <select className="form-control" value={this.state.service.days} onChange={(e) => this.onChangeField(e, 'days')}>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-md-3 col-form-label">Hunt per package<span className="text-danger">*</span></label>
                          <div className="col-md-9">
                            <select className="form-control" value={this.state.service.hunters} onChange={(e) => this.onChangeField(e, 'hunters')}>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-md-3 col-form-label">Package Price ($)</label>
                          <div className="col-md-9">
                            <input className="form-control" type="text" defaultValue={this.state.service.price} placeholder="" onChange={(e) => this.onChangeField(e, 'price')} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-md-3 col-form-label"></label>
                          <div className="col-md-9 d-flex">
                            <input id="contactPrice" className="form-control" type="checkbox" style={{ width: 18, height: 18 }} checked={this.state.service.isContactPrice} onChange={(e)=>this.onChangeField(e, 'isContactPrice')} />
                            <label className="ml-2" htmlFor="contactPrice">Contact guide for package price</label>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-date-input" className="col-md-3 col-form-label">Hunting Season</label>
                          <div className="col-md-9 d-flex px-0">
                            <div className="col-6">
                              <input className="form-control" type="date" defaultValue={this.state.service.season.from} id="season-from" onChange={(e) => this.onChangeSeason(e, 'from')} />
                            </div>
                            <div className="col-6">
                              <input className="form-control" type="date" defaultValue={this.state.service.season.to} id="season-to" onChange={(e) => this.onChangeSeason(e, 'to')} />
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col className="col-md-6">
                    <Card>
                      <CardBody>
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-md-3 col-form-label">Service Image</label>
                          <div className="col-md-9">
                            {
                              this.state.service.img &&
                              <CardImg className="img-fluid" src={this.state.service.img} alt="No Image" style={{width: 400, height: 200}} />
                            }
                            <ImageUploader folder='services' setImageUrl={(url) => {
                              var service = { ...this.state.service };
                              service.img = url;
                              this.setState({ service: service })
                            }} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-md-3 col-form-label">Detail Images</label>
                          <div className="col-md-9 d-flex row">
                            {
                              [0, 1, 2, 3].map((each, index) => {
                                var src = this.state.service.detailImgs && this.state.service.detailImgs.length > 0 && this.state.service.detailImgs[each] ? this.state.service.detailImgs[each] : Logo;
                                return (
                                  <div key={index} className="col-md-3 col-xs-12 d-flex flex-column justify-content-between" style={{ minHeight: 120, maxHeight: 120 }}>
                                    <CardImg className="img-fluid" src={src} alt="No Image" style={{ width: '100%', height: 90 }} />
                                    <ImageUploader folder='details' setImageUrl={(url) => {
                                      var service = { ...this.state.service };
                                      service.detailImgs[each] = url;
                                      this.setState({ service: service })
                                    }} />
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-md-3 col-form-label">Terms and Conditions</label>
                          <div className="col-md-9">
                            <textarea className="form-control" id="information" rows="6" defaultValue={this.state.service.terms} onChange={(e) => this.onChangeField(e, 'terms')}></textarea>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <ServiceViewModal isOpen={this.state.previewModal} toggle={this.togglePreviewModal} service={this.state.service} />
              </>
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
})(withRouter(ServiceForm));

