import React, { Component } from "react";
import {
  Col, Row, Card, CardBody, CardTitle, CardSubtitle, Container
} from 'reactstrap';

import MetisMenu from "metismenujs";

import { Link, Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';

import { connect } from "react-redux";

import { getData, setData } from '../../../../store/actions';
import { Icons } from '../../../../constants';

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideMenuCollapsed: false,
      user: '',
      business: '', //sidebar item for only business
      memberships: [] //sidebar item for only business
    };
  }

  componentDidMount() {
    this.initMenu();
    this.checkSideMenu();

    //when logged in, redux store is filled
    let user = this.props.auth.user;
    //when refresh, redux store value is deleted
    if (!user) {
      user = JSON.parse(localStorage.getItem("authUser"));
    }
    if (user) {
      this.setState({ user: user });
    }

    this.props.getData('business');
    this.props.getData('memberships');
  }

  componentDidUpdate(prevProps, prevState) {
    let business = prevProps.data.business.length > 0 && prevProps.data.business.find((each) => each.id == this.state.user?.bid);
    if (prevState.business != business) {
      this.setState({ business: business })
    }

    let memberships = this.props.data.memberships;
    if (memberships && prevState.memberships.length != memberships.length) {
      this.setState({ memberships: memberships });
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname.includes(items[i].pathname)) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      const parent = matchingMenuItem.parentElement;

      if (parent) {
        parent.classList.add("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.add("mm-show");

          const parent3 = parent2.parentElement;

          if (parent3) {
            parent3.classList.add("mm-active"); // li
            parent3.childNodes[0].classList.add("mm-active"); //a
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.add("mm-active");
            }
          }
        }
      }
    }
  }

  checkSideMenu() {
    var isSideMenuCollapsed = document.body.classList.contains("sidebar-enable", "vertical-collpsed");
    this.setState({
      isSideMenuCollapsed: isSideMenuCollapsed
    });
  }

  renderAdminMenu() {
    return (
      <ul className="metismenu list-unstyled" id="side-menu">
        <li>
          <Link to="/admin/reports" className="waves-effect">
            <i className={`${Icons.reports} font-size-14`}></i>
            <span>Reports</span>
          </Link>
        </li>
        <hr className="my-1" />
        <li>
          <Link to="/admin/users/all" className="waves-effect">
            <i className={`${Icons.allUsers} font-size-14`}></i>
            <span>All Users</span>
          </Link>
        </li>
        <hr className="my-1" />
        <li>
          <Link to="/admin/users/banned" className="waves-effect">
            <i className={`${Icons.bannedUsers} font-size-14`}></i>
            <span>Banned Users</span>
          </Link>
        </li>
        <hr className="my-1" />
        <li>
          <Link to="/admin/businessaccounts" className="waves-effect">
            <i className={`${Icons.businessAccounts} font-size-14`}></i>
            <span>Business Accounts</span>
          </Link>
        </li>
        {/* <hr className="my-1" />
        <li>
          <Link to="/admin/pricing" className="waves-effect">
            <i className={`${Icons.pricing} font-size-14`}></i>
            <span>Pricing</span>
          </Link>
        </li> */}
        <hr className="my-1" />
        <li>
          <Link to="/admin/changepwd" className="waves-effect">
            <i className={`${Icons.changePwd} font-size-14`}></i>
            <span>Change Password</span>
          </Link>
        </li>
        <hr className="my-1" />
      </ul>
    )
  }

  renderBusinessMenu() {
    let isPro = false;
    let mid = this.state.business?.mid;
    if (mid) {
      var membership = this.state.memberships.find(each => each.id == mid);
      if (membership) {
        isPro = membership.level.toLowerCase().includes('pro')
      }
    }

    return (
      <ul className="metismenu list-unstyled" id="side-menu">
        <li>
          <Link to="/profile" className="waves-effect">
            <i className={`${Icons.profile} font-size-14`}></i>
            <span>Profile</span>
          </Link>
        </li>
        <hr className="my-1" />
        <li>
          <Link to="/services" className="waves-effect">
            <i className={`${Icons.services} font-size-14`}></i>
            <span>Services</span>
          </Link>
        </li>
        <hr className="my-1" />
        <li>
          <Link to="/chat" className="waves-effect">
            <i className={`${Icons.messages} font-size-14`}></i>
            <span>Messages</span>
          </Link>
        </li>
        <hr className="my-1" />
        {
          isPro &&
          <>
            <li>
              <Link to="/socialupdate" className="waves-effect">
                <i className={`${Icons.socialUpdate} font-size-14`}></i>
                <span>Social Update<span className="text-danger">(PRO)</span></span>
              </Link>
            </li>
            <hr className="my-1" />
          </>
        }
        {/* <li>
          <Link to="/settings" className="waves-effect">
            <i className={`${Icons.settings} font-size-14`}></i>
            <span>Settings</span>
          </Link>
        </li>
        <hr className="my-1" /> */}
      </ul>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu" className="p-0" style={{overflow:'hidden'}}>
          {
            (this.props.auth.user.role === 'admin' || JSON.parse(localStorage.getItem("authUser")).role === 'admin') && this.renderAdminMenu()
          }
          {
            (this.props.auth.user.role === 'business' || JSON.parse(localStorage.getItem("authUser")).role === 'business') && this.renderBusinessMenu()
          }
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
  getData
})(withRouter(SidebarContent));
