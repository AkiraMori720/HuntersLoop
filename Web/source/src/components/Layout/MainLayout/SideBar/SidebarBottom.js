import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser, apiError } from '../../../../store/actions';

import { Icons } from '../../../../constants';

class SidebarBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onLogout = () => {
    this.props.logoutUser(); 
    this.props.history.push('/login')
  }

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu" style={{paddingBottom: 10}}>
          <ul className="metismenu list-unstyled" id="side-menu">
            <hr className="my-1" />
            <li>
              <Link to="#" className="waves-effect" onClick={()=>this.onLogout()}>
                <i className={`${Icons.signout} font-size-14`}></i>
                <span>Log Out</span>
              </Link>
            </li>
          </ul>          
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

export default connect(mapStatetoProps, { logoutUser, apiError })(withRouter(SidebarBottom));
