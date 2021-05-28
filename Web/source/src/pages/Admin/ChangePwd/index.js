import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Media, Button, Alert } from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { forgetPassword } from '../../../store/actions';

class ChangePwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      alertShow: false,
    }
  }

  validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(this.state.email);
  }

  onChange = (e) => {
    this.setState({ email: e.target.value });
  }

  onSend = () => {
    if (!this.validateEmail()) {
      alert('Email is not validate.');
      return;
    }

    this.props.forgetPassword(this.state.email);

    this.setState({
      alertShow: true
    });
  }

  render() {    
    return (
      <React.Fragment>
        <div className="page-content">

          {this.props.auth.error ? <Alert color="danger">{this.props.auth.error}</Alert> : null}

          <Container>
            <CardBody className="bg-white" style={{ borderBottom: '2px solid #eee' }}>

              <div className="form-group row justify-content-center">
                <label htmlFor="example-password-input" className="col-md-2 col-form-label text-right">Your Email Address</label>
                <div className="col-4">
                  <input className="form-control" type="text" defaultValue="" onChange={(e) => this.onChange(e)} />
                </div>
              </div>

              {
                this.state.alertShow &&
                <Alert color="warning">Please check email inbox. Follow the link to reset password</Alert>
              }
            </CardBody>

            <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
              <div className="d-flex align-items-center">
                <Button
                  color='#f7d907'
                  className="btn waves-effect waves-light"
                  style={{ backgroundColor: '#f7d907', width: 120 }}
                  onClick={() => this.onSend()}
                >
                  <b className="text-dark">SEND RESET</b>
                </Button>
              </div>
            </div>
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
  forgetPassword
})(withRouter(ChangePwd));

