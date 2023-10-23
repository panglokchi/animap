import { StyleSheet, Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gridItem: {
        flex: 1,
        margin: 5,
        backgroundColor: "#347af0",
        borderRadius: 10
    },
    gridItemImage: {
        width: '100%',
        height: 225,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    searchResultsContainer: {

    },
    detailsContainer: {
        //flexDirection: 'row',
        //alignItems: 'center',
        //justifyContent: 'space-between',
        //margin: 10,
        //backgroundColor: '#FADADD'
        flex: 1,
        position: 'relative',
        margin: 10,
        borderRadius: 10
    },
    textContainer: {
        flex: 1,
        //paddingLeft: 10,
        width: '100%',
        height: '20%',
        //alignSelf: 'flex-end',
        backgroundColor: '#DDD',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: "#347af0",
    },
    bigButton: {
        backgroundColor: '#EEE',
        alignItems: 'center',
        justifyContent: 'center',
        //alignSelf: 'stretch',
        height: '100%',
        width: 96,
        padding: 10,
        position: 'absolute',
        right: 0,
    },
    bigButtonText: {
        //margin: 10,
        fontSize: 20,
        color: '#347af0'
    },
    galleryItem: {
        flex: 1,
        margin: 10,
        marginTop: 0,
        //padding: 10,
        borderRadius: 20,
        backgroundColor: '#FFF'
    },
    galleryImage: {
        width: WINDOW_WIDTH - 20,
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        resizeMode: 'cover',
    },
    galleryFlatListExpanded: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        //backgroundColor: 'white',
        //paddingVertical: 10,
    },
    galleryFlatListCollapsed: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        //backgroundColor: 'white',
        //paddingVertical: 10,
    },
    galleryItemExpanded: {
        height: WINDOW_HEIGHT - 350
    },
    galleryItemCollapsed: {
        display: 'none',
    }
});

export default styles;
   
