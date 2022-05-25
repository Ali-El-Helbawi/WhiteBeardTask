import {Button, Text, View, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

function ListScreen({navigation}) {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [categArray, setCategArray] = useState([]);
  const filteredArray = [];
  const [selectedLanguage, setSelectedLanguage] = useState();

  useEffect(() => {
    let array = [];
    let catArr = [];
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch('https://api.publicapis.org/entries', requestOptions)
      .then(response => response.json())
      .then(responseJson => {
        setData(responseJson);
        responseJson.entries.map(entries => {
          if (array.includes(entries.Category)) {
          } else {
            array.push(entries.Category);
            let tempObj = {
              label: entries.Category,
              value: entries.Category,
            };

            catArr.push(tempObj);
          }
        });

        // console.log('array', catArr);
        setCategArray(catArr);
      })
      .catch(error => console.warn('errorrrr', error));
  }, []);

  const filter = value => {
    // for(let i=0; i<data.entries.length; i++){
    //     if(data.entries[i].Category == value){
    //         filteredArray.push(data.entries[i]);
    // }
    // setFilteredData(filteredArray)
  };

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.text}>{item.Description}</Text>
        <Text style={styles.text}>{item.Link}</Text>
        <Text style={styles.text}>{item.Category}</Text>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View style={{height: 1, width: '100%', backgroundColor: '#C8C8C8'}} />
    );
  };

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label]}>select category</Text>

      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categArray}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          filter(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={'black'}
            name="Safety"
            size={20}
          />
        )}
      />

      {/* <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index}

            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
});

export default ListScreen;
