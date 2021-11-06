import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import Input from '../components/input';
import { firebase } from '../components/configuration/config';
import Selection from '../components/selection';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import RadioInput from '../components/radioInput';

const GENDER_OPTIONS = [ 'Male', 'Female', 'Non-binary' ];
const SHIFT_OPTIONS = [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ];

const Edit = ({ route, navigation }) => {
	const { name: empName, age: empAge, gender: empGender, image: empImage, shift: empShift, id } = route.params.employee;

	const [ name, setName ] = React.useState(empName);
	const [ age, setAge ] = React.useState(empAge);
	const [ gender, setGender ] = React.useState(empGender);
	const [ shift, setShift ] = React.useState(empShift);
	const [ loading, setLoading ] = React.useState(false);
	const [ image, setImage ] = React.useState(empImage);
	const employeeRef = firebase.firestore().collection('employees');
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
					type: 'success'
				});
			})
			.catch((err) => {
				showMessage({
					message: 'Failed',
					type: 'danger'
				});
			});
		setLoading(false);
		navigation.navigate('Home');
	};
	const shiftArray = (title) => {
		setShift([ ...shift, title ]);
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
					resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
				};
				xhr.onerror = function() {
					reject(new TypeError('Network request failed')); // error occurred, rejecting
				};
				xhr.responseType = 'blob'; // use BlobModule's UriHandler
				xhr.open('GET', result.uri, true); // fetch the blob from uri in async mode
				xhr.send(null); // no initial data
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
					// <Selection key={index} title={options} value={shift} setValue={(title) => shiftArray(title)} />
					<Text>{options}</Text>
				))}
			</View>
			{loading ? <ActivityIndicator /> : <Button title="Save" onPress={() => onUpdate()} />}
			</ScrollView>
		</SafeAreaView>
	);
};

export default Edit;

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
