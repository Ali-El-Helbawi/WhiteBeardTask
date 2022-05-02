import React, {useState, useCallback, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Pressable,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import {ActivityIndicator, Colors, List} from 'react-native-paper';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const WebViewScreen = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setwebKey(webKey + 1);
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const {link} = route.params;
  const [webKey, setwebKey] = useState(0);
  const DisplaySpinner = () => {
    return (
      <View style={styles.displaySpinner}>
        <Animatable.View
          animation="fadeIn"
          iterationCount={5}
          direction="alternate">
          <ActivityIndicator
            animating={true}
            color={Colors.green600}
            size="large"
          />
        </Animatable.View>
      </View>
    );
  };
  const Error = () => {
    return (
      <View style={styles.error}>
        <Animatable.View
          animation="fadeIn"
          iterationCount={1}
          direction="alternate">
          <Text style={{textAlign: 'center'}}>
            {`An error occure.\nCheck the link and your intenet connection then try again.`}
          </Text>
          <Pressable
            style={{
              backgroundColor: 'green',
              padding: 5,
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 10,
              marginTop: 5,
            }}
            onPress={() => {
              onRefresh();
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
                color: 'white',
              }}>
              {`try again`}
            </Text>
          </Pressable>
        </Animatable.View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <WebView
          source={{uri: link}}
          key={webKey}
          //style={styles.container}
          startInLoadingState={true}
          renderLoading={DisplaySpinner}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.log('onError');
            console.log('WebView error: ', nativeEvent);
          }}
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.log('onHttpError');
            console.log('WebView error: ', nativeEvent);
          }}
          renderError={Error}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1},
  displaySpinner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,1)',
    height: '100%',
    width: '100%',
  },
  error: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,1)',
    height: '100%',
    width: '100%',
  },
});
export default WebViewScreen;
