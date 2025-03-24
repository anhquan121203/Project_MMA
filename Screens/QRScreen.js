import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Thêm expo-image-picker

export default function QRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();

    // Kiểm tra quyền camera
    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to use the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    // Xử lý khi quét QR từ camera
    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) return;
        setScanned(true);
        navigation.navigate('Chi tiết', { bookID: data });
        setTimeout(() => setScanned(false), 1000);
    };

    // Chọn ảnh từ album và quét QR
    const pickImage = async () => {
        // Yêu cầu quyền truy cập thư viện ảnh
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need media library permissions to make this work!');
            return;
        }

        // Mở thư viện ảnh
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;

            // Sử dụng CameraView để quét QR từ ảnh
            const scannedResult = await CameraView.scanFromURLAsync(imageUri, {
                barcodeTypes: ['qr'],
            });

            if (scannedResult && scannedResult.length > 0) {
                const { type, data } = scannedResult[0];
                navigation.navigate('Chi tiết', { bookID: data });
            } else {
                Alert.alert('Error', 'No QR code found in the selected image.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanBox} />
                    <Text style={styles.instruction}>Align the QR code within the box</Text>
                </View>
            </CameraView>
            <View style={styles.buttonContainer}>
                <Button title="Pick Image from Gallery" onPress={pickImage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBox: {
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 10,
    },
    instruction: {
        marginTop: 20,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
});