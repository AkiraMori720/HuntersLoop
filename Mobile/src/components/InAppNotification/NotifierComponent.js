import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {Notifier} from 'react-native-notifier';
import store from "../../store/createStore";
import {notificationOpen} from "../../actions/notification";

const AVATAR_SIZE = 48;
const BUTTON_HIT_SLOP = {
	top: 12, right: 12, bottom: 12, left: 12
};

const styles = StyleSheet.create({
	container: {
		height: 64,
		paddingHorizontal: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 4
	},
	content: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	inner: {
		flex: 1
	},
	avatar: {
		marginRight: 10
	},
	title: {
		fontSize: 17,
		lineHeight: 20,
		color: 'black'
	},
	message: {
		fontSize: 14,
		lineHeight: 17,
		color: 'black'
	},
	close: {
		marginLeft: 10
	},
	small: {
		width: '50%',
		alignSelf: 'center'
	}
});

const NotifierComponent = React.memo(({
	notification, data
}) => {
	const { body: text, title } = notification;

	const onPress = () => {
		const { roomid } = data;
		if (!roomid) {
			return;
		}

		store.dispatch(notificationOpen(data));
		hideNotification();
	};

	const hideNotification = () => {
		Notifier.hideNotification();
	}

	return (
		<View style={[
			styles.container,
			{
				backgroundColor: 'white',
				marginTop: 16
			}
		]}
		>
			<TouchableOpacity
				style={styles.content}
				onPress={onPress}
			>
				<>
					<View style={styles.inner}>
						<Text style={styles.title} numberOfLines={1}>{title}</Text>
						<Text style={styles.message} numberOfLines={1}>{text}</Text>
					</View>
				</>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={hideNotification}
			>
				<Text name='close' style={styles.close}>Close</Text>
			</TouchableOpacity>
		</View>
	);
});

NotifierComponent.propTypes = {
	notification: PropTypes.object
};

export default NotifierComponent;
