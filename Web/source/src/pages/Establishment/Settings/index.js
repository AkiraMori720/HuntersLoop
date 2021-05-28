import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container } from "reactstrap";

import { withRouter } from "react-router-dom";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container>
            <Row>
              <Col className="col-12 d-flex justify-content-center align-items-center" >                
                <CardText className="font-size-24 mx-4">Here is <b>Settings</b></CardText>
              </Col>
            </Row>

          </Container>
          
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Settings);
