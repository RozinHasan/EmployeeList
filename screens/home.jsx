import { Feather, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/button';
import { firebase } from '../components/configuration/config';
import Selection from '../components/selection';

const SHIFT_OPTIONS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const Home = ({ navigation }) => {
  const currentUser = firebase.auth().currentUser;
  const employeeRef = firebase.firestore().collection('employees');
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);

  //retrieve documents for current user
  useEffect(() => {
    employeeRef
      .where('userId', '==', currentUser.uid)
      .onSnapshot((snapshot) => {
        const newEmployee = [];
        snapshot.forEach((doc) => {
          newEmployee.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setEmployee(newEmployee);
        setLoading(false);
      });
  }, []);

  const Loading = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          style={{
            height: 200,
            width: 100,
          }}
          source={require('../assets/loading.json')}
          autoPlay={true}
          loop={true}
        />
      </View>
    );
  };

  const renderEmployee = ({ item }) => {
    const { name, age, color, id, image, shift, gender } = item;

    return (
      //swipe to delete
      <Swipeable
        renderRightActions={(progress, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          return (
            <TouchableOpacity
              onPress={() => {
                employeeRef
                  .doc(id)
                  .delete()
                  .then(
                    showMessage({
                      message: 'Your data has been deleted',
                      type: 'default',
                      position: 'bottom',
                    })
                  )
                  .catch(() => {
                    showMessage({
                      message: 'Oops!',
                      description: 'Something happened, please try again',
                      type: 'danger',
                      floating: true,
                    });
                  });
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
                padding: 20,
                width: 50,
                marginBottom: 15,
              }}
            >
              <Animated.Text style={{ color: 'white' }}>DELETE</Animated.Text>
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
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
            marginBottom: 15,
          }}
        >
          <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  resizeMode: 'cover',
                  marginRight: 20,
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
                  borderWidth: 0.5,
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
                {/* mapping the sifts by filtering by shifts array */}
                {SHIFT_OPTIONS.filter(function (e) {
                  return shift.indexOf(e) >= 0;
                }, shift).map((options, index) => (
                  <Selection
                    clickable={false}
                    compact={true}
                    key={index}
                    title={options}
                    value={shift[shift.indexOf(options)]}
                  />
                ))}
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
              position: 'absolute',
              top: 10,
              right: 10,
            }}
            onPress={() => {
              navigation.navigate('Edit', { employee: item });
            }}
          >
            <Feather name='edit' size={18} color={color} />
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <Loading />
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: 20,
              paddingVertical: 15,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              My employees
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Create')}>
              <Ionicons name='add-circle' size={30} color='black' />
            </TouchableOpacity>
          </View>

          {employee.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/images/empty.png')}
                style={{
                  width: '100%',
                  height: 250,
                  marginTop: 20,
                  resizeMode: 'contain',
                }}
              />
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Sorry you do not have employees
              </Text>
              <Button
                title='Add an employee'
                onPress={() => navigation.navigate('Create')}
              />
            </View>
          ) : (
            <FlatList
              data={employee}
              keyExtractor={(item) => item.id}
              renderItem={renderEmployee}
              contentContainerStyle={{ margin: 10 }}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
