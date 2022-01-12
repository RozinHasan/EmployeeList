import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Selection = ({ title, value, setValue, compact = false, clickable = true }) => {
	const isSelected = value === title;
	return (
		<TouchableOpacity onPress={() => {
			clickable ?
			setValue(title) : null
			}} style={styles.container}>
			<View
				style={[
					compact ? styles.compact : styles.outerBorder,
					isSelected && { backgroundColor: isSelected ? 'black' : 'white' }
				]}
			>
				<Text style={{ color: isSelected ? 'white' : 'black', fontSize: compact ? 12 : 15 }}>{title}</Text>
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
	outerBorder: {
		height: 38,
		width: 38,
		borderRadius: 4,
		borderColor: 'black',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	compact: {
		height: 30,
		width: 30,
		borderRadius: 4,
		borderColor: 'black',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
