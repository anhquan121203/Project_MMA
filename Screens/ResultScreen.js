import { StyleSheet, Text, View } from 'react-native';

export default function ResultScreen({ route }) {
    const { qrData } = route.params; // Lấy dữ liệu QR từ params

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QR Code Data:</Text>
            <Text style={styles.data}>{qrData}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    data: {
        fontSize: 18,
        textAlign: 'center',
    },
});