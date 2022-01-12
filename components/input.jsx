import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';

const Input = ({ placeholder, value, onchangeText, customStyle, secureInput = false, textValue, optionalText, onBlur }) => {
	return (
		<View style={{ flexDirection: 'column', marginHorizontal: 20 }}>
			<Text style={{ fontSize: 16, marginBottom: 5, color: 'black', fontWeight: 'bold' }}>{textValue}</Text>
			{optionalText && <Text style={{ fontSize: 12, marginBottom: 14, color: 'grey' }}>{optionalText}</Text>}

			<View
				style={{
					borderWidth: 0.5,
					height: 50,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 3,
					borderColor: 'grey',
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 10
				}}
			>
				<TextInput
					autoCorrect={false}
					placeholder={placeholder}
					onChangeText={onchangeText}
					style={[ styles.input, customStyle ]}
					secureTextEntry={secureInput}
					value={value}
					onBlur={onBlur}
				/>
			</View>
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	input: {
		paddingHorizontal: 20,
		flex: 1,
		width: '100%',
		height: '100%'
	}
});
