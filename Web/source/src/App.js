import React, { Component } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import { withRouter } from 'react-router-dom';

// Import Routes
import { publicRoutes, authProtectedRoutes, authProtectedAdminRoutes } from "./routes/";
import AppRoute from "./routes/route";

// layouts
import MainLayout from "./components/Layout/MainLayout/";
import NonAuthLayout from "./components/Layout/NonAuthLayout";

import "./assets/scss/theme.scss";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		//when logged in, redux store is filled
		let storeUser = this.props.auth.user;
		let role = storeUser && storeUser.role;
		//when refresh, redux store value is deleted
		if (!role) {
			let storageUser = JSON.parse(localStorage.getItem("authUser"));
			role = storageUser && storageUser.role;
		}

		return (
			<Switch>
				{publicRoutes.map((route, idx) => (
					<AppRoute
						path={route.path}
						exact={route.exact}
						layout={NonAuthLayout}
						component={route.component}
						key={idx}
						isAuthProtected={false}
					/>
				))}

				{role === 'business' && authProtectedRoutes.map((route, idx) => (
					<AppRoute
						path={route.path}
						exact={route.exact}
						layout={MainLayout}
						component={route.component}
						key={idx}
						isAuthProtected={true}
					/>
				))}

				{role === 'admin' && authProtectedAdminRoutes.map((route, idx) => (
					<AppRoute
						path={route.path}
						exact={route.exact}
						layout={MainLayout}
						component={route.component}
						key={idx}
						isAuthProtected={true}
					/>
				))}
			</Switch>
		);
	}
}

const mapStateToProps = state => {
	return {
		...state
	};
};

export default connect(mapStateToProps, null)(withRouter(App));
