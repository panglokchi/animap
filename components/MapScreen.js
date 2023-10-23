import { StyleSheet, Text, View, StatusBar, SafeAreaView, Image, FlatList, TouchableWithoutFeedback, Pressable, TouchableOpacity, Animated, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef} from "react";
import MapView from "react-native-maps";
import {ScalingDot} from "react-native-animated-pagination-dots";


import styles from '../Styles.js'
import server from '../Constants.js'

import axios from 'axios';
import { Marker } from 'react-native-maps';

function MapScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [expandedView, setExpandedView] = useState(false);
  const [previousY, setPreviousY] = useState(0);
  
  const { anime } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLocations();
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    console.log(locations)
    setImages(
      locations.map((location)=>({
        location_id: location.location_id,
        location_name: location.location_name,
        coordinates: location.coordinates,
        anime_image: location.anime_image,
        real_image: location.real_image
      }))
    )
  }, [locations])

  useEffect(() => {
    console.log(images)
  }, [images])

  const getLocations = async () => {
    try {
      console.log("Fetching locations...");
      setLoading(true);
      const response = await axios.get(server + '/locations?id=' + anime.id);
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Done fetching locations...");
      setLoading(false);
    }
  };

  const calculateRegion = () => {
    if (locations.length === 0) {
      return null;
    }
  
    let minLat = locations[0].coordinates.x;
    let maxLat = locations[0].coordinates.x;
    let minLng = locations[0].coordinates.y;
    let maxLng = locations[0].coordinates.y;
  
    locations.forEach(location => {
      minLat = Math.min(minLat, location.coordinates.x);
      maxLat = Math.max(maxLat, location.coordinates.x);
      minLng = Math.min(minLng, location.coordinates.y);
      maxLng = Math.max(maxLng, location.coordinates.y);
    });
  
    const latitudeDelta = 1.3 * (maxLat - minLat);
    const longitudeDelta = 1.3 * (maxLng - minLng);
  
    return {
      latitude: (maxLat + minLat) / 2 - 0.018,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta,
      longitudeDelta,
    };
  };

  const mapRef = React.createRef();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const WINDOW_HEIGHT = Dimensions.get("window").height;
  const hidden_offset = -1*WINDOW_HEIGHT+350
  const galleryBottom = useRef(new Animated.Value(hidden_offset)).current;

  return (
    <View style={{ flex: 1 , backgroundColor: "#DDD"}}
      onTouchStart={e=> this.touchY = e.nativeEvent.pageY}
      onTouchEnd={e => {
        if (this.touchY - e.nativeEvent.pageY > 50) {
          console.log('Swiped up')
          Animated.timing(galleryBottom, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
          setExpandedView(true);
        }
        if (this.touchY - e.nativeEvent.pageY < -50) {
          console.log('Swiped down')
          Animated.timing(galleryBottom, {
            toValue: hidden_offset,
            duration: 300,
            useNativeDriver: false,
          }).start();
          setExpandedView(false);
        }
      }}
    >

          <View>
            <MapView
              ref={mapRef}
              initialRegion={calculateRegion()}
              mapType="standard"
              style={{alignSelf: 'stretch', height: '100%' }}
            >
              {locations.map(location => (
                <Marker
                  key={location.id}
                  coordinate={{
                    latitude: location.coordinates.x,
                    longitude: location.coordinates.y,
                  }}
                />
              ))}
            </MapView>
            <Animated.FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.location}
              snapToAlignment="start"
              decelerationRate={"fast"} 
              snapToInterval={Dimensions.get("window").width}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                }
              )}
              style={
                [expandedView ? styles.galleryFlatListExpanded : styles.galleryFlatListCollapsed, { bottom: galleryBottom }]
              }
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity onPress={
                    async () => {
                      mrc = await mapRef.current
                      mrc.animateToRegion(
                        {
                          latitude: item?.coordinates.x - 0.000922,
                          longitude: item?.coordinates.y,
                          latitudeDelta: 0.014605, // Adjust the desired zoom level for zooming out
                          longitudeDelta: 0.00606, // Adjust the desired zoom level for zooming out
                        },
                        500
                      );
                      setTimeout(() => {
                        mrc.animateToRegion({
                          latitude: item?.coordinates.x - 0.000922,
                          longitude: item?.coordinates.y,
                          latitudeDelta: 0.003688,
                          longitudeDelta: 0.001684,
                        });
                      }, 500);
                    }
                  }>
                    <View style={styles.galleryItem}>
                      <Image source={{ uri: item?.anime_image }} style={styles.galleryImage} />
                      <View style={{
                        paddingLeft: 20,
                        paddingBottom: 5,
                        paddingTop: 5,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#3339",
                        //borderTopLeftRadius: 20,
                        //borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                      }}>
                        <Text style={{
                          fontSize: 20,
                          marginBottom: 20,
                          color: "white",
                        }}>{item.location_name}</Text>
                        <ScalingDot
                          data={images}
                          activeDotScale={1}
                          scrollX={scrollX}
                          inActiveDotOpacity={0.3}
                          activeDotColor={'#fff'}
                          inActiveDotColor={'#fff'}
                          dotStyle={{
                              width: 10,
                              height: 10,
                              backgroundColor: 'red',
                              borderRadius: 5,
                              marginHorizontal: 5
                          }}
                          containerStyle={{
                            bottom: 10
                          }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.galleryItem, {height: WINDOW_HEIGHT - 350}]}>
                  </View>
                </View>
              )}
            />
          </View>

    </View>
  );
}

export default MapScreen;