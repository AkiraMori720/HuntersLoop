import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, CardHeader, Collapse, Modal, Container, Button } from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import StarRatings from 'react-star-ratings';

import { getData, setData } from '../../../store/actions';

import { Icons } from '../../../constants';

import ServiceViewModal from "./components/ServiceViewModal";

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      business: '',
      services: [],
      categories: [],
      categoryCollapses: [],
      previewModal: false,
      previewService: ''
    }
  }

  componentDidMount() {
    this.props.getData('business');
    this.props.getData('services');
    this.props.getData('categories');
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
    if (prevState.services.length != services.length) {//mounting, refreshing 
      this.setState({
        business: business,
        services: services
      })
    }

    var categories = this.props.data.categories;
    if (prevState.categories.length != categories.length) {
      this.setState({ categories: categories });

      var categoryCollapses = [];
      categories.forEach((each, index) => {
        var item = {
          id: each.id,
          collapse: true
        }
        categoryCollapses.push(item);
      })
      this.setState({ categoryCollapses: categoryCollapses });
    }

    if (prevProps.data.success != this.props.data.success && this.props.data.success) {//return after adding, deleting or edit
      this.props.getData('services');
    }
  }

  toggleCollapse = (category) => {
    var { categoryCollapses } = this.state;
    var collapseItem = categoryCollapses.find(each => each.id == category.id);
    collapseItem.collapse = !collapseItem.collapse;

    var collapseItemIndex = categoryCollapses.findIndex(each => each.id == category.id);
    categoryCollapses.splice(collapseItemIndex, 1, collapseItem);
    this.setState({ categoryCollapses: categoryCollapses });
  }

  togglePreviewModal = () => {
    this.setState({ previewModal: !this.state.previewModal });
  }

  onIcon = (icon, service) => {
    if (icon === 'eye') {
      this.setState({previewService: service});
      this.togglePreviewModal();
    }
    else if (icon === 'edit') {
      this.props.history.push('/services/edit', { serviceId: service.id })
    }
    else if (icon === 'delete') {
      var { services } = this.props.data;
      services.splice(services.findIndex(each => each.id == service.id), 1);
      this.props.setData('services', 'delete', services, service);
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
          {
            this.props.data.loading && this.renderLoading()
          }
          <Container fluid style={{paddingLeft:'75px'}}>
            <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
              <div className="d-flex align-items-center">
                <Button
                  color='#f7d907'
                  className="btn waves-effect waves-light"
                  style={{ backgroundColor: '#f7d907', width: 85 }}
                  onClick={() => this.props.history.push('/services/add')}
                >
                  <b className="text-dark">ADD</b>
                </Button>
              </div>
            </div>
            <Row>
              <div className="col-md-4 col-xs-12">
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
                          <CardText className="ml-2 mt-1">{this.state.business.rating?.toFixed(1)}</CardText>
                        </div>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </div>

              <Col className="col-md-8 col-xs-12" style={{ backgroundColor: '#ffffff' }}>
                {/* <CardHeader id="headingOne" className="pb-0" onClick={this.toggleHuntersGuide} style={{ backgroundColor: '#ffffff', cursor: 'pointer' }}>
                  <CardTitle>Hunters Guide</CardTitle>
                  <hr className="my-1" />
                </CardHeader> */}

                {
                  this.state.categories.map((each, index) => {
                    let collapseItem = this.state.categoryCollapses.find(e => e.id == each.id);
                    let isOpen = collapseItem?.collapse;
                    let categoryServices = this.state.services.filter(e => e.cid == each.id);
                    let serviceCount = categoryServices.length;
                    if (serviceCount == 0) return;

                    return (
                      <div key={index}>
                        <CardTitle className="text-secondary px-3 py-3" onClick={() => this.toggleCollapse(each)} style={{ cursor: "pointer" }}>
                          {
                            isOpen ?
                              <i className={`${Icons.arrowDown} font-size-16 mr-2`}></i>
                              :
                              <i className={`${Icons.arrowRight} font-size-16 mr-2`}></i>
                          }
                          {each.name.toUpperCase()} ({serviceCount})
                        </CardTitle>
                        <Collapse isOpen={isOpen}>
                          <Row id="table-header" className="px-4 mt-2 mb-1">
                            <Col className="col-2 font-size-11"><i><b>Title</b></i></Col>
                            <Col className="col-4 font-size-11"><i><b>DESCRIPTION</b></i></Col>
                            <Col className="col-3 font-size-11"><i><b>HUNTING SEASON</b></i></Col>
                            <Col className="col-1 font-size-11"><i><b>DETAILS</b></i></Col>
                            <Col className="col-2 font-size-11"><i><b>ACTIONS</b></i></Col>
                          </Row>
                          {
                            this.state.services && this.state.services.map((eachService, index) => {
                              if (eachService.cid != each.id) return null;
                              return (
                                <div key={index} className="px-4">
                                  <Row id="table-body" className="text-secondary">
                                    <Col className="col-2">{eachService.name}</Col>
                                    <Col className="col-4">{eachService.about}</Col>
                                    <Col className="col-3">{eachService.season.from} ~ {eachService.season.to}</Col>
                                    <Col className="col-1 d-flex align-items-center">
                                        <i className={`${Icons.profile} mr-1`}></i>
                                        <span>{eachService.hunters}</span>
                                        <i className={`${Icons.calendar} ml-3 mr-1`}></i>
                                        <span>{eachService.days}</span>
                                    </Col>
                                    <Col className="col-2 px-2 d-flex justify-content-around align-items-center">
                                      <i className={`${Icons.eye} font-size-14 mr-1`} style={{ cursor: "pointer" }} onClick={() => this.onIcon('eye', eachService)}></i>
                                      <i className={`${Icons.pencil} font-size-14 mr-1`} style={{ cursor: "pointer" }} onClick={() => this.onIcon('edit', eachService)}></i>
                                      <i className={`${Icons.trash} font-size-14 text-danger`} style={{ cursor: "pointer" }} onClick={() => this.onIcon('delete', eachService)}></i>
                                    </Col>
                                  </Row>
                                  <hr className="my-2" />                                  
                                </div>
                              )
                            })
                          }
                        </Collapse>
                      </div>
                    )
                  })
                }
              </Col>
            </Row>
            <ServiceViewModal isOpen={this.state.previewModal} toggle={this.togglePreviewModal} service={this.state.previewService} />
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
})(withRouter(Services));

