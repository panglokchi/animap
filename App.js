import { StyleSheet, Text, View, StatusBar, SafeAreaView, Image, FlatList, TouchableOpacity, Pressable} from 'react-native';
import { SearchBar, ListItem } from '@rneui/themed';
import React, {useState, useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from "react-native-maps";

import LiveSearch from './components/LiveSearch.js'
import TopRanking from './components/TopRanking.js'
import MapScreen from './components/MapScreen.js'
import styles from './Styles.js'

function RankingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{}}>
        <TopRanking navigation={navigation}/>
      </View>
    </SafeAreaView>
  );
}

function SearchScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LiveSearch navigation={navigation}/>
    </SafeAreaView>
  );
}

function DetailsScreen({ route, navigation }) {
  const { anime } = route.params;
  return (
    <View style={styles.detailsContainer}>
      <Image
        source={{ uri: anime.image }}
        style={{
          //flex: 1,
          height: '80%',
          resizeMode: 'cover',
          borderTopLeftRadius:10,
          borderTopRightRadius:10,
        }}
      />
      <View style={styles.textContainer}>
        <View style={{
          backgroundColor: "white",
          flexDirection: 'row',
          alignItems: 'top',
          justifyContent: 'space-between',
          position: "absolute",
          bottom: 10,
          width: '100%',
          height: '100%'
        }}>
          <View style={{paddingLeft:10, paddingTop:5, paddingRight:10, width: "70%"}}>
            <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 25 }}>{anime.title}</Text>
            <Text style={{ fontSize: 20 }}>⭐{anime.score}</Text>
            <Text style={{ color: "gray", fontSize: 20}}>{anime.season}</Text>   
          </View>

          <TouchableOpacity style={styles.bigButton} onPress={
            //() => navigation.navigate(
            //  'MapScreen', {anime: anime}
            //)
            () => navigation.navigate(
              'DetailsStack', 
              {
                screen: "Map",
                params: {anime: anime}
              }
            )
          
          }>
            <Ionicons name="map-outline" size={64} color={'#347af0'} />
            <Text style={styles.bigButtonText}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const RankingStack = createNativeStackNavigator();

function RankingStackScreen() {
  return (
    <RankingStack.Navigator>
      <RankingStack.Screen
        name="Ranking"
        component={RankingScreen}
        options={{ title: "AniMap"}}
      />
      <RankingStack.Screen
        name="DetailsStack"
        component={DetailsStackScreen}
        options={{
          headerShown: false,
        }}
      />
    </RankingStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "AniMap"}}
      />
      <SearchStack.Screen
        name="DetailsStack"
        component={DetailsStackScreen}
        options={{
          headerShown: false,
        }}
      />
    </SearchStack.Navigator>
  );
}

const DetailsStack = createNativeStackNavigator();

function DetailsStackScreen({navigation}) {
  return (
    <DetailsStack.Navigator>
      <DetailsStack.Screen
        name="Details"
        component={DetailsScreen}
        options={ ({ route }) => ({
          title: route.params.anime.title,
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => {
                  navigation.goBack();
              }}
            />
          )
        })}
      />
      <DetailsStack.Screen
        name="Map"
        component={MapScreen}
        options={{ }}
      />
    </DetailsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [input, setInput] = useState("");
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          //tabBarStyle: {
          //  backgroundColor: "#FADADD"
          //},
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Top Anime Tab') {
              iconName = focused
                ? 'megaphone'
                : 'megaphone-outline';
            } else if (route.name === 'Search Tab') {
              iconName = focused ? 'search' : 'search-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Top Anime Tab" component={RankingStackScreen} options={{headerShown: false, tabBarLabel: "Popular"}}/>
        <Tab.Screen name="Search Tab" component={SearchStackScreen} options={{headerShown: false,tabBarLabel: "Search"}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

