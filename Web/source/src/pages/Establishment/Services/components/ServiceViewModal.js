import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, CardHeader, Collapse, Modal, Container } from "reactstrap";

import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import RatingTooltip from "react-rating-tooltip";

import { setData } from '../../../../store/actions';

import { Icons } from '../../../../constants';
import noImg from '../../../../assets/images/noImg.jpg';

class ServiceViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount(){
  }

  componentDidUpdate(){
      
  }
  
  render() {   
    if(!this.props.service) return null;
    return (
      <React.Fragment>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          centered={true}
        >
          <div className="modal-header d-flex align-items-center">
            <div>
              <span className="text-info font-size-16">{this.props.service.name}</span>
              <br />
              <span className="font-size-12"><i className={`${Icons.location} mr-2`}></i>{this.props.service.address}</span>
            </div>
            <i className={`${Icons.bookmark} font-size-16`} style={{ color: '#676767', cursor: "pointer" }}></i>
          </div>
          <div className="modal-body p-0">
            <CardImg className="img-fluid" src={this.props.service.img ? this.props.service.img : noImg} alt="No Image" />
            <CardTitle className="d-flex justify-content-between align-items-center px-3 mt-2 mb-0">
              {
                this.props.service.isContactPrice ? 
                <span>Contact guide for package price</span>
                :
                <span className="text-success font-size-24">
                  {
                    this.props.service.price ? `$${this.props.service.price}` : ''
                  }                  
                </span>
              }
              <span>{this.props.service.days} {this.props.service.days < 2 ? 'Day' : 'Days'}, {this.props.service.hunters} {this.props.service.hunters < 2 ? 'Hunter' : 'Hunters'}</span>
            </CardTitle>
            <CardBody>
              <div>{this.props.service.guide}</div>
              <div className="mt-3"><b>Hunting Season:</b></div>
              <div><i>{this.props.service.season.from} to {this.props.service.season.to}</i></div>
              <div className="d-flex justify-content-end align-items-center mt-2">
                <RatingTooltip
                  max={5}
                  defaultRating={this.props.service.rating}
                  disabled={true}
                  onChange={rate => {
                    var { service } = this.state;
                    service.rating = rate;
                    this.setState({ service: service })
                  }}
                  ActiveComponent={
                    <i
                      key={"active_1"}
                      className="mdi mdi-star font-size-14"
                      style={{ color: '#f7d907' }}
                    />
                  }
                  InActiveComponent={
                    <i
                      key={"active_01"}
                      className="mdi mdi-star-outline text-muted font-size-14"
                    />
                  }
                />
                <span className="mt-3" style={{ marginLeft: -20 }}>{this.props.service.rating.toFixed(1)}</span>
              </div>
            </CardBody>
          </div>
        </Modal>
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
})(withRouter(ServiceViewModal));

