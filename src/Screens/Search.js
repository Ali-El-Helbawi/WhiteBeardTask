import * as React from 'react';
import {useState, useCallback} from 'react';
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
  UIManager,
  LayoutAnimation,
} from 'react-native';
import Modal from 'react-native-modal';
import {ActivityIndicator, Colors} from 'react-native-paper';

import {Searchbar} from 'react-native-paper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

let timeout = null;
const axios = require('axios');

const SearchScreen = ({navigation}) => {
  const [errMsg, setErrMsg] = React.useState('');
  const [alertVisible, setAlertVisible] = useState(false);
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

  const [modalVisible, setModalVisible] = useState(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [finishInfo, setFinishInfo] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [noResult, setNoResult] = React.useState(false);
  const [endIndex, setEndIndex] = React.useState(10);
  const [finalIndex, setFinalIndex] = React.useState(0);
  const [alldata, setAllData] = React.useState([]);
  const [data, setData] = React.useState([]);
  const onIconPress = async () => {
    if (searchQuery.trim() != '') {
      let search = searchQuery.trim();
      setSearchQuery(search);
      setModalVisible(true);
      setNoResult(false);
      const url = `http://universities.hipolabs.com/search`;
      const params = {country: search};

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      };

      await axios(url, {
        params: params,
        method: 'get',
        headers: headers,
        // timeout: 1000 * 5, // Wait for 5 seconds
        data: undefined,
      })
        .then(resp => {
          if (resp.data && resp.data.length > 0) {
            setNoResult(true);
            setAllData(resp.data);
            setData(resp.data.slice(0, endIndex));
            setFinalIndex(resp.data.length);
            setModalVisible(false);
          } else {
            setAllData([]);
            setData([]);
            setFinalIndex(0);
            setModalVisible(false);
            setNoResult(true);
            // setErrMsg('No data found');
            // showAlert();
          }
        })
        .catch(error => {
          setModalVisible(false);
          setNoResult(false);
          setErrMsg(error.message);
          showAlert();
          console.log(error.message);
        });
    } else {
      setErrMsg(`Enter a country`);
      showAlert();
    }
  };
  const loadMore = () => {
    if (!finishInfo) {
      try {
        setLoadingMore(true);
        if (finalIndex >= endIndex + 10) {
          setData(alldata.slice(0, endIndex + 10));
          setEndIndex(endIndex + 10);
        } else {
          setFinishInfo(true);
          setData(alldata.slice(0, finalIndex));
          setEndIndex(finalIndex);
        }
        setLoadingMore(false);
      } catch (error) {
        setErrMsg(error.message);
        showAlert();
      }
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <View style={{marginVertical: 15}}>
        <Pressable
          style={styles.btn}
          onPress={() => {
            navigation.navigate('WebView', {
              link: item.web_pages[0],
              title: item.name,
            });
          }}>
          <Text style={styles.item}>{`${index + 1}- ${item.name}`}</Text>
        </Pressable>
      </View>
    );
  };
  const ItemSeparatorComponent = () => {
    return <View style={styles.itemSeparatorComponent}></View>;
  };

  const ListEmptyComponent = () => {
    return (
      <View style={{marginVertical: 15}}>
        {noResult && (
          <Text style={styles.listEmptyComponent}>
            {`No results found. \nMake sure that you type a real country name .`}
          </Text>
        )}
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <View style={{marginVertical: 15}}>
        {loadingMore && (
          <Text style={styles.listFooterComponent}>{`Loading more`}</Text>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <Modal
          animationIn="slideInUp"
          // transparent={true}
          visible={modalVisible}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              animating={true}
              color={Colors.green500}
              size="large"
            />
            <Text>{`Searching`}</Text>
          </View>
        </Modal>

        <Searchbar
          placeholder="search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          onIconPress={onIconPress}
        />
        <Text
          style={styles.hint}>{`Search by country name, ex:'Lebanon' `}</Text>

        {alldata && alldata.length > 0 && (
          <Text
            style={styles.title}>{`${alldata.length} university found`}</Text>
        )}
        <FlatList
          scrollEnabled={true}
          data={data}
          keyExtractor={(item, index) => index}
          renderItem={renderItem}
          onEndReached={loadMore}
          //onEndReachedThreshold={2}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
        />
        <View
          style={[styles.alert, !alertVisible && {height: 1, marginTop: -1}]}>
          <Text style={styles.msg} numberOfLines={5}>
            {errMsg || 'Type something...'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  subContainer: {marginHorizontal: 24, marginVertical: 24, paddingBottom: 60},
  listFooterComponent: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
  },
  listEmptyComponent: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.8)',
  },
  itemSeparatorComponent: {
    height: 1,
    width: '100%',
    backgroundColor: '#607D8B',
  },
  btn: {
    borderRadius: 15,
    backgroundColor: Colors.green600,
    paddingVertical: 10,
  },
  item: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.8)',
  },
  hint: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.9)',
    paddingVertical: 10,
  },
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
});

export default SearchScreen;
