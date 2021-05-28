import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Button } from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getData, setData } from '../../../store/actions';

import { Icons } from '../../../constants';

import RatingTooltip from 'react-rating-tooltip';

import noImg from "../../../assets/images/noImg.jpg";
import PostViewModal from './components/PostViewModal';

class SocialUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: []
    }
  }

  componentDidMount() {
    this.props.getData('services');
  }

  componentDidUpdate(prevProps, prevState) {
    let user = this.props.auth.user;
    if (!user) {
      user = JSON.parse(localStorage.getItem("authUser"));
    }

    if (!prevProps.data.success && this.props.data.success) {
      this.props.getData('services');
    }

    let services = this.props.data.services.filter((each) => each.bid == user.bid);
    if (prevState.services.length == services.length && prevState.services.every((each, index) => each === services[index])) return;
    this.setState({ services: services });
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
          <div className="d-flex align-items-center">
            <Button
              color='#f7d907'
              className="btn waves-effect waves-light"
              style={{ backgroundColor: '#f7d907', width: 85 }}
              onClick={() => { }}
            >
              <b className="text-dark">ADD</b>
            </Button>
          </div>
        </div> */}
        <div className="page-content">
          <Container>
            <div className="d-flex justify-content-center">
              <div className="w-50">
                {
                  this.state.services.map((each, index) => (
                    <MediaCard key={index} media={each} />
                  ))
                }
              </div>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

class MediaCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPostOpen: false,
    }
  }

  togglePost = () => {
    this.setState({ isPostOpen: !this.state.isPostOpen });
  }

  render() {
    return (
      <React.Fragment>
        <div onClick={() => this.togglePost()}>
          <div className="modal-header d-flex align-items-center bg-white">
            <div className="d-flex align-items-center">
              <CardImg className="img-fluid rounded-circle" src={this.props.media.img ? this.props.media.img : noImg} alt="No Image" style={{ width: 40, height: 40 }} />
              <div className="mx-2">
                <span className="text-info font-size-16">{this.props.media.name}</span>
                <br />
                <span className="font-size-12"><i className={`${Icons.location} mr-2`}></i>{this.props.media.address}</span>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <RatingTooltip
                max={5}
                defaultRating={this.props.media.rating}
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
              <span className="mt-3" style={{ marginLeft: -10 }}>{this.props.media.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="modal-body p-0 bg-white">
            <CardImg className="img-fluid" src={this.props.media.img ? this.props.media.img : noImg} alt="No Image" />
            <CardBody className="px-3 mb-3">
              <div>{this.props.media.about}</div>
            </CardBody>
          </div>
        </div>

        <Modal
          isOpen={this.state.isPostOpen}
          toggle={this.togglePost}
          centered={true}
        >
          <PostViewModal media={this.props.media} />
        </Modal>
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
  getData
})(withRouter(SocialUpdate));
