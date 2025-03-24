import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Share,
    Clipboard
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useNotification from '../hooks/useNotification';

const { width, height } = Dimensions.get('window');

export default function ResultScreen({ route, navigation }) {
    const { qrData } = route.params; // Lấy dữ liệu QR từ params
    const { showNotification, NotificationComponent } = useNotification();

    // Hàm sao chép dữ liệu QR vào clipboard
    const copyToClipboard = () => {
        Clipboard.setString(qrData);
        showNotification({
            title: "Copied",
            message: "QR code data copied to clipboard",
            type: "success",
            duration: 2000
        });
    };

    // Hàm chia sẻ dữ liệu QR
    const shareData = async () => {
        try {
            await Share.share({
                message: `Dữ liệu QR: ${qrData}`,
            });
        } catch (error) {
            showNotification({
                title: "Lỗi",
                message: "Không thể chia sẻ dữ liệu QR",
                type: "error",
                duration: 3000
            });
        }
    };

    // Hàm chuyển hướng đến chi tiết sách nếu qrData là mã sách hợp lệ
    const viewBookDetails = () => {
        navigation.navigate('Chi tiết', { bookID: qrData });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NotificationComponent />

            <LinearGradient
                colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)', 'rgba(22, 20, 25, 0)']}
                style={styles.topDecoration}
            />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#F8F0E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kết quả QR Code</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.resultCard}>
                    <LinearGradient
                        colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
                        style={styles.cardGradient}
                    />

                    <View style={styles.iconContainer}>
                        <Ionicons name="qr-code" size={40} color="#D4AF37" />
                    </View>

                    <Text style={styles.titleLabel}>Dữ liệu QR Code:</Text>

                    <View style={styles.dataContainer}>
                        <Text style={styles.dataText}>{qrData}</Text>
                    </View>

                    <Text style={styles.infoText}>
                        Đây là dữ liệu được chứa trong mã QR đã quét.
                    </Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={copyToClipboard}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="copy-outline" size={22} color="#F8F0E5" />
                        <Text style={styles.actionText}>Sao chép</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={shareData}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="share-outline" size={22} color="#F8F0E5" />
                        <Text style={styles.actionText}>Chia sẻ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('QRScreen')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="scan-outline" size={22} color="#F8F0E5" />
                        <Text style={styles.actionText}>Quét lại</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.bookDetailsButton}
                    onPress={viewBookDetails}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#D4AF37', '#C09B31']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Ionicons name="book-outline" size={20} color="#161419" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Xem chi tiết sách</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Bạn có thể xem thêm chi tiết sách hoặc quét mã QR khác
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        zIndex: 1,
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 50,
    },
    resultCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    cardGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    titleLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 15,
        textAlign: 'center',
    },
    dataContainer: {
        backgroundColor: 'rgba(22, 20, 25, 0.5)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)',
    },
    dataText: {
        fontSize: 16,
        color: '#F8F0E5',
        textAlign: 'center',
        fontWeight: '500',
    },
    infoText: {
        fontSize: 14,
        color: 'rgba(248, 240, 229, 0.6)',
        textAlign: 'center',
        marginBottom: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 30,
    },
    actionButton: {
        flex: 1,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F8F0E5',
        marginTop: 8,
    },
    bookDetailsButton: {
        marginBottom: 20,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#161419',
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(248, 240, 229, 0.5)',
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    }
});