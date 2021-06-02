import React, { useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import normalize from "react-native-normalize";
import {RFPercentage} from "react-native-responsive-fontsize";
import { Colors } from '@constants';

const styles = StyleSheet.create({
	input: {
		height: normalize(40, 'height'),
		backgroundColor: Colors.greyWeakColor,
		fontSize: RFPercentage(2.5),
		borderRadius: normalize(8),
		alignItems: 'center',
		justifyContent: 'center',
		width: normalize(120, 'width')
	},
	inputText: {
		fontSize: 14
	},
	icon: {
		right: 16,
		position: 'absolute'
	},
	loading: {
		padding: 0
	}
});

export default function DatePicker({ placeholder, style, type, value, action, minimumDate }) {
	const [show, onShow] = useState(false);
	const [currentDate, onChangeDate] = useState(value);

	const onChange = ({ nativeEvent: { timestamp } }, date) => {
		if (Platform.OS === 'android') {
			onShow(false);
		}
		if(type === 'date'){
			if(!date){ return; }
			const newDate = date;
			onChangeDate(newDate);
			action({ value: moment(newDate).format('YYYY-MM-DD') });
		} else {
			console.log('time', timestamp);
			const newDate = new Date(timestamp);
			onChangeDate(newDate);
			action({ value: newDate });
		}
	};


	const getTimeString = (date) => {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		let strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}


	if(Platform.OS === 'ios'){
		return (
			<DateTimePicker
				style={style}
				mode={type}
				is24Hour={true}
				display='default'
				minimumDate={minimumDate}
				value={value??new Date()}
				onChange={onChange}
				textColor={'black'}
				themeVariant={'light'}
			/>
		);
	}

	let button = (
		<TouchableOpacity
			style={styles.input}
			onPress={() => onShow(!show)}
		>
			<Text>{value?(type==='date'?moment(value).format('YYYY-MM-DD'):getTimeString(value)):placeholder}</Text>
		</TouchableOpacity>
	);

	const content = show ? (
		<DateTimePicker
			style={style}
			mode={type}
			display='default'
			minimumDate={minimumDate}
			value={currentDate??new Date()}
			onChange={onChange}
			textColor={'black'}
		/>
	) : null;

	return (
		<>
			{button}
			{content}
		</>
	);
};
