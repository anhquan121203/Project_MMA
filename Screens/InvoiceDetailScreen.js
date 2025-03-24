import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Dimensions,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import useNotification from "../hooks/useNotification";

const { width, height } = Dimensions.get("window");

function InvoiceDetailScreen({ navigation }) {
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification, NotificationComponent } = useNotification();
    const [orderNumber, setOrderNumber] = useState('');

    useEffect(() => {
        const generateOrderNumber = () => {
            const timestamp = new Date().getTime().toString().slice(-6);
            const random = Math.floor(Math.random() * 900) + 100;
            return `ORD-${timestamp}${random}`;
        };

        const loadInvoiceItems = async () => {
            try {
                const storedCart = await AsyncStorage.getItem("cart");
                const items = storedCart ? JSON.parse(storedCart) : [];
                const itemsWithQuantity = items.map(item => ({
                    ...item,
                    quantity: item.quantity || 1
                }));
                setInvoiceItems(itemsWithQuantity);
                setOrderNumber(generateOrderNumber());
                setLoading(false);
            } catch (err) {
                console.error("Error loading invoice items:", err);
                setLoading(false);
                showNotification({
                    title: "Lỗi",
                    message: "Không thể tải thông tin hóa đơn của bạn",
                    type: "error",
                    duration: 3000
                });
            }
        };

        loadInvoiceItems();
    }, []);

    const calculateSubtotal = () => {
        return invoiceItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 1;
            return total + (price * quantity);
        }, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handlePayment = () => {
        showNotification({
            title: "Xác nhận thanh toán",
            message: "Bạn có muốn tiếp tục thanh toán không?",
            type: "warning",
            duration: 4000
        });

        // Simulate payment processing
        const processPayment = async () => {
            try {
                // Clear the cart after successful payment
                await AsyncStorage.removeItem("cart");

                // Show success notification
                showNotification({
                    title: "Thanh toán thành công",
                    message: "Đơn hàng của bạn đã được xác nhận và sẽ được xử lý",
                    type: "success",
                    duration: 3000
                });

                // Navigate to homepage after a delay
                setTimeout(() => {
                    navigation.navigate("Trang chủ");
                }, 2000);
            } catch (err) {
                console.error("Error processing payment:", err);
                showNotification({
                    title: "Thanh toán thất bại",
                    message: "Đã xảy ra lỗi khi xử lý thanh toán của bạn",
                    type: "error",
                    duration: 3000
                });
            }
        };

        // Wait for notification to be seen before processing
        setTimeout(() => {
            processPayment();
        }, 1500);
    };

    const getDate = () => {
        const today = new Date();
        return today.toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.invoiceItem}>
            <View style={styles.itemDetails}>
                <View style={styles.itemNameRow}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
                <Text style={styles.itemAuthor}>{item.author}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>
                        {parseFloat(item.price).toLocaleString("vi-VN")} ₫
                    </Text>
                    <Text style={styles.itemTotalPrice}>
                        {(parseFloat(item.price) * item.quantity).toLocaleString("vi-VN")} ₫
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderSeparator = () => (
        <View style={styles.separator} />
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Đang tải hóa đơn của bạn...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NotificationComponent />

            <LinearGradient
                colors={['rgba(22, 20, 25, 0.97)', 'rgba(22, 20, 25, 0.95)']}
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#F8F0E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết hóa đơn</Text>
                <View style={styles.headerRight} />
            </LinearGradient>

            {invoiceItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="document-text-outline" size={80} color="rgba(212, 175, 55, 0.3)" />
                    </View>
                    <Text style={styles.emptyTitle}>Không có sản phẩm trong hóa đơn</Text>
                    <Text style={styles.emptyText}>Giỏ hàng của bạn trống. Thêm sách để tiếp tục.</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate("Trang chủ")}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.shopButtonText}>Xem sách</Text>
                        <Ionicons name="arrow-forward" size={18} color="#161419" />
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.invoiceHeader}>
                        <View style={styles.invoiceBranding}>
                            <View style={styles.logoContainer}>
                                <Ionicons name="book" size={28} color="#D4AF37" />
                            </View>
                            <Text style={styles.brandName}>BookShelf</Text>
                        </View>

                        <View style={styles.invoiceDetails}>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Mã hóa đơn:</Text>
                                <Text style={styles.invoiceValue}>{orderNumber}</Text>
                            </View>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Ngày:</Text>
                                <Text style={styles.invoiceValue}>{getDate()}</Text>
                            </View>
                            <View style={styles.invoiceRow}>
                                <Text style={styles.invoiceLabel}>Trạng thái:</Text>
                                <Text style={[styles.invoiceValue, styles.statusPending]}>Chờ xác nhận</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.itemsContainer}>
                        <Text style={styles.sectionTitle}>Sản phẩm trong hóa đơn</Text>
                        <FlatList
                            data={invoiceItems}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            ItemSeparatorComponent={renderSeparator}
                        />
                    </View>

                    <View style={styles.summaryContainer}>
                        <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tổng tiền</Text>
                            <Text style={styles.summaryValue}>
                                {calculateSubtotal().toLocaleString("vi-VN")} ₫
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Thuế (10%)</Text>
                            <Text style={styles.summaryValue}>
                                {calculateTax().toLocaleString("vi-VN")} ₫
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                            <Text style={styles.summaryValue}>Miễn phí</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tổng cộng</Text>
                            <Text style={styles.totalAmount}>
                                {calculateTotal().toLocaleString("vi-VN")} ₫
                            </Text>
                        </View>
                    </View>

                    <View style={styles.paymentMethodContainer}>
                        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                        <View style={styles.paymentOption}>
                            <View style={styles.paymentIconContainer}>
                                <FontAwesome5 name="money-bill-wave" size={20} color="#D4AF37" />
                            </View>
                            <Text style={styles.paymentMethodText}>Thanh toán tiền mặt</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.paymentButton}
                        onPress={handlePayment}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.paymentButtonText}>Xác nhận đơn hàng</Text>
                        <View style={styles.paymentIconCircle}>
                            <Ionicons name="checkmark" size={20} color="#161419" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>
                            Bằng cách xác nhận đơn hàng của bạn, bạn đồng ý với{' '}
                            <Text style={styles.termsLink}>Điều khoản dịch vụ</Text> và{' '}
                            <Text style={styles.termsLink}>Chính sách bảo mật</Text>.
                        </Text>
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161419",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161419",
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: "#F8F0E5",
        fontWeight: "500",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(248, 240, 229, 0.1)",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#F8F0E5",
        letterSpacing: 0.5,
    },
    headerRight: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
    },
    invoiceHeader: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    invoiceBranding: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(212, 175, 55, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.3)",
    },
    brandName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginLeft: 15,
        letterSpacing: 1,
    },
    invoiceDetails: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.1)",
    },
    invoiceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    invoiceLabel: {
        fontSize: 14,
        color: "rgba(248, 240, 229, 0.6)",
    },
    invoiceValue: {
        fontSize: 14,
        color: "#F8F0E5",
        fontWeight: "500",
    },
    statusPending: {
        color: "#D4AF37",
        fontWeight: "600",
    },
    itemsContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    invoiceItem: {
        paddingVertical: 15,
    },
    itemNameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#F8F0E5",
        flex: 1,
        marginRight: 10,
    },
    itemQuantity: {
        fontSize: 15,
        color: "#D4AF37",
        fontWeight: "600",
    },
    itemAuthor: {
        fontSize: 14,
        color: "rgba(248, 240, 229, 0.6)",
        marginTop: 4,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemPrice: {
        fontSize: 15,
        color: "rgba(248, 240, 229, 0.8)",
    },
    itemTotalPrice: {
        fontSize: 15,
        color: "#D4AF37",
        fontWeight: "600",
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(248, 240, 229, 0.1)",
    },
    summaryContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "rgba(255, 255, 255, 0.02)",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 15,
        color: "rgba(248, 240, 229, 0.6)",
    },
    summaryValue: {
        fontSize: 15,
        color: "#F8F0E5",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(212, 175, 55, 0.2)",
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    totalLabel: {
        fontSize: 17,
        color: "#F8F0E5",
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 20,
        color: "#D4AF37",
        fontWeight: "bold",
    },
    paymentMethodContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.1)",
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(212, 175, 55, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    paymentMethodText: {
        fontSize: 16,
        color: "#F8F0E5",
        fontWeight: "500",
    },
    paymentButton: {
        backgroundColor: "#D4AF37",
        marginHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
        height: 56,
        borderRadius: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    paymentButtonText: {
        color: "#161419",
        fontSize: 17,
        fontWeight: "bold",
        marginRight: 10,
    },
    paymentIconCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "rgba(22, 20, 25, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    termsContainer: {
        paddingHorizontal: 30,
        alignItems: "center",
    },
    termsText: {
        fontSize: 12,
        color: "rgba(248, 240, 229, 0.4)",
        textAlign: "center",
        lineHeight: 18,
    },
    bottomPadding: {
        height: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.1)",
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: "rgba(248, 240, 229, 0.6)",
        textAlign: "center",
        marginBottom: 30,
    },
    shopButton: {
        backgroundColor: "#D4AF37",
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 25,
        flexDirection: "row",
        alignItems: "center",
    },
    shopButtonText: {
        color: "#161419",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8,
    },
});

export default InvoiceDetailScreen;