import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      width: 120,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    logo: {
        width: 200,
        height: 200,
      },
      map_container: {
        flex: 1,
      },
      map:{
          width: '100%',
          height: '100%',
      },
      title: {
        marginTop: 0,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderWidth: 4,
        borderColor: '#20232a',
        borderRadius: 6,
        backgroundColor: '#97e3e6',
        color: '#20232a',
        fontSize: 30,
        fontWeight: 'bold',
      },
      box: {
        width: 200, // Fixed width
        height: 100, // Fixed height
        backgroundColor: '#97e3e6', // Light blue background
        borderRadius: 10, // Rounded corners
        borderWidth: 2, // Border thickness
        borderColor: '#20232a', // Dark border color
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.3, // Shadow transparency
        shadowRadius: 4, // Shadow blur radius
        elevation: 5, // Shadow for Android
      },
      subtext: {
        color: '#20232a', // Matches the box border color
        fontSize: 18, // Slightly larger font for emphasis
        fontWeight: '600', // Semi-bold for modern look
        paddingHorizontal: 10, // Adds spacing on the sides
    },
  });
export default styles