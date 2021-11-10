import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress }) => {
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<Text style={styles.text}>{title}</Text>
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		height: 50,
		width: 160,
		borderRadius: 20,
		marginTop: 30,
		marginBottom: 20,
		backgroundColor: '#ffe699',
		alignSelf: 'center',
		justifyContent: 'center'
	},
	text: {
		color: 'black',
		textAlign: 'center'
	}
});
