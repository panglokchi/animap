import { Text, View, Image, TouchableOpacity, Animated, useWindowDimensions, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from "react";
import MapView from "react-native-maps";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';

import { ScalingDot } from "react-native-animated-pagination-dots";

import styles from '../Styles.js'
import server from '../Constants.js'

import axios from 'axios';
import { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function MapScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [images, setImages] = useState([]);
  const [expandedView, setExpandedView] = useState(false);
  const [galleryScrollEnabled, setGalleryScrollEnabled] = useState(true);
  const [drawerArrow, setDrawerArrow] = useState(true);
  const [fullImages, setFullImages] = useState([]);
  const [currentItem, setCurrentItem] = React.useState(null);
  
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
    console.log("LOCATIONS:")
    console.log(JSON.stringify(locations, null, 2))
    setImages(
      locations.map((location)=>({
        location_id: location.location_id,
        location_name: location.location_name,
        coordinates: location.coordinates,
        anime_image: location.anime_image,
        real_image: location.real_image
      }))
    );
    setCurrentItem(locations[0]);
    console.log(JSON.stringify(images, null, 2))
    getFullImages();
  }, [locations])

  const getLocations = async () => {
    try {
      console.log("Fetching locations...");
      setLoading(true);
      const response = await axios.get(server + '/locations?anime_id=' + anime.id);
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Done fetching locations...");
      setLoading(false);
    }
  };

  const getFullImages = async () => {
    try {
      console.log("Fetching full images...");
      setLoading(true);
      const response = await axios.get(server + '/images?anime_id=' + anime.id);
      setFullImages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Done fetching full images...");
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
  const drawerScrollX = React.useRef(new Animated.Value(0)).current;
  const WINDOW_HEIGHT = useWindowDimensions().height;
  const WINDOW_WIDTH= useWindowDimensions().width;
  const hidden_offset = -1*WINDOW_HEIGHT + 140
  const galleryBottom = useRef(new Animated.Value(hidden_offset)).current;
  const bannerOpacity = useRef(new Animated.Value(1.0)).current;
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={{ flex: 1 , backgroundColor: "#DDD"}}
      onTouchStart={e=> this.touchY = e.nativeEvent.pageY}
      onTouchEnd={e => {
        if (this.touchY - e.nativeEvent.pageY > 50) {
          console.log('Swiped up')
          console.log(hidden_offset)
          Animated.timing(galleryBottom, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
          Animated.timing(bannerOpacity, {
            toValue: 0.0,
            duration: 300,
            useNativeDriver: false,
          }).start();
          setDrawerArrow(false);
          setGalleryScrollEnabled(false);
          //setExpandedView(true);
        }
        if (this.touchY - e.nativeEvent.pageY < -50) {
          console.log('Swiped down')
          console.log(hidden_offset)
          Animated.timing(galleryBottom, {
            toValue: hidden_offset,
            duration: 300,
            useNativeDriver: false,
          }).start();
          Animated.timing(bannerOpacity, {
            toValue: 1.0,
            duration: 300,
            useNativeDriver: false,
          }).start();
          setDrawerArrow(true);
          setGalleryScrollEnabled(true);
          //setExpandedView(false);
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
          keyExtractor={(item) => item.location_id}
          snapToAlignment="start"
          decelerationRate={"fast"} 
          snapToInterval={useWindowDimensions().width}
          scrollEnabled={galleryScrollEnabled}
          //onViewableItemsChanged={useCallback(({ viewableItems, changed }) => {
          //  console.log("Viewable Items Changed")
          //  if(viewableItems.length > 0) {
          //    console.log("Visible items are", viewableItems);
          //    console.log("Changed in this iteration", changed);
          //    setCurrentItem(viewableItems[0])
          //  }
          //}, [])}
          //viewabilityConfig={{itemVisiblePercentThreshold: 10}}
          onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                listener: (event)=>{
                    setCurrentItem(locations[
                      parseInt(event.nativeEvent.contentOffset.x/WINDOW_WIDTH)
                    ])
                },
                useNativeDriver: true,
              }
            )
          }
          style={
            [expandedView ? styles.galleryFlatListExpanded : styles.galleryFlatListCollapsed, { bottom: 20}]
          }
          renderItem={({ item }) => (
            <View>
              <Animated.View style={{opacity:bannerOpacity}}>
                <TouchableOpacity onPress={
                  async () => {
                    if(galleryScrollEnabled) {
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
                  }  
                }
                activeOpacity={0.8}
                >
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
                        data={locations}
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
              </Animated.View>
            </View>
          )}
        />

        <Animated.View style={[styles.galleryFlatListExpanded, styles.galleryItem, {height: -1 * hidden_offset + 20, backgroundColor: "#347af0", margin: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, bottom: galleryBottom}]}>
          <Ionicons name={drawerArrow?"chevron-up-outline":"chevron-down-outline"} size={28} color={'white'} style={{position: 'absolute', top:-5, height: 20, alignSelf: 'center'}}/>
          <View style={[styles.galleryItem, {height: -1 * hidden_offset + 20, margin: 0, marginTop: 20, borderRadius:0, padding: 0}]}>
            <View style={{alignItems: "center"}}>
              <GestureHandlerRootView>
                <Carousel
                  loop={false}
                  width={WINDOW_WIDTH}
                  height={WINDOW_HEIGHT*0.7}
                  pagingEnabled={true}
                  snapEnabled={true}
                  mode="parallax"
                  modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 30,
                  }}
                  autoPlay={false}
                  data={fullImages.filter(_item=>_item.location_id==currentItem?.location_id)}
                  scrollAnimationDuration={1000}
                  onSnapToItem={(index) => console.log('current index:', index)}
                  renderItem={({ item }) => (
                      <View
                          style={{
                              //flex: 1,
                              //flexDirection: 'row',
                              //borderWidth: 1,
                              justifyContent: 'center',
                              padding: 0,
                          }}
                      >
                        <Image source={{ uri: item?.anime_image }} style={[
                          styles.galleryImage,
                          {
                            width: '100%',
                            //borderTopRightRadius: 0,
                            //borderBottomRightRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                          }
                          ]}
                        />
                        <Image source={{ uri: item?.real_image }} style={[
                          styles.galleryImage,
                          {
                            width: '100%',
                            //borderTopLeftRadius: 0,
                            //borderBottomLeftRadius: 0,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                          }
                          ]}
                        />

                      </View>
                  )}
                />
              </GestureHandlerRootView>
            </View>
          </View>
        </Animated.View>
      </View>

    </View>
  );
}

export default MapScreen;