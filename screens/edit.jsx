import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Input from '../components/input';
import RadioInput from '../components/radioInput';
import Selection from '../components/selection';

const GENDER_OPTIONS = [ 'Male', 'Female', 'Non-binary' ];
const SHIFT_OPTIONS = [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ];

const Edit = ({ route, navigation }) => {
	const {
		name: empName,
		age: empAge,
		gender: empGender,
		image: empImage,
		shift: empShift,
		id
	} = route.params.employee;

	const [ name, setName ] = React.useState(empName);
	const [ age, setAge ] = React.useState(empAge);
	const [ gender, setGender ] = React.useState(empGender);
	const [ shift, setShift ] = React.useState(empShift);
	const [ loading, setLoading ] = React.useState(false);
	const [ image, setImage ] = React.useState(empImage);
	const employeeRef = firebase.firestore().collection('employees');

	console.warn(shift);

	// edit values
	const onUpdate = () => {
		setLoading(true);
		employeeRef
			.doc(id)
			.update({
				name,
				age,
				gender,
				image,
				shift
			})
			.then(() => {
				showMessage({
					message: 'Success',
					description: 'Data has been succesfully saved',
					type: 'success'
				});
			})
			.catch((err) => {
				showMessage({
					message: 'Failed',
					description: err.message,
					type: 'danger'
				});
			});
		setLoading(false);
		navigation.navigate('Home');
	};

	//grab input values and push it to shift array
	const shiftArray = (item) => {
		var temp = shift;
		if (temp.indexOf(item) === -1) {
			temp.push(item);
			setShift(temp);
		} else {
			temp.splice(temp.indexOf(item), 1);
			setShift(temp);
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

			const ref = firebase.storage().ref().child(new Date().getTime().toString());

			const snapshot = await ref.put(blob);
			blob.close();
			const url = await snapshot.ref.getDownloadURL();
			setImage(url);
		}
	};

	return (
		<SafeAreaView style={{ marginTop: 20 }}>
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
						<Ionicons name="image" size={40} color="white" />
					)}
				</Pressable>
				<Input
					onchangeText={(text) => setName(text)}
					placeholder="Name"
					customStyle={{ borderBottomWidth: 0 }}
					value={name}
				/>
				<Input
					onchangeText={(text) => setAge(text)}
					placeholder="Age"
					customStyle={{ borderBottomWidth: 0 }}
					value={age}
				/>

				<View style={{ flexDirection: 'column' }}>
					{GENDER_OPTIONS.map((options, index) => (
						<RadioInput key={index} title={options} value={gender} setValue={setGender} />
					))}
				</View>
				<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
					{SHIFT_OPTIONS.map((options, index) => (
						<Selection key={index} title={options} setValue={shiftArray} />
					))}
				</View>
				{loading ? <ActivityIndicator /> : <Button title="Save" onPress={() => onUpdate()} />}
			</ScrollView>
		</SafeAreaView>
	);
};

export default Edit;

