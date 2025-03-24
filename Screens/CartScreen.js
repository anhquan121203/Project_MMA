import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons, AntDesign } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import useNotification from "../hooks/useNotification";

const { width, height } = Dimensions.get("window");

function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification, NotificationComponent } = useNotification();

    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const storedCart = await AsyncStorage.getItem("cart");
                const items = storedCart ? JSON.parse(storedCart) : [];
                setCartItems(items);
                setLoading(false);
            } catch (err) {
                console.error("Error loading cart items:", err);
                setLoading(false);
                showNotification({
                    title: "Error",
                    message: "Could not load your cart items",
                    type: "error",
                    duration: 3000
                });
            }
        };

        loadCartItems();
        const unsubscribe = navigation.addListener('focus', loadCartItems);
        return unsubscribe;
    }, [navigation]);

    const removeFromCart = async (bookId, bookName) => {
        try {
            const updatedCart = cartItems.filter(item => item.id !== bookId);
            await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            console.log("Removed item from cart:", bookId);
            showNotification({
                title: "Item Removed",
                message: `"${bookName}" has been removed from your cart`,
                type: "info",
                duration: 2000
            });
        } catch (err) {
            console.error("Error removing item from cart:", err);
            showNotification({
                title: "Error",
                message: "Could not remove item from cart",
                type: "error",
                duration: 3000
            });
        }
    };

    const clearCart = () => {
        showNotification({
            title: "Confirm Action",
            message: "Are you sure you want to clear your cart?",
            type: "warning",
            duration: 4000
        });

        // Create custom confirm dialog
        const confirmClearCart = async () => {
            try {
                await AsyncStorage.removeItem("cart");
                setCartItems([]);
                console.log("Cart cleared");
                showNotification({
                    title: "Cart Cleared",
                    message: "Your cart has been emptied",
                    type: "success",
                    duration: 2000
                });
            } catch (err) {
                console.error("Error clearing cart:", err);
                showNotification({
                    title: "Error",
                    message: "Could not clear your cart",
                    type: "error",
                    duration: 3000
                });
            }
        };

        // Simulate a delay to show notification first
        setTimeout(() => {
            confirmClearCart();
        }, 1000);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + price;
        }, 0);
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                onError={(e) => console.log("Image load error:", e)}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemAuthor}>{item.author}</Text>
                <Text style={styles.itemPrice}>
                    {parseFloat(item.price).toLocaleString("vi-VN")} ₫
                </Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id, item.name)}
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={['rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.15)']}
                    style={styles.removeButtonGradient}
                >
                    <Ionicons name="trash-outline" size={22} color="#D4AF37" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
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
                <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
                <View style={styles.headerRight}>
                    {cartItems.length > 0 && (
                        <TouchableOpacity onPress={clearCart}>
                            <Ionicons name="trash-bin-outline" size={22} color="#F8F0E5" />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="cart-outline" size={80} color="rgba(212, 175, 55, 0.3)" />
                    </View>
                    <Text style={styles.emptyTitle}>Giỏ hàng của bạn trống</Text>
                    <Text style={styles.emptyText}>Thêm sách để bắt đầu tập trung</Text>
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
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.footer}>
                        <LinearGradient
                            colors={['rgba(22, 20, 25, 0.3)', 'rgba(22, 20, 25, 0.95)']}
                            style={styles.footerGradient}
                        />

                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Tổng cộng</Text>
                                <Text style={styles.summaryValue}>
                                    {calculateTotal().toLocaleString("vi-VN")} ₫
                                </Text>
                            </View>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Vận chuyển</Text>
                                <Text style={styles.summaryValue}>Miễn phí</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.summaryRow}>
                                <Text style={styles.totalLabel}>Tổng cộng</Text>
                                <Text style={styles.totalAmount}>
                                    {calculateTotal().toLocaleString("vi-VN")} ₫
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => navigation.navigate("Hóa đơn")}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.checkoutButtonText}>Tiếp tục thanh toán</Text>
                            <View style={styles.checkoutIconContainer}>
                                <Ionicons name="arrow-forward" size={18} color="#161419" />
                            </View>
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
        alignItems: "center",
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 150,
    },
    cartItem: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.1)",
    },
    itemImage: {
        width: 70,
        height: 90,
        borderRadius: 8,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginBottom: 5,
    },
    itemAuthor: {
        fontSize: 14,
        color: "rgba(248, 240, 229, 0.6)",
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 17,
        color: "#D4AF37",
        fontWeight: "600",
    },
    removeButton: {
        marginLeft: 10,
    },
    removeButtonGradient: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.2)",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 15,
    },
    footerGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    summaryContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.1)",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 15,
        color: "rgba(248, 240, 229, 0.6)",
    },
    summaryValue: {
        fontSize: 15,
        color: "#F8F0E5",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(248, 240, 229, 0.1)",
        marginVertical: 10,
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
    checkoutButton: {
        backgroundColor: "#D4AF37",
        borderRadius: 30,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    checkoutButtonText: {
        color: "#161419",
        fontSize: 17,
        fontWeight: "bold",
        marginRight: 10,
    },
    checkoutIconContainer: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "rgba(22, 20, 25, 0.2)",
        justifyContent: "center",
        alignItems: "center",
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

export default CartScreen;