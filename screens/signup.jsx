import React from 'react';
import LottieView from 'lottie-react-native';
import { ScrollView, Text, View } from 'react-native';
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
	const [ gender, setGender ] = React.useState(null);
	const [ loading, setLoading ] = React.useState(false);


	// user signup
	const signUpUser = () => {
		setLoading(true);
		if (email != '' && password.toString().length >= 8 &&  gender != null) {
			if(password == confirm) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(email.trim(), password.trim())
				.then((response) => {
					const uid = response.user.uid;

					const profileData = {
						id: uid,
						email,
						password
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
					setLoading(false);
				});
			}
			else {
				showMessage ({
					message: "passwords don't match",
					type: 'warning',
				})
			}
		} else {
			showMessage({
				message: 'Please check the information provided',
				type: 'warning'
			});
		}
		setLoading(false);
	};

	return (
		<SafeAreaView>
			<ScrollView>
				<Header backButton={true} title="Sign Up" />
				<View
					style={{
						marginTop: 30,
						justifyContent: 'center',
						marginBottom: 20
					}}
				>
					<Input
						textValue="Email"
						customStyle={{ borderBottomWidth: 0 }}
						onchangeText={(text) => setEmail(text)}
					/>
					<Input
						textValue="Password"
						optionalText="At least 8 characters"
						customStyle={{ borderBottomWidth: 0 }}
						onchangeText={(text) => setPassword(text)}
						secureInput
					/>
					<Input
						textValue="Confirm password"
						optionalText="Must match"
						customStyle={{ borderBottomWidth: 0 }}
						onchangeText={(text) => setConfirm(text)}
						secureInput
					/>
				</View>

				{/* mapping gender values */}
				{OPTIONS.map((options, index) => (
					<RadioInput key={index} title={options} value={gender} setValue={setGender} />
				))}
				{loading ? (
					<LottieView
						style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
						source={require('../assets/loading.json')}
						autoPlay={true}
					/>
				) : (
					<Button onPress={signUpUser} title="Submit" />
				)}

				<Text style={{ alignSelf: 'center' }}>
					By continuing you accept the <Text style={{ color: 'dodgerblue' }}> Terms of use</Text>
					<Text> and </Text>
					<Text style={{ color: 'dodgerblue' }}> Privacy policy</Text>
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignUp;
