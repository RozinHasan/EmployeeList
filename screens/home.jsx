import { Feather, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Animated, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Selection from '../components/selection';

const Home = ({ navigation }) => {
	const currentUser = firebase.auth().currentUser;
	const [ employee, setEmployee ] = React.useState([]);
	const [ loading, setLoading ] = React.useState(false);
	const employeeRef = firebase.firestore().collection('employees');

	//retrieve documents for current user
	React.useEffect(() => {
		setLoading(true);
		const subscriber = employeeRef.where('userId', '==', currentUser.uid).onSnapshot((snapshot) => {
			const newEmployee = [];
			snapshot.forEach((doc) => {
				newEmployee.push({
					id: doc.id,
					...doc.data()
				});
			});
			setEmployee(newEmployee);
			setLoading(false);
		});
		return subscriber;
	}, []);

	const renderEmployee = ({ item }) => {
		const { name, age, color, id, image, shift, gender } = item;

		return loading ? (
			<LottieView
				style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
				source={require('../assets/loading.json')}
				autoPlay={true}
			/>
		) : (
			//swipe to delete
			<Swipeable
				rightThreshold={-200}
				renderRightActions={() => {
					return (
						<TouchableOpacity
							onPress={() => {
								employeeRef.doc(id).delete();
							}}
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: 'red',
								padding: 20,
								width: 100,
								marginBottom: 25
							}}
						>
							<Animated.Text style={{ color: 'white' }}>Delete</Animated.Text>
						</TouchableOpacity>
					);
				}}
			>
				<View
					style={{
						backgroundColor: 'white',
						borderWidth: 0.5,
						borderColor: color,
						flexDirection: 'row',
						paddingHorizontal: 20,
						justifyContent: 'space-between',
						alignItems: 'center',
						paddingVertical: 10,
						marginBottom: 25
					}}
				>
					<View style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
						{image ? (
							<Image
								source={{ uri: image }}
								style={{
									height: 60,
									width: 60,
									borderRadius: 30,
									resizeMode: 'cover',
									marginRight: 20
								}}
							/>
						) : (
							<View
								style={{
									height: 60,
									width: 60,
									borderRadius: 30,
									resizeMode: 'cover',
									marginRight: 20,
									borderWidth: 0.5
								}}
							/>
						)}
						<View style={{ flexDirection: 'column' }}>
							<Text style={{ color: color, fontWeight: 'bold' }}>{name}</Text>
							<View style={{ flexDirection: 'row' }}>
								<Text>{gender} </Text>
								<Text>{age}</Text>
							</View>
							<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
								{/* mapping the sifts */}
								{shift.map((options, index) => <Selection small key={index} title={options} />)}
							</View>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Edit', { employee: item });
						}}
					>
						<Feather name="edit" size={18} color={color} />
					</TouchableOpacity>
				</View>
			</Swipeable>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					justifyContent: 'space-between',
					flexDirection: 'row',
					marginHorizontal: 20,
					paddingVertical: 15
				}}
			>
				<Text style={{ fontSize: 20, fontWeight: 'bold' }}>My employees</Text>
				{employee.length !== 0 && (
					<TouchableOpacity onPress={() => navigation.navigate('Create')}>
						<Ionicons name="add-circle" size={30} color="black" />
					</TouchableOpacity>
				)}
			</View>

			{employee.length === 0 ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Image
						source={require('../assets/images/empty.png')}
						style={{
							width: '100%',
							height: 250,
							marginTop: 20,
							resizeMode: 'contain'
						}}
					/>
					<Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Sorry you do not have employees</Text>
					<Button title="Add an employee" onPress={() => navigation.navigate('Create')} />
				</View>
			) : (
				<FlatList
					data={employee}
					keyExtractor={(item) => item.id}
					renderItem={renderEmployee}
					contentContainerStyle={{ margin: 20 }}
				/>
			)}
		</SafeAreaView>
	);
};

export default Home;
