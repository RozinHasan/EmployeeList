import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import { Header } from '../components/header';
import Input from '../components/input';
import RadioInput from '../components/radioInput';

const SignUp = () => {
	const OPTIONS = [ 'Male', 'Female', 'Non-binary' ];

	const [ email, setEmail ] = React.useState('');
	const [ password, setPassword ] = React.useState('');
	const [ confirm, setConfirm ] = React.useState('');
	const [ error, setError ] = React.useState(null);
	const [ gender, setGender ] = React.useState(null);
	const [ loading, setLoading ] = React.useState(false);

	const signUpUser = () => {
		setLoading(true);
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((response) => {
				const uid = response.user.uid;

				const profileData = {
					id: uid,
					email,
					password,
				};

				const usersRef = firebase.firestore().collection('users');

				usersRef.doc(uid).set(profileData);
				setLoading(false);
			})
			.catch((err) => {
				showMessage({
					message: 'Error',
					description: err.message,
					type: 'danger'
				});
				setError(err.message);
				setLoading(false);
			});
	};

	return (
		<SafeAreaView>
			<Header backButton={true} title="Sign Up" />
			<View
				style={{
					marginTop: 30,
					justifyContent: 'center'
				}}
			>
				<Input
					placeholder="Enter your email..."
					customStyle={{ borderBottomWidth: 0 }}
					onchangeText={(text) => setEmail(text.trim())}
				/>
				<Input
					placeholder="Enter your password"
					customStyle={{ borderBottomWidth: 0 }}
					onchangeText={(text) => setPassword(text.trim())}
					secureInput
				/>
				<Input
					placeholder="Confirm password"
					customStyle={{ borderBottomWidth: 0 }}
					onchangeText={(text) => setConfirm(text.trim())}
					secureInput
				/>
			</View>

			{OPTIONS.map((options, index) => (
				<RadioInput key={index} title={options} value={gender} setValue={setGender} />
			))}
			{loading ? <ActivityIndicator color="red" /> : <Button onPress={signUpUser} title="Submit" />}
			<Text style={{ alignSelf: 'center', marginTop: 10 }}>
				By continuing you accept the <Text style={{ color: 'dodgerblue' }}> Terms of use</Text>
				<Text> and </Text>
				<Text style={{ color: 'dodgerblue' }}> Privacy policy</Text>
			</Text>
		</SafeAreaView>
	);
};

export default SignUp;

const styles = StyleSheet.create({
	textInput: {
		borderBottomWidth: 1,
		borderBottomColor: 'grey',
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 16,
		marginBottom: 20
	}
});
