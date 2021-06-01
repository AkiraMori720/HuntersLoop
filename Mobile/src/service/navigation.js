import React from 'react';
import { CommonActions, StackActions } from '@react-navigation/native';

const navigationRef = React.createRef();
const routeNameRef = React.createRef();

function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}

function back() {
    navigationRef.current?.dispatch(CommonActions.goBack());
}

function replace(name, params) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
}

function getCurrentRoute() {
    return navigationRef.current;
}

export default {
    navigationRef,
    routeNameRef,
    back,
    navigate,
    replace,
    getCurrentRoute
};

// Gets the current screen from navigation state
export const getActiveRoute = (state) => {
    const route = state?.routes[state?.index];

    if (route?.state) {
        // Dive into nested navigators
        return getActiveRoute(route.state);
    }

    return route;
};

export const getActiveRouteName = state => getActiveRoute(state)?.name;