import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, LogBox, TouchableOpacity, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Home from './screens/home';
import Login from './screens/login';
import SignUp from './screens/signup';
import { firebase } from './components/configuration/config'
import Create from './screens/create';
import Edit from './screens/edit';
import FlashMessage from 'react-native-flash-message';

const Stack = createNativeStackNavigator();


const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

export default function App() {
    
  LogBox.ignoreLogs(['Setting a timer']);

  const [user, setUser] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  function userStateChanged(user) {
    setUser(user)
    setLoading(false)
  }

  React.useEffect(() => {
    const subscribe = firebase.auth().onAuthStateChanged(userStateChanged)
    return subscribe
  }, [])

  if(loading) {
    return (
    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator/>
    </View>
    )
  }

  return (
    <NavigationContainer theme = {AppTheme}>
      <Stack.Navigator>
        {
          user ? (
            <>
          <Stack.Screen name="Home" component={Home} options = {{headerShown: false}}>
          </Stack.Screen>
          <Stack.Screen name="Create" component={Create} options = {{headerRight: () => 
          <TouchableOpacity style = {{paddingRight: 25}} onPress={() => 
            Alert.alert(
              'Warning', 'Are you sure you want to Signout?',
              [
                {text: 'Yes', onPress: () => firebase.auth().signOut()},
                {text: 'Cancel'},
              ],
              { 
                cancelable: true 
              }
            )}>
         <AntDesign name="poweroff" size={18} color="black" />
        </TouchableOpacity>}} >
          </Stack.Screen>
          <Stack.Screen name="Edit" component={Edit}/>

          </>
          ) :
          <>
          <Stack.Screen name="Login" component={Login} options = {{headerShown: false}}/>
          <Stack.Screen name="SignUp" component={SignUp} options = {{ headerShown: false}} />
          </>
        }
      </Stack.Navigator>
      {/* show flash message */}
        <FlashMessage
              position="bottom"
              hideOnPress= {true}
              floating={true}
              titleStyle = {{fontWeight: 'bold'}}
       />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
