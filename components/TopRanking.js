import { Text, View, Image, FlatList, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from "react";

import styles from '../Styles.js'
import server from '../Constants.js'

import axios from 'axios';

const TopRanking = ( {navigation} ) => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchTopAnimes();
    }, []);
  
    const fetchTopAnimes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(server + '/ranking'); // Replace with your endpoint URL for fetching top animes
        setSearchResults(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    const renderAnimeItem = ({ item, navigation }) => (
      <View style={styles.gridItem}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(
            'DetailsStack', 
            {
              screen: "Details",
              params: {anime: item}
            }
          )}>
            <View>
              <Image
                source={{ uri: item.image }}
                style={styles.gridItemImage}
              />
              <View style={{marginBottom:10, paddingLeft:0, backgroundColor: "white"}}>
                <Text numberOfLines={1} style={{ fontWeight: "bold" }}>{item.title}</Text>
                <Text>⭐{item.score}</Text>
                <Text style={{ color: "gray" }}>{item.season}</Text>
              </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  
    return (
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.score.toString()}
        renderItem={({ item }) => renderAnimeItem({ item, navigation })} // Pass navigation prop
        numColumns={2}
        //contentContainerStyle={styles.gridContainer}
        refreshing={loading}
        onRefresh={fetchTopAnimes}
        showsVerticalScrollIndicator={false}
      />
    );
};

export default TopRanking;