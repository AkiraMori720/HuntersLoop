import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Button } from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getData, setData } from '../../../store/actions';
import Geocode from 'react-geocode';

import ImageUploader from '../../../helpers/image_uploader';
import { convertTimeFormat24To12, convertTimeFormat12To24 } from '../../../helpers/Util';

import Logo from '../../../assets/images/logo.png';

// Geocode.setApiKey('AIzaSyCXg_J1ks_msg13-5W8-xisC6zT6F3KW58');
// Geocode.setApiKey('AIzaSyAdx1b_1BqKtSNSg04CssVVd5I5O-JiBbM');
Geocode.setApiKey('AIzaSyDdPAhHXaBBh2V5D2kQ3Vy7YYrDrT7UW3I');
Geocode.setRegion("es");

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      business: this.props.location.state.business,
      successAlert: false,
      errorAlert: false
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.data.success && this.props.data.success) {
      this.setState({ successAlert: true });
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({ errorAlert: true });
    }
  }

  onChangeField = (e, field) => {
    var { business } = this.state;
    business[field] = e.target.value;
    this.setState({ business: business });

    if (field == 'address') {      
      Geocode.fromAddress(e.target.value)
        .then((response) => {
          const location = response.results[0].geometry.location;
          console.log(location);
          var {business} = this.state;
          business.location.latitude = location.lat;
          business.location.longitude = location.lng;
          this.setState({business: business});
        },
          error => {
            console.log(error);
          }
        )
        .catch(err=>{
          console.log('api error', err)
        })
    }
  }

  onChangeHours = (e, kind) => {
    var value = convertTimeFormat24To12(e.target.value);
    var { business } = this.state;
    business.operatingHours[kind] = value;
    this.setState({ business: business });
  }

  onUpdate = () => {
    var { business } = this.props.data;
    this.props.setData('business', 'update', business, this.state.business);
  }

  renderLoading = () => {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ backgroundColor: 'transparent', width: '80%', height: '80vh', position: 'absolute', zIndex: 1005 }}>
        <div className="spinner-border text-primary m-1" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </Container>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          {
            this.props.data.loading && this.renderLoading()
          }
          {this.state.successAlert &&
            <SweetAlert
              title="Publish Success!"
              onConfirm={() => this.setState({ successAlert: false })}
            ></SweetAlert>
          }
          {this.state.errorAlert &&
            <SweetAlert
              title="Error!"
              onConfirm={() => this.setState({ errorAlert: false })}
            >
              {" "}
              <span>{this.props.data.error}</span>
            </SweetAlert>
          }
          <Row  style={{paddingLeft:'75px'}}>
            <Col>
              <Card>
                <CardBody>
                  <div className="form-group row">
                    <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Company Logo</label>
                    <div className="col-md-4">
                      <CardImg className="img-fluid" src={this.state.business.img} alt="No Image" style={{ borderRadius: 10, width: 400, height: 200 }} />
                      <ImageUploader folder='business' setImageUrl={(url) => {
                        var business = { ...this.state.business };
                        business.img = url;
                        this.setState({ business: business })
                      }} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Company Icon</label>
                    <div className="col-md-2">
                      <CardImg className="img-fluid" src={this.state.business.icon ? this.state.business.icon : Logo} alt="No Image" style={{ width: 50, height: 50, borderRadius: 25, border: '1px solid #eee', marginBottom: 10 }} />
                      <ImageUploader folder='business' setImageUrl={(url) => {
                        var business = { ...this.state.business };
                        business.icon = url;
                        this.setState({ business: business })
                      }} />
                    </div>
                  </div>
                  <div className="form-group row mt-5">
                    <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Slide Images</label>
                    <div className="col-md-6 d-flex row">
                      {
                        [0, 1, 2].map((each, index) => {
                          var src = this.state.business.slideImgs && this.state.business.slideImgs.length > 0 && this.state.business.slideImgs[each] ? this.state.business.slideImgs[each] : Logo;
                          return (
                            <div key={index} className="col-md-4 d-flex flex-column justify-content-between" style={{ minHeight: 130, maxHeight: 130 }}>
                              <CardImg className="img-fluid" src={src} alt="No Image" style={{ width: 200, height: 100, marginBottom: 10 }} />
                              <ImageUploader folder='details' setImageUrl={(url) => {
                                var business = { ...this.state.business };
                                business.slideImgs[each] = url;
                                this.setState({ business: business })
                              }} />
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className="form-group row mt-5">
                    <label htmlFor="example-text-input" className="col-md-2 col-form-label text-right">Address</label>
                    <div className="col-md-6">
                      <input className="form-control" type="text" defaultValue={`${this.state.business.address}`} onChange={(e) => this.onChangeField(e, 'address')} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="example-email-input" className="col-md-2 col-form-label text-right">Email</label>
                    <div className="col-md-6">
                      <input className="form-control" type="email" defaultValue={`${this.state.business.email}`} onChange={(e) => this.onChangeField(e, 'email')} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="example-url-input" className="col-md-2 col-form-label text-right">Website</label>
                    <div className="col-md-6">
                      <input className="form-control" type="url" defaultValue={`${this.state.business.site}`} onChange={(e) => this.onChangeField(e, 'site')} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="example-tel-input" className="col-md-2 col-form-label text-right">Phone number</label>
                    <div className="col-md-6">
                      <input className="form-control" type="tel" defaultValue={`${this.state.business.phone}`} onChange={(e) => this.onChangeField(e, 'phone')} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="example-time-input" className="col-md-2 col-form-label text-right">Operating Hours</label>
                    <div className="col-md-6 d-flex px-0">
                      <div className="col-md-6">
                        <input className="form-control" type="time" defaultValue={this.state.business.operatingHours.from ? convertTimeFormat12To24(this.state.business.operatingHours.from) : ''} id="operating-hour-input-from" onChange={(e) => this.onChangeHours(e, 'from')} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" type="time" defaultValue={this.state.business.operatingHours.to ? convertTimeFormat12To24(this.state.business.operatingHours.to) : ''} id="operating-hour-input-to" onChange={(e) => this.onChangeHours(e, 'to')} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="example-tel-input" className="col-md-2 col-form-label text-right">Information</label>
                    <div className="col-md-6">
                      <textarea className="form-control" id="information" rows="10" defaultValue={`${this.state.business.desc}`} onChange={(e) => this.onChangeField(e, 'desc')} ></textarea>
                    </div>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-end">
                    <Button
                      color="#f7d907"
                      className="btn waves-effect waves-light "
                      style={{ backgroundColor: '#f7d907' }}
                      onClick={() => this.onUpdate()}
                    >
                      <b>UPDATE PROFILE</b>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
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
  setData
})(withRouter(ProfileForm));

