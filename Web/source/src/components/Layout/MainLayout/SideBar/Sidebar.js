import React, { Component } from "react";

import { connect } from "react-redux";

import { withRouter } from 'react-router-dom';

import { } from "../../../../store/actions";

//Simple bar
import SimpleBar from "simplebar-react";

import SidebarContent from "./SidebarContent";
import SidebarBottom from "./SidebarBottom";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="vertical-menu d-flex flex-column justify-content-between" >
          <div data-simplebar>
            {this.props.type !== "condensed" ?
              (
                <SimpleBar style={{ maxHeight: "100%" }}>
                  <SidebarContent />
                </SimpleBar>
              )
              :
              <SidebarContent />
            }
          </div>
          <div data-simplebar>
            {this.props.type !== "condensed" ?
              (
                <SimpleBar style={{ maxHeight: "100%" }}>
                  <SidebarBottom />
                </SimpleBar>
              )
              :
              <SidebarBottom />
            }
          </div>          
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    // layout: state.Layout
  };
};
export default connect(mapStatetoProps, {})(withRouter(Sidebar));
