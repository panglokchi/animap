import { StyleSheet, Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gridItem: {
        flex: 1,
        margin: 5,
    },
    gridItemImage: {
        width: '100%',
        height: 225,
        resizeMode: 'cover',
    },
    leftImage: {
        width: '45%',
        height: 225,
        resizeMode: 'cover',
    },
    searchResultsContainer: {

    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //margin: 10,
        //backgroundColor: '#FADADD'
    },
    textContainer: {
        flex: 1,
        paddingLeft: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#DDD'
    },
    wideButton: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#DDD',
        alignItems: 'center',
    },
    wideButtonText: {
        margin: 10,
        fontSize: 20
    },
    galleryItem: {
        flex: 1,
        margin: 10,
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
    }
});

export default styles;
   
