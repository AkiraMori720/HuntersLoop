import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, CardHeader, Collapse, Modal, Container, Button } from "reactstrap";

import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import RatingTooltip from "react-rating-tooltip";
import SweetAlert from "react-bootstrap-sweetalert";

import { setData } from '../../../../store/actions';

import { Icons } from '../../../../constants';
import noImg from '../../../../assets/images/noImg.jpg';

class PostViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: this.props.media,

      successAlert: false,
      successAlertTxt: "Update Success!",

      errorAlert: false,
      errorAlertTxt: "Error!",
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.data.success && this.props.data.success) {
      this.setState({ successAlert: true });
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({ errorAlert: true });
    }
  }

  onPost = () => {
    if(!this.state.media.about){      
      this.setState({
        errorAlert: true,
        errorAlertTxt: "Please enter content"
      })
      return;
    }

    var services = this.props.data.services;
    this.props.setData('services', 'update', services, this.state.media);
  }

  onChangePost = (e) => {
    var media = { ...this.state.media }
    media.about = e.target.value;
    this.setState({ media: media });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.successAlert &&
          <SweetAlert
            title={this.state.successAlertTxt}
            onConfirm={() => this.setState({ successAlert: false })}
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
        <div className="modal-header d-flex align-items-center bg-white">
          <div className="d-flex align-items-center">
            <CardImg className="img-fluid rounded-circle" src={this.state.media.img ? this.state.media.img : noImg} alt="No Image" style={{ width: 40, height: 40 }} />
            <div className="mx-2">
              <span className="text-info font-size-16">{this.state.media.name}</span>
              <br />
              <span className="font-size-12"><i className={`${Icons.location} mr-2`}></i>{this.state.media.address}</span>
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <RatingTooltip
              max={5}
              defaultRating={this.state.media.rating}
              disabled={true}
              onChange={rate => { }}
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
            <span className="mt-3" style={{ marginLeft: -10 }}>{this.state.media.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="modal-body p-0 bg-white">
          <CardImg className="img-fluid" src={this.state.media.img ? this.state.media.img : noImg} alt="No Image" />
          <CardBody className="px-1">
            <div className="col-md-12">
              <input className="form-control" type="text" defaultValue={`${this.state.media.about}`} onChange={(e) => this.onChangePost(e)} />
            </div>
          </CardBody>
          <div className="d-flex justify-content-center">
            <Button
              color='#f7d907'
              className="btn waves-effect waves-light mb-2"
              style={{ backgroundColor: '#f7d907' }}
              onClick={() => this.onPost()}
            >
              <b className="text-dark">POST UPDATE</b>
            </Button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStatetoProps = state => {
  return {
    ...state
  };
};

export default connect(mapStatetoProps, {
  setData
})(withRouter(PostViewModal));
