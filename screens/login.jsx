import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, ScrollView, Text } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import { Header } from '../components/header';
import Input from '../components/input';

const Login = ({ navigation }) => {
	const [ email, setEmail ] = React.useState('');
	const [ password, setPassword ] = React.useState('');
	const [ loading, setLoading ] = React.useState(false);

	// user login
	const loginUser = () => {
		setLoading(true);
		// check if fields meet the requirement
		if ((email != '') & (password != '')) {
			if (password.toString().length >= 8) {
				firebase
					.auth()
					.signInWithEmailAndPassword(email.trim(), password.trim())
					.then(() => {
						setLoading(false);
					})
					.catch((err) => {
						showMessage({
							message: 'Error',
							description: err.message,
							type: 'danger'
						});
						setLoading(false);
					});
			} else {
				showMessage({
					message: 'password must be at least 8 characters long',
					type: 'warning'
				});
			}
		} else {
			showMessage({
				message: 'please check the infromation you provided',
				type: 'warning'
			});
		}
		setLoading(false);
	};
	return (
		<SafeAreaView style={{ flexDirection: 'column' }}>
			<ScrollView>
				<Header title="Login" />
				<Image
					style={{ height: 250, width: 350, alignSelf: 'center', marginBottom: 30 }}
					source={require('../assets//images/login.png')}
				/>
				<Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 }}>
					Manage all your employees
				</Text>
				<Input
					textValue="Hello"
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
				{loading ? (
					<LottieView
						style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
						source={require('../assets/loading.json')}
						autoPlay={true}
					/>
				) : (
					<Button onPress={loginUser} title="Submit" />
				)}
				<Text style={{ alignSelf: 'center', marginVertical: 10 }}>
					Don't have an account?{' '}
					<Text onPress={() => navigation.navigate('SignUp')} style={{ color: 'blue' }}>
						{' '}
						Sign up
					</Text>
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Login;
