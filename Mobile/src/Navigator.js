import React from 'react';
import Navigation, {getActiveRouteName} from './service/navigation';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './screens/Splash';

import SigninScreen from './screens/auth/Signin';
import SignupScreen from './screens/auth/Signup';
import ForgotPwdScreen from './screens/auth/ForgotPwd';

import WelcomeScreen from './screens/Welcome';

import ProfileScreen from './screens/profile/Profile';
import ProfileEditScreen from './screens/profile/ProfileEdit';
import BusinessProfile from './screens/profile/BusinessProfile';
import BusinessProfileEdit from './screens/profile/BusinessProfileEdit';

import MapViewScreen from './screens/home/MapView';
import BusinessListScreen from './screens/home/BusinessList';
import ServiceListScreen from './screens/home/ServiceList';
import ServiceDetailScreen from './screens/home/ServiceDetail';
import AddServiceScreen from './screens/home/AddService';

import MessageListScreen from './screens/message/MessageList';
import ChatScreen from './screens/message/Chat';

import SettingListScreen from './screens/setting/SettingList';
import ContactScreen from './screens/setting/Contact';
import AboutScreen from './screens/setting/About';
import PolicyScreen from './screens/setting/Policy';
import TermsScreen from './screens/setting/Terms';
import RequestScreen from './screens/setting/Request';

import { Colors } from '@constants';

const Stack = createStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='Signin'
    >
      <Stack.Screen
        name='Signin'
        component={SigninScreen}
      />
      <Stack.Screen
        name='Signup'
        component={SignupScreen}
      />      
      <Stack.Screen
        name='ForgotPwd'
        component={ForgotPwdScreen}
      />      
    </Stack.Navigator>
  )
}

function ProfileStack(){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='Profile'
    >
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
      />
      <Stack.Screen
        name='ProfileEdit'
        component={ProfileEditScreen}
      />         
    </Stack.Navigator>
  )
}

function BusinessProfileStack(){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='BusinessProfile'
    >
      <Stack.Screen
        name='BusinessProfile'
        component={BusinessProfile}
      />
      <Stack.Screen
        name='BusinessProfileEdit'
        component={BusinessProfileEdit}
      />         
    </Stack.Navigator>
  )
}

function HomeStack(){
  return (
    <Stack.Navigator
      headerMode='none'            
    >
      <Stack.Screen
        name='MapView'
        component={MapViewScreen}
      />
      <Stack.Screen
        name='BusinessList'
        component={BusinessListScreen}
      />         
      <Stack.Screen
        name='AddService'
        component={AddServiceScreen}
      />         
      <Stack.Screen
        name='ServiceList'
        component={ServiceListScreen}
      />         
      <Stack.Screen
        name='ServiceDetail'
        component={ServiceDetailScreen}
      />         
    </Stack.Navigator>
  )
}

function MessageStack (){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='MessageList'
    >
      <Stack.Screen
        name='MessageList'
        component={MessageListScreen}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
      />               
    </Stack.Navigator>
  )
}

function SettingStack (){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='SettingList'
    >
      <Stack.Screen
        name='SettingList'
        component={SettingListScreen}
      />
      <Stack.Screen
        name='Contact'
        component={ContactScreen}
      />               
      <Stack.Screen
        name='About'
        component={AboutScreen}
      />               
      <Stack.Screen
        name='Policy'
        component={PolicyScreen}
      />               
      <Stack.Screen
        name='Terms'
        component={TermsScreen}
      />               
      <Stack.Screen
        name='Request'
        component={RequestScreen}
      />               
    </Stack.Navigator>
  )
}

const App = React.memo(() => {
  React.useEffect(() => {
    const state = Navigation.navigationRef.current?.getRootState();
    Navigation.routeNameRef.current = getActiveRouteName(state);
  }, []);

  return (
    <NavigationContainer
        ref={Navigation.navigationRef}
        onStateChange={(state) => {
          const previousRouteName = Navigation.routeNameRef.current;
          const currentRouteName = getActiveRouteName(state);
          if (previousRouteName !== currentRouteName) {
          }
          Navigation.routeNameRef.current = currentRouteName;
        }}>
      <Stack.Navigator headerMode='none' initialRouteName="Splash" screenOptions={{ cardStyle: {backgroundColor: Colors.blackColor }}}>
        <Stack.Screen name='Splash' component={SplashScreen} />
        <Stack.Screen name='Auth' component={AuthStack} />
        <Stack.Screen name='Welcome' component={WelcomeScreen} />
        <Stack.Screen name='Profile' component={ProfileStack} />        
        <Stack.Screen name='BusinessProfile' component={BusinessProfileStack} />        
        <Stack.Screen name='Home' component={HomeStack} />        
        <Stack.Screen name='Message' component={MessageStack} />
        <Stack.Screen name='Setting' component={SettingStack} />
      </Stack.Navigator>
    </NavigationContainer>
  )
});

export default App;