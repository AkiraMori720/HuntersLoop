import React, { memo, useEffect } from 'react';
import { NotifierRoot, Notifier, Easing } from 'react-native-notifier';

import NotifierComponent from './NotifierComponent';
import EventEmitter from '../../common/events';

export const INAPP_NOTIFICATION_EMITTER = 'NotificationInApp';
export const INAPP_NOTIFICATION_DURATION = 15000;

// Gets the current screen from navigation state
export const getActiveRoute = (state) => {
	const route = state?.routes[state?.index];

	if (route?.state) {
		// Dive into nested navigators
		return getActiveRoute(route.state);
	}

	return route;
};


const InAppNotification = memo(() => {
	const show = (message) => {
		const { notification, data } = message;
		// const state = Navigation.navigationRef.current?.getRootState();
		// const route = getActiveRoute(state);
		if (data.roomid) {
			Notifier.showNotification({
				showEasing: Easing.inOut(Easing.quad),
				Component: NotifierComponent,
				componentProps: {
					notification, data
				},
				duration: INAPP_NOTIFICATION_DURATION,
			});
		}
	};

	useEffect(() => {
		EventEmitter.addEventListener(INAPP_NOTIFICATION_EMITTER, show);
		return () => {
			EventEmitter.removeListener(INAPP_NOTIFICATION_EMITTER);
		};
	}, []);

	return <NotifierRoot />;
});

export default InAppNotification;
