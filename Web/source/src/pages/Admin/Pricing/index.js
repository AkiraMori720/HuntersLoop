import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Media, Button } from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import SweetAlert from 'react-bootstrap-sweetalert';

import { getData, setData } from '../../../store/actions'

import { Icons } from '../../../constants';

class Pricing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: [],
      addPlanModal: false,
      newMembershipLevel: '',
      newMembershipPrice: '',

      successAlert: false,
      successAlertText: '',
      errorAlert: false,
      errorAlertText: ''
    }
  }

  componentDidMount() {
    this.props.getData('memberships');
  }

  componentDidUpdate(prevProps, prevState) {
    let memberships = this.props.data.memberships;
    memberships.sort(function(a,b){return a.dispOrder - b.dispOrder});
    if (memberships && prevState.memberships.length != memberships.length) {      
      this.setState({ memberships: memberships });
    }

    //////////////////////////////
    if (!prevProps.data.success && this.props.data.success) {
      this.setState({ successAlert: true });
      this.props.getData('memberships');
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({ errorAlert: true });
    }
  }

  onChangePrice = (e, membership) => {
    membership.price = e.target.value;
    if (membership.price < 0) membership.price = 0;
    var priceStr = membership.price.toString();
    if (priceStr.charAt(0) == '0') {
      membership.price = '0';
    }
    
    var { memberships } = this.state;
    memberships.splice(memberships.findIndex(each => each.id == membership.id), 1, membership);
    this.setState({ memberships: memberships });
  }

  onSave = (membership) => {
    var price = Number(membership.price);
    if (isNaN(price)) {
      alert('Wrong price entered');
      return;
    }

    membership.price = price;
    this.props.setData('memberships', 'update', this.state.memberships, membership);

    this.setState({
      successAlertText: 'Membership updated.',
      errorAlertText: 'Membership update error.'
    });
  }

  onDelete = (membership) => {
    console.log(membership)
    this.props.setData('memberships', 'delete', this.state.memberships, membership);

    this.setState({
      successAlertText: 'Membership deleted.',
      errorAlertText: 'Membership delete error.'
    });

    // var { memberships } = this.state;
    // memberships.splice(memberships.findIndex(each => each.id == membership.id), 1);
    // this.setState({ memberships: memberships });
  }

  toggleModal = () => {
    this.setState({ addPlanModal: !this.state.addPlanModal });
  }

  onChangeFieldForAdd = (e, field) => {
    if (field === 'level') {
      this.setState({ newMembershipLevel: e.target.value });
    }
    if (field === 'price') {
      var { newMembershipPrice } = this.state;
      newMembershipPrice = e.target.value;      
      if (newMembershipPrice < 0) newMembershipPrice = 0;
      var priceStr = newMembershipPrice.toString();
      if (priceStr.charAt(0) == '0') {
        newMembershipPrice = '0';
      }

      this.setState({ newMembershipPrice: newMembershipPrice });
    }
  }

  addPlans = () => {
    var {newMembershipLevel} = this.state;
    var {newMembershipPrice} = this.state;
    if(!newMembershipLevel){
      alert('Please enter membership name.');
      return;
    }
    if(!newMembershipPrice){
      alert('Please enter membership price.');
      return;
    }
    if (isNaN(newMembershipPrice)) {
      alert('Wrong price entered');
      return;
    }

    newMembershipPrice = Number(newMembershipPrice);
    var newMembership = {level: newMembershipLevel, price: newMembershipPrice};
    this.props.setData('memberships', 'add', this.state.memberships, newMembership);

    this.setState({
      successAlertText: 'New Membership Added.',
      errorAlertText: 'Membership add error.'
    });

    this.setState({ addPlanModal: false });

    // var { memberships } = this.state;
    // memberships.push(newMembership);
    // this.setState({ memberships: memberships });
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
              <span>{this.props.data.error.toString()}</span>
            </SweetAlert>
          }

          <Container>
            <CardBody className="bg-white" style={{ borderBottom: '2px solid #eee' }}>

              {
                this.state.memberships.map((each, index) => (
                  <div key={index} className="form-group row justify-content-center align-items-center">
                    <label htmlFor="example-text-input" className="col-md-3 col-form-label text-right">{each.level} ($)</label>
                    <div className="col-4">
                      <input className="form-control" type="number" min={0} onChange={(e) => this.onChangePrice(e, each)} value={each.price} oninput="validity.valid||(value='');" />
                    </div>
                    <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center" style={{ width: 25, height: 25, cursor: "pointer" }} onClick={() => { this.onSave(each) }}>
                      <i className={`${Icons.save} text-white font-size-14`}></i>
                    </div>
                    {/* <div className="rounded-circle bg-danger d-flex justify-content-center align-items-center ml-2" style={{ width: 25, height: 25, cursor: "pointer" }} onClick={() => { this.onDelete(each) }}>
                      <i className={`${Icons.trash} text-white font-size-14`}></i>
                    </div> */}
                  </div>
                ))
              }

            </CardBody>

            {/* <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
              <div className="d-flex align-items-center">
                <Button
                  color='#f7d907'
                  className="btn waves-effect waves-light"
                  style={{ backgroundColor: '#f7d907', width: 100 }}
                  onClick={() => this.toggleModal()}
                >
                  <b className="text-dark">ADD PLANS</b>
                </Button>
              </div>
            </div> */}

          </Container>

          <Modal
            isOpen={this.state.addPlanModal}
            toggle={this.toggleModal}
            centered={true}
          >
            <React.Fragment>
              <div className="bg-white">
                <CardBody>
                  <div className="form-group row mt-3">
                    <label htmlFor="example-text-input" className="col-md-5 col-form-label text-right">Membership</label>
                    <div className="col-md-6">
                      <input className="form-control" type="text" defaultValue={this.state.newMembershipLevel} onChange={(e) => this.onChangeFieldForAdd(e, 'level')} />
                    </div>
                  </div>
                  <div className="form-group row mt-3">
                    <label htmlFor="example-text-input" className="col-md-5 col-form-label text-right">Membership Price ($)</label>
                    <div className="col-md-6">
                      <input className="form-control" type="number" min={0} onChange={(e) => this.onChangeFieldForAdd(e, 'price')} value={this.state.newMembershipPrice} />
                    </div>
                  </div>

                  <div className="d-flex justify-content-center mt-4">
                    <Button
                      color="#f7d907"
                      className="btn waves-effect waves-light "
                      style={{ backgroundColor: '#f7d907' }}
                      onClick={() => this.addPlans()}
                    >
                      <b>Add Membership Plan</b>
                    </Button>
                  </div>
                </CardBody>
              </div>
            </React.Fragment>
          </Modal>

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
})(withRouter(Pricing));

