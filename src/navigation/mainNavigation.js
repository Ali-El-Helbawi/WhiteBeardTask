import * as React from 'react';
import {Button, Text, View, Easing} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchScreen from '../Screens/Search';
import WebViewScreen from '../Screens/WebView';
import CategoriesScreen from '../Screens/Categories';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {CardStyleInterpolators} from '@react-navigation/stack';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionSpecs} from '@react-navigation/stack';
// const SearchStack = createNativeStackNavigator();
const SearchStack = createStackNavigator();

const openConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
// const closeConfig = {
//   animation: 'timing',
//   config: {
//     duration: 2000,
//     easing: Easing.bezier(0, 2, 1, -1),
//   },
// };
const closeConfig = {
  animation: 'timing',
  config: {
    duration: 1000,
    easing: Easing.out(Easing.circle),
  },
};
const openConfig2 = {
  animation: 'timing',
  config: {
    duration: 1000,
    easing: Easing.in(Easing.elastic(1)),
  },
};
const forFade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
        // gestureEnabled: true,
        // gestureDirection: 'horizontal',
        // transitionSpec: {
        // open: openConfig2,
        // close: closeConfig,
        // },
        // cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        //cardStyleInterpolator: forFade,
      }}>
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        // options={{

        // }}
      />
      <SearchStack.Screen
        name="WebView"
        component={WebViewScreen}
        options={({route, navigation}) => ({
          // presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: openConfig2,
            close: closeConfig,
            // open: TransitionSpecs.TransitionIOSSpec,
            // close: TransitionSpecs.TransitionIOSSpec,
          },
          headerShown: true,
          title: route.params.title,
          headerTitleAlign: 'center',

          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
        })}
      />
    </SearchStack.Navigator>
  );
};
// const CategoriesStack = createNativeStackNavigator();
const CategoriesStack = createStackNavigator();
const CategoriesStackScreen = () => {
  return (
    <CategoriesStack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerShown: false,
      }}>
      <CategoriesStack.Screen name="Categories" component={CategoriesScreen} />
    </CategoriesStack.Navigator>
  );
};
const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="SearchScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="SearchScreen"
        component={SearchStackScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="CategorieScreen"
        component={CategoriesStackScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="list" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation;
