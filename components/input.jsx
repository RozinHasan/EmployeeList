import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

const Input = ({ placeholder, onchangeText, customStyle, secureInput = false, value , textValue}) => {
	return (
		<View style = {{flexDirection: 'column'}}>
		<Text value={textValue} style = {{ backgroundColor: 'white', fontSize: 20}}/>

		<View
		style={{
			borderWidth: 0.5,
			height: 60,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			borderColor: 'grey',
			backgroundColor: '#F7F8FD',
			flexDirection: 'row',
			alignItems: 'center',
			marginHorizontal: 20,
			marginBottom: 20
		}}
		>
		<TextInput
			autoCorrect={false}
			placeholder={placeholder}
			onChangeText={onchangeText}
			style={[ styles.input, customStyle ]}
			secureTextEntry = {secureInput}
			value={value}
			/>
			</View>
			</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	input: {
		
		marginHorizontal: 16,
		flex: 1,
		width: '100%',
		height: '100%',
	}
});
