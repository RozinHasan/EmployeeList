import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
      <FlashMessage
      position="top"
      hideStatusBar= {false}
      hideOnPress= {true}
      titleStyle = {{fontWeight: 'bold'}}
    />

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
          <Stack.Screen name="Home" options = {{headerShown: false}}>
          { props => <Home {...props} user = {user} /> }
          </Stack.Screen>
          <Stack.Screen name="Create" >
          { props => <Create {...props} user = {user} /> }
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
