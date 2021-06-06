import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    buttonStart: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#66a266',
    },
    buttonStop: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    containerMap: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    mapViewContainer: { flex: 1 }
});