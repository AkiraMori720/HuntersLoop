import React, { Component } from "react";

import { withRouter } from "react-router-dom";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./SideBar/Sidebar";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftSideBarType: 'default',
      leftSideBarTheme: 'dark',
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };

    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidMount() {
    if (this.props.isPreloader === true) {
      document.getElementById('preloader').style.display = "block";
      document.getElementById('status').style.display = "block";

      setTimeout(function () {
        document.getElementById('preloader').style.display = "none";
        document.getElementById('status').style.display = "none";
      }, 2500);
    }
    else {
      document.getElementById('preloader').style.display = "none";
      document.getElementById('status').style.display = "none";
    }

    // Scroll Top to 0
    window.scrollTo(0, 0);
    let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    document.title = currentage;
    document.body.setAttribute("data-sidebar", this.state.leftSideBarTheme); // sidebar dark theme
    if (this.state.leftSideBarType === "default") {
      if (window.innerWidth < 1000) {
        this.toggleMenuCallback();
      }
    }
  }

  toggleMenuCallback = () => { // sidebar toggle
    if (this.state.leftSideBarType === "default") {
      this.setState({ leftSideBarType: "condensed" });
      document.body.classList.add("sidebar-enable");
      document.body.classList.add("vertical-collpsed");
    } else if (this.state.leftSideBarType === "condensed") {
      this.setState({ leftSideBarType: "default" });
      document.body.setAttribute("data-sidebar-size", "");
      document.body.classList.remove("sidebar-enable");
      document.body.classList.remove("vertical-collpsed");
    }
  };

  render() {
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
              <div className="chase-dot"></div>
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          <Header toggleMenuCallback={this.toggleMenuCallback} />
          <Sidebar
            type={this.state.leftSideBarType}
            isMobile={this.state.isMobile} />
          <div className="main-content">
            {this.props.children}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Layout);

