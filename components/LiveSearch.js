import { View, Image,  TouchableWithoutFeedback} from 'react-native';
import { SearchBar, ListItem } from '@rneui/themed';
import React, {useState, useEffect} from "react";
import axios from 'axios';

import styles from '../Styles.js'
import server from '../Constants.js'

const LiveSearch = ( {navigation} ) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchQuery) {
        search();
        } else {
        setSearchResults([]);
        }
    }, [searchQuery]);

    const search = async () => {
        try {
        const response = await axios.get(server+`/anime?title=${searchQuery}`);
        setSearchResults(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    return (
        <View>
        <SearchBar
            placeholder="Search..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            platform="ios"
            //inputContainerStyle={{backgroundColor: '#FFFFFF'}}
            //leftIconContainerStyle={{backgroundColor: '#FFFFFF'}}
            //containerStyle={{backgroundColor: '#FADADD'}}
        />
        <View style={styles.searchResultsContainer}>
            {searchResults.map((result, index) => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate(
                'DetailsStack', 
                {
                screen: "Details",
                params: {anime: result}
                }
            )}>
                <View>
                <ListItem key={index} bottomDivider containerStyle={{padding: 0}}>
                    <Image source={{ uri: result.image }} style={{ width: 50, height: 50}} />
                    <ListItem.Content>
                    <ListItem.Title numberOfLines={1} style={{fontWeight:"bold"}}>{result.title}</ListItem.Title>
                    <ListItem.Subtitle>⭐{result.score}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{color:"gray"}}>{result.season}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                </View>
            </TouchableWithoutFeedback>
            ))}
        </View>
        </View>
    );
};

export default LiveSearch;