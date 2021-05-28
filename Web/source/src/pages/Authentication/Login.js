import React, { Component } from 'react';

import { Row, Col, CardBody, Card, Alert, Container, Button } from "reactstrap";

import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { AvForm, AvField } from 'availity-reactstrap-validation';

import { loginUser, apiError } from '../../store/actions';

import logo from "../../assets/images/logo.png";

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {}

    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  handleValidSubmit(event, values) {
    this.props.loginUser(values, this.props.history);    
  }

  componentDidMount() {// already login => other tab window => redirect
    // let storeUser = this.props.auth.user;
    // let role = storeUser && storeUser.role;
    // if(!role){
    //   let storageUser = JSON.parse(localStorage.getItem("authUser"));
    //   role = storageUser && storageUser.role;
    // }
    
    // if (role === 'business') this.props.history.push('/profile');
    // else if (role === 'admin') this.props.history.push('/admin/reports');
  }

  componentDidUpdate(){// login => redux => update => redirect
    if (this.props.auth.user.role === 'business') this.props.history.push('/profile');
    else if (this.props.auth.user.role === 'admin') this.props.history.push('/admin/reports');
  }

  renderLoading = () => {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{backgroundColor: 'transparent', width: '100vw', height: '100vh', position: 'absolute'}}>
        <div className="spinner-border text-primary m-1" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  render() {

    return (
      <React.Fragment>
        {
          this.props.auth.loading && this.renderLoading()
        }
        <div className="m-0 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#313131', height: '100vh' }}>
          <div style={{ width: '20%', minWidth: '300px' }}>
            <div className="d-flex justify-content-center align-items-center">
              <img src={logo} alt="" className="" height="200" />
            </div>
            <div className="d-flex justify-content-center align-items-center my-4">
              <span className="text-white"><b>Login</b></span>
            </div>
            <div className="">
              <AvForm className="form-horizontal" onValidSubmit={this.handleValidSubmit}>

                {this.props.auth.error ? <Alert color="danger">{this.props.auth.error}</Alert> : null}

                <div className="form-group">
                  <AvField name="email" label="" value="" className="form-control" placeholder="Email" type="email" required />
                </div>

                <div className="form-group">
                  <AvField name="password" label="" value="" placeholder="Password" type="password" required />
                </div>

                <div className="custom-control custom-checkbox d-flex justify-content-center">
                  <input type="checkbox" className="custom-control-input" id="customControlInline" />
                  <label className="custom-control-label text-white" htmlFor="customControlInline">Remember me</label>
                </div>

                <div className="mt-3">
                  <Button className="waves-effect waves-light w-100 font-weight-bold" color="#f7d907" type="submit" style={{ backgroundColor: '#f7d907' }}>Log In</Button>
                </div>

              </AvForm>
            </div>

          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStatetoProps, { loginUser, apiError })(Login));

