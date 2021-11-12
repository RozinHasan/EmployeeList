import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';
import Selection from '../components/selection';
import RadioInput from '../components/radioInput';

const GENDER_OPTIONS = [ 'Male', 'Female', 'Non-binary' ];
const SHIFT_OPTIONS = [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ];

const Create = ({ navigation }) => {
	const [ name, setName ] = React.useState('');
	const [ age, setAge ] = React.useState('');
	const [ gender, setGender ] = React.useState(null);
	const [ shift, setShift ] = React.useState([]);
	const [ loading, setLoading ] = React.useState(false);
	const [ image, setImage ] = React.useState(null);

	//grab input values and push it to shift array
	const shiftArray = (item) => {
		var temp = shift;
		if (temp.indexOf(item) === -1) {
			temp.push(item);
			setShift([...temp]);
		} else {
			temp.splice(temp.indexOf(item), 1);
			setShift([...temp]);
		}
		console.warn(shift);
	};


	// Image picker function
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [ 4, 3 ],
			quality: 1
		});
		if (!result.cancelled) {
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function() {
					resolve(xhr.response);
				};
				xhr.onerror = function() {
					reject(new TypeError('Network request failed'));
				};
				xhr.responseType = 'blob';
				xhr.open('GET', result.uri, true);
				xhr.send(null);
			});

			const ref = firebase.storage().ref().child(uuid.v4());

			const snapshot = await ref.put(blob);
			blob.close();
			const url = await snapshot.ref.getDownloadURL();
			setImage(url);
		}
	};

	//create employee data
	function createData() {
		setLoading(true);
		const user = firebase.auth().currentUser;
		if (name != '' && age != '' && gender != null) {
			const employeeData = {
				userId: user.uid,
				name,
				age,
				gender,
				image,
				shift
			};
			const usersRef = firebase.firestore().collection('employees');

			usersRef.add(employeeData);
			// show success message
			showMessage({
				message: 'Success',
				description: 'Your data has been saved!',
				type: 'success'
			});
			setLoading(false);
			navigation.navigate('Home');
		} else {
			showMessage({
				message: 'please fill the required fields',
				type: 'warning',
				position: 'bottom'
			});
			setLoading(false);
		}
	}

	return (
		<SafeAreaView>
			<ScrollView>
				<Pressable
					style={{
						height: 120,
						width: 120,
						borderRadius: 60,
						marginBottom: 40,
						backgroundColor: 'dodgerblue',
						justifyContent: 'center',
						alignSelf: 'center',
						alignItems: 'center'
					}}
					onPress={pickImage}
				>
					{image ? (
						<Image source={{ uri: image }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }} />
					) : (
						<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
							<Ionicons name="image" size={40} color="white" />
							<Text style={{ color: 'white' }}>Add Image</Text>
						</View>
					)}
				</Pressable>
				<Input
					onchangeText={(text) => setName(text)}
					placeholder="Your name"
					customStyle={{ borderBottomWidth: 0 }}
				/>
				<Input
					onchangeText={(text) => setAge(text)}
					placeholder="Your age"
					customStyle={{ borderBottomWidth: 0 }}
				/>

				<View style={{ flexDirection: 'column' }}>
					{GENDER_OPTIONS.map((options, index) => (
						<RadioInput key={index} title={options} value={gender} setValue={setGender} />
					))}
				</View>
				<Text style={{ marginLeft: 30, marginBottom: 10, fontWeight: 'bold' }}>Select shifts</Text>
				<Text style={{ marginLeft: 30, marginBottom: 20 }}>You can select multiple shifts</Text>
				<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
					{SHIFT_OPTIONS.map((options, index) => (
						<Selection key={index} title={options} value = {
							shift.filter(item => item)} setValue={shiftArray} />
						))}
				</View> 
				{loading ? (
					<LottieView
						style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
						source={require('../assets/loading.json')}
						autoPlay={true}
					/>
				) : (
					<Button title="Create" onPress={createData} />
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default Create;
