import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Selection = ({ title, value, setValue, small = false  }) => {
	const isSelected = value === title;
	return (
		<TouchableOpacity onPress={() => setValue(title, value)} style={styles.container}>
			<View style={[ small ? styles.small : styles.outerCircle, isSelected && { backgroundColor: isSelected ? 'black' : 'white' } ]}>
			<Text style = {{color: isSelected ? 'white' : 'black', fontSize: small ? 10 : 15}}>{title}</Text>
			</View>
		</TouchableOpacity>
	);
};

export default Selection;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: 10,
		marginBottom: 20,
		marginTop: 15
	},
	outerCircle: {
		height: 38,
		width: 38,
		borderRadius: 1,
		borderColor: 'black',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	small: {
		height: 25,
		width: 25,
		borderRadius: 1,
		borderColor: 'black',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
});
