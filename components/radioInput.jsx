import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RadioInput = ({ title, value, setValue }) => {
	const isSelected = value === title;
	return (
		<TouchableOpacity onPress={() => setValue(title)} style={styles.container}>
			<View style={[ styles.outerCircle, isSelected && { borderColor: 'dodgerblue' } ]}>
				<View
					style={[
						styles.innerCircle,
						isSelected && { borderColor: 'dodgerblue', backgroundColor: 'dodgerblue' }
					]}
				/>
			</View>
			<Text>{title}</Text>
		</TouchableOpacity>
	);
};

export default RadioInput;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		marginBottom: 20,
		marginTop: 15
	},
	outerCircle: {
		height: 20,
		width: 20,
		marginRight: 12,
		borderRadius: 10,
		borderColor: '#ccc',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	innerCircle: {
		height: 10,
		width: 10,
		borderRadius: 5,
		borderColor: '#ccc',
		borderWidth: 1
	}
});
