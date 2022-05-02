import React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Platform,
  SectionList,
  Linking,
  Animated,
  UIManager,
  LayoutAnimation,
  RefreshControl,
} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
let timeout = null;
import {ActivityIndicator, Colors, List} from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const axios = require('axios');
const CategoriesScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [errVisible, setErrVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alldata, setAllData] = useState([]);
  const fetchData = async () => {
    setModalVisible(true);
    const url = `https://api.publicapis.org/entries`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'Application/json',
    };
    try {
      const resp = await axios(url, {
        method: 'get',
        headers: headers,
        // timeout: 1000 * 5, // Wait for 5 seconds
        data: undefined,
      });
      //   setAllData(resp.data.entries);

      //   setData(resp.data.entries.slice(0, endIndex.current));
      // finalIndex.current = resp.data.count;
      //   setModalVisible(false);
      return resp.data.entries;
    } catch (error) {
      setModalVisible(false);
      if (error.message == `Network Error`) {
        setErrVisible(true);
      }
      // setErrMsg(error.message);
      // showAlert();
    }
  };
  const getData = async () => {
    try {
      const res = await fetchData();
      if (res && res.length > 0) {
        const entries = res;
        let result = entries.reduce(function (r, a) {
          r[a.Category] = r[a.Category] || [];
          r[a.Category].push({
            API: a.API,
            Description: a.Description,
            Link: a.Link,
          });
          return r;
        }, Object.create(null));

        var keys = [];
        const newEntries = Object.entries(result);
        for (var key in result) {
          keys.push(key);
        }

        setAllData(newEntries);
      }

      setModalVisible(false);
    } catch (error) {
      setModalVisible(false);
      if (error.message == `Network Error`) {
        setErrVisible(true);
      }
      setErrMsg(error.message);
      showAlert();
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const onRefresh = useCallback(() => {
    setErrVisible(false);

    setRefreshing(true);
    getData();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const showAlert = () => {
    LayoutAnimation.easeInEaseOut();
    setAlertVisible(true);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      setAlertVisible(false);
    }, 5000);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.subContainer}>
          <Modal
            animationIn="fadeInUp"
            // transparent={true}
            animationOut="fadeOutDownBig"
            backdropOpacity={1}
            visible={modalVisible}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Animatable.View
                animation="fadeIn"
                iterationCount={5}
                direction="alternate">
                <EvilIcons name="search" color={Colors.green500} size={100} />
              </Animatable.View>
              <Animatable.Text
                animation="zoomIn"
                iterationCount={3}
                direction="alternate">
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                  }}>{`Loading...`}</Text>
              </Animatable.Text>
            </View>
          </Modal>
          <Modal
            animationIn="fadeInUp"
            // transparent={true}
            animationOut="fadeOutDownBig"
            backdropOpacity={1}
            visible={errVisible}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                }}>{`Chech your connection and try again.`}</Text>
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
            </View>
          </Modal>
          {alldata && alldata.length > 0 && (
            <Text
              style={styles.title}>{`${alldata.length} catergory found`}</Text>
          )}
          <List.AccordionGroup>
            {alldata &&
              alldata.length > 0 &&
              alldata.map((cat, index) => {
                return (
                  <List.Accordion
                    // titleStyle={{color: Colors.amber50}}
                    style={{backgroundColor: Colors.white}}
                    title={`${index + 1}- ${cat[0]}`}
                    id={index.toString()}
                    key={index}>
                    {cat[1] &&
                      cat[1].length > 0 &&
                      cat[1].map((res, index2) => {
                        const id = `${index}${index2}`;
                        return (
                          <View key={id.toString()}>
                            <Pressable
                              onPress={() => {
                                Linking.openURL(res.Link);
                              }}
                              style={{
                                paddingHorizontal: 10,
                                marginVertical: 5,
                                paddingVertical: 10,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginVertical: 10,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: 16,
                                    color: Colors.black,
                                    marginLeft: 5,
                                    marginRight: 2,

                                    //    fontWeight: '500',
                                  }}>{`${index2 + 1}- `}</Text>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: 16,
                                    color: Colors.lightBlue700,

                                    //    fontWeight: '500',
                                  }}>{`${res.Description}`}</Text>
                              </View>

                              <View
                                style={{
                                  borderBottomColor: Colors.black,
                                  borderBottomWidth: 1,
                                  marginLeft: 5,
                                }}
                              />
                              {/* <List.Item
                                title={res.Description}
                                key={id}
                                style={{
                                  backgroundColor: 'rgba(255,255,255,1)',
                                }}
                              /> */}
                            </Pressable>
                          </View>
                        );
                      })}
                  </List.Accordion>
                );
              })}
          </List.AccordionGroup>
        </View>
        <View
          style={[styles.alert, !alertVisible && {height: 1, marginTop: -1}]}>
          <Text style={styles.msg} numberOfLines={5}>
            {errMsg || 'Type something...'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  subContainer: {marginHorizontal: 24, marginVertical: 24, marginBottom: 48},
  alert: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(255,255,255,1)',
    width: '100%',
    overflow: 'hidden',
  },
  msg: {
    margin: 10,
    marginHorizontal: 20,
    color: 'rgba(255,0,0,1)',
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.8)',
  },
});

export default CategoriesScreen;
