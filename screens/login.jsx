import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import { Header } from '../components/header';
import Input from '../components/input';
import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';


const Login = ({ navigation }) => {
	const [ email, setEmail ] = React.useState('');
	const [ password, setPassword ] = React.useState('');
	const [ loading, setLoading ] = React.useState(false);
	const [ error, setError ] = React.useState(null);

	const navigateToSignUp = () => {
		navigation.navigate('SignUp');
	};

	const loginUser = () => {
		setLoading(true);
		setError(null);
		firebase
			.auth()
			.signInWithEmailAndPassword(email.trim(), password.trim())
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				showMessage({
					message: "Error",
					description: err.message,
					type: 'danger'
				});
				setError(err.message);
				setLoading(false);
			});
	};
	return (
		<SafeAreaView style={{ flexDirection: 'column' }}>
			<ScrollView>
			<Header title="Login" />
			<Image
				style={{ height: 250, width: 350, alignSelf: 'center', marginBottom: 30 }}
				source={require('../assets//images/login.png')}
			/>
			<Text style = {{fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 25}}>Manage all your employees</Text>
				<Input
					textValue = "Hello"
					onchangeText={(text) => setEmail(text)}
					placeholder="Enter your email..."
					customStyle={{ borderBottomWidth: 0 }}
				/>
				<Input
					onchangeText={(text) => setPassword(text)}
					placeholder="Enter your password"
					customStyle={{
						borderBottomWidth: 0
					}}
					secureInput
				/>
			{loading ? <ActivityIndicator /> : <Button onPress={loginUser} title="Submit" />}
			<Text style={{ alignSelf: 'center', marginTop: 10 }}>
				Don't have an account?{' '}
				<Text onPress={navigateToSignUp} style={{ color: 'blue' }}>
					{' '}
					Sign up
				</Text>
			</Text>
		</ScrollView>
		</SafeAreaView>
	);
};

export default Login;

const styles = StyleSheet.create({
	textInput: {
		borderBottomWidth: 1,
		borderBottomColor: 'grey',
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 20,
		marginBottom: 20
	}
});
