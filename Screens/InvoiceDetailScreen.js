import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function InvoiceDetailScreen({ navigation }) {
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInvoiceItems = async () => {
            try {
                const storedCart = await AsyncStorage.getItem("cart");
                const items = storedCart ? JSON.parse(storedCart) : [];
                // Adding quantity default to 1 if not present in cart items
                const itemsWithQuantity = items.map(item => ({
                    ...item,
                    quantity: item.quantity || 1
                }));
                setInvoiceItems(itemsWithQuantity);
                setLoading(false);
            } catch (err) {
                console.error("Error loading invoice items:", err);
                setLoading(false);
            }
        };

        loadInvoiceItems();
    }, []);

    const calculateTotal = () => {
        return invoiceItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 1;
            return total + (price * quantity);
        }, 0);
    };

    const handlePayment = async () => {
        Alert.alert(
            "Xác nhận thanh toán",
            "Bạn có chắc muốn thực hiện thanh toán?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Thanh toán",
                    onPress: async () => {
                        try {
                            // Clear the cart after successful payment
                            await AsyncStorage.removeItem("cart");
                            Alert.alert(
                                "Thành công",
                                "Thanh toán đã được thực hiện thành công!",
                                [{
                                    text: "OK",
                                    onPress: () => navigation.navigate("Trang chủ")
                                }]
                            );
                        } catch (err) {
                            console.error("Error processing payment:", err);
                            Alert.alert("Lỗi", "Có lỗi xảy ra khi thanh toán!");
                        }
                    },
                    style: "default"
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.invoiceItem}>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemAuthor}>{item.author}</Text>
                <View style={styles.priceQuantityContainer}>
                    <Text style={styles.itemPrice}>
                        {parseFloat(item.price).toLocaleString("vi-VN")} ₫
                    </Text>
                    <Text style={styles.itemQuantity}>
                        x {item.quantity}
                    </Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hóa Đơn Chi Tiết</Text>
            </View>
            {invoiceItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có mục nào trong hóa đơn</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={invoiceItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Tổng cộng:</Text>
                            <Text style={styles.totalAmount}>
                                {calculateTotal().toLocaleString("vi-VN")} ₫
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.paymentButton}
                            onPress={handlePayment}
                        >
                            <Text style={styles.paymentButtonText}>Thanh Toán</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5E8C7",
    },
    header: {
        padding: 15,
        backgroundColor: "#FFF8E7",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5A4032",
        textAlign: "center",
        fontFamily: "System",
    },
    listContainer: {
        padding: 10,
    },
    invoiceItem: {
        backgroundColor: "#FFF8E7",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#5A4032",
        fontFamily: "System",
    },
    itemAuthor: {
        fontSize: 14,
        color: "#7A5D3F",
        marginTop: 2,
        fontFamily: "System",
    },
    priceQuantityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    itemPrice: {
        fontSize: 16,
        color: "#8F6B4A",
        fontWeight: "600",
        fontFamily: "System",
    },
    itemQuantity: {
        fontSize: 16,
        color: "#8F6B4A",
        fontWeight: "600",
        fontFamily: "System",
    },
    footer: {
        padding: 15,
        backgroundColor: "#FFF8E7",
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        color: "#5A4032",
        fontWeight: "bold",
        fontFamily: "System",
    },
    totalAmount: {
        fontSize: 18,
        color: "#8F6B4A",
        fontWeight: "bold",
        fontFamily: "System",
    },
    paymentButton: {
        backgroundColor: "#8F6B4A",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    paymentButtonText: {
        color: "#FFF8E7",
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "System",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        color: "#5A4032",
        fontFamily: "System",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#5A4032",
        fontFamily: "System",
    },
});

export default InvoiceDetailScreen;