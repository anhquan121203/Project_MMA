import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useNotification from '../hooks/useNotification';

const { width, height } = Dimensions.get('window');

export default function QRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scanning, setScanning] = useState(false);
    const navigation = useNavigation();
    const { showNotification, NotificationComponent } = useNotification();

    // Kiểm tra quyền camera
    if (!permission) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Đang kiểm tra quyền truy cập camera...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <StatusBar barStyle="light-content" />
                <NotificationComponent />

                <LinearGradient
                    colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)', 'rgba(22, 20, 25, 0)']}
                    style={styles.topDecoration}
                />

                <View style={styles.permissionContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="camera-outline" size={80} color="#D4AF37" />
                    </View>

                    <Text style={styles.permissionTitle}>Cần quyền truy cập camera</Text>
                    <Text style={styles.permissionMessage}>
                        Chúng tôi cần quyền truy cập camera để quét mã QR.
                    </Text>

                    <TouchableOpacity
                        style={styles.permissionButton}
                        onPress={requestPermission}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.permissionButtonText}>Cấp quyền truy cập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Xử lý khi quét QR từ camera
    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) return;
        setScanned(true);
        setScanning(true);

        showNotification({
            title: "QR Code Detected",
            message: "Đang tải thông tin sách...",
            type: "success",
            duration: 2000
        });

        setTimeout(() => {
            navigation.navigate('Chi tiết', { bookID: data });
            setScanning(false);
            setTimeout(() => setScanned(false), 1000);
        }, 500);
    };

    // Chọn ảnh từ album và quét QR
    const pickImage = async () => {
        try {
            // Yêu cầu quyền truy cập thư viện ảnh
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                showNotification({
                    title: "Quyền truy cập bị từ chối",
                    message: "Chúng tôi cần quyền truy cập thư viện ảnh để quét QR từ ảnh",
                    type: "error",
                    duration: 3000
                });
                return;
            }

            // Mở thư viện ảnh
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setScanning(true);
                const imageUri = result.assets[0].uri;

                showNotification({
                    title: "Đang xử lý ảnh",
                    message: "Đang quét mã QR...",
                    type: "info",
                    duration: 2000
                });

                // Sử dụng CameraView để quét QR từ ảnh
                try {
                    const scannedResult = await CameraView.scanFromURLAsync(imageUri, {
                        barcodeTypes: ['qr'],
                    });

                    if (scannedResult && scannedResult.length > 0) {
                        const { type, data } = scannedResult[0];

                        showNotification({
                            title: "QR Code Found",
                            message: "Đang tải thông tin sách...",
                            type: "success",
                            duration: 2000
                        });

                        setTimeout(() => {
                            navigation.navigate('Chi tiết', { bookID: data });
                            setScanning(false);
                        }, 500);
                    } else {
                        showNotification({
                            title: "Không tìm thấy mã QR",
                            message: "Vui lòng chọn một hình ảnh chứa mã QR hợp lệ",
                            type: "warning",
                            duration: 3000
                        });
                        setScanning(false);
                    }
                } catch (error) {
                    showNotification({
                        title: "Lỗi",
                        message: "Không thể xử lý hình ảnh đã chọn",
                        type: "error",
                        duration: 3000
                    });
                    setScanning(false);
                }
            }
        } catch (error) {
            showNotification({
                title: "Lỗi",
                message: "Đã xảy ra lỗi không mong muốn",
                type: "error",
                duration: 3000
            });
            setScanning(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NotificationComponent />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#F8F0E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan QR Code</Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={scanned || scanning ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                >
                    <View style={styles.overlay}>
                        <LinearGradient
                            colors={['#D4AF37', '#E6D9AB', '#D4AF37']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.scanBoxOutline}
                        >
                            <View style={styles.scanBox}>
                                <View style={styles.cornerTL} />
                                <View style={styles.cornerTR} />
                                <View style={styles.cornerBL} />
                                <View style={styles.cornerBR} />
                            </View>
                        </LinearGradient>

                        <Text style={styles.instruction}>
                            Đặt mã QR trong khung
                        </Text>

                        {scanning && (
                            <View style={styles.scanningOverlay}>
                                <ActivityIndicator size="large" color="#D4AF37" />
                                <Text style={styles.scanningText}>Đang xử lý...</Text>
                            </View>
                        )}
                    </View>
                </CameraView>
            </View>

            <View style={styles.controlsContainer}>
                <LinearGradient
                    colors={['rgba(22, 20, 25, 0)', 'rgba(22, 20, 25, 0.8)', 'rgba(22, 20, 25, 0.95)']}
                    style={styles.controlsGradient}
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.galleryButton}
                        onPress={pickImage}
                        disabled={scanning}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="images-outline" size={22} color="#F8F0E5" />
                        <Text style={styles.buttonText}>Thư viện</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.manualButton}
                        onPress={() => navigation.navigate('Tìm kiếm')}
                        disabled={scanning}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="search-outline" size={22} color="#F8F0E5" />
                        <Text style={styles.buttonText}>Tìm kiếm</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.tipText}>
                    Tip: Đảm bảo mã QR được chiếu sáng và rõ ràng
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161419',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161419',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#F8F0E5',
        fontWeight: '500',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#161419',
    },
    topDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
        zIndex: 0,
    },
    permissionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    iconContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F8F0E5',
        marginBottom: 15,
        textAlign: 'center',
    },
    permissionMessage: {
        fontSize: 16,
        color: 'rgba(248, 240, 229, 0.7)',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: '#D4AF37',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    permissionButtonText: {
        color: '#161419',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(248, 240, 229, 0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F8F0E5',
        letterSpacing: 0.5,
    },
    headerRight: {
        width: 40,
    },
    cameraContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(22, 20, 25, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBoxOutline: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: 20,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBox: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    cornerTL: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 30,
        height: 30,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#D4AF37',
        borderTopLeftRadius: 15,
    },
    cornerTR: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 30,
        height: 30,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#D4AF37',
        borderTopRightRadius: 15,
    },
    cornerBL: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 30,
        height: 30,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#D4AF37',
        borderBottomLeftRadius: 15,
    },
    cornerBR: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#D4AF37',
        borderBottomRightRadius: 15,
    },
    instruction: {
        marginTop: 30,
        fontSize: 16,
        fontWeight: '500',
        color: '#F8F0E5',
        textAlign: 'center',
        backgroundColor: 'rgba(22, 20, 25, 0.6)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    scanningOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(22, 20, 25, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanningText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8F0E5',
        marginTop: 20,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 20,
    },
    controlsGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    galleryButton: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        width: '45%',
    },
    manualButton: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        width: '45%',
    },
    buttonText: {
        color: '#F8F0E5',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    tipText: {
        fontSize: 14,
        color: 'rgba(248, 240, 229, 0.6)',
        textAlign: 'center',
        marginTop: 10,
    },
});