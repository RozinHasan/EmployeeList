import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';
import RadioInput from '../components/radioInput';
import Selection from '../components/selection';

const GENDER_OPTIONS = [ 'Male', 'Female', 'Non-binary' ];
const SHIFT_OPTIONS = [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ];

const Create = ({ user, navigation }) => {
	const [ name, setName ] = React.useState('');
	const [ age, setAge ] = React.useState('');
	const [ gender, setGender ] = React.useState(null);
	const [ shift, setShift ] = React.useState([]);
	const [ loading, setLoading ] = React.useState(false);
	const [ image, setImage ] = React.useState(null);

	const shiftArray = (options, index) => {
		if(shift.indexOf(options) === -1) {
			setShift([...shift,options])
		}
		console.log(shift)
	};

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

			const ref = firebase.storage().ref().child(new Date().getTime().toString());

			const snapshot = await ref.put(blob);
			blob.close();
			const url = await snapshot.ref.getDownloadURL();
			setImage(url);
		}
	};

	function createData() {
		setLoading(true);

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
		setLoading(false);
		navigation.navigate('Home');
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
						<View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
						<Ionicons name="image" size={40} color="white" />
						<Text style = {{color: 'white'}}>Add Image</Text>
						</View>
					)}
				</Pressable>
				<Input
					textValue="Name"
					onchangeText={(text) => setName(text)}
					placeholder="Your name"
					customStyle={{ borderBottomWidth: 0 }}
				/>
				<Input
					textValue="Age"
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
						<Selection key={index} title={options} value={["Sat", "Sun"]} setValue={(options, index) => 
							shiftArray(options, index)
							// setShift(options)
						} />
						// <TouchableOpacity onPress = {() => {
						// 	setShift(options)
						// 	console.log(shift)}}>
						// <Text>{options}</Text>
						// </TouchableOpacity>
					))}
				</View>

				{loading ? <ActivityIndicator /> : <Button title="Create" onPress={createData} />}
			</ScrollView>
		</SafeAreaView>
	);
};

export default Create;
