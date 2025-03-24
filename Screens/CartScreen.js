import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

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
            }
        };

        loadCartItems();
        const unsubscribe = navigation.addListener('focus', loadCartItems);
        return unsubscribe;
    }, [navigation]);

    const removeFromCart = async (bookId) => {
        try {
            const updatedCart = cartItems.filter(item => item.id !== bookId);
            await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            console.log("Removed item from cart:", bookId);
        } catch (err) {
            console.error("Error removing item from cart:", err);
        }
    };

    const clearCart = async () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("cart");
                            setCartItems([]);
                            console.log("Cart cleared");
                        } catch (err) {
                            console.error("Error clearing cart:", err);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
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
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemAuthor}>{item.author}</Text>
                <Text style={styles.itemPrice}>
                    {parseFloat(item.price).toLocaleString("vi-VN")} ₫
                </Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
            >
                <Icon name="trash" size={24} color="#D32F2F" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giỏ Hàng Sách</Text>
            </View>
            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate("Trang chủ")}
                    >
                        <Text style={styles.shopButtonText}>Tiếp tục mua sắm</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
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
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={clearCart}
                            >
                                <Text style={styles.clearButtonText}>Xóa giỏ hàng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.checkoutButton}
                                onPress={() => navigation.navigate("Hóa đơn")}
                            >
                                <Text style={styles.checkoutButtonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
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
    cartItem: {
        flexDirection: "row",
        backgroundColor: "#FFF8E7",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemImage: {
        width: 60,
        height: 80,
        borderRadius: 5,
        resizeMode: "contain",
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
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
    itemPrice: {
        fontSize: 16,
        color: "#8F6B4A",
        fontWeight: "600",
        marginTop: 5,
        fontFamily: "System",
    },
    removeButton: {
        padding: 10,
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    clearButton: {
        backgroundColor: "#D32F2F",
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
    },
    clearButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "System",
    },
    checkoutButton: {
        backgroundColor: "#8F6B4A",
        padding: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
    },
    checkoutButtonText: {
        color: "#FFF8E7",
        fontSize: 16,
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
        marginBottom: 20,
        fontFamily: "System",
    },
    shopButton: {
        backgroundColor: "#8F6B4A",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    shopButtonText: {
        color: "#FFF8E7",
        fontSize: 16,
        fontWeight: "600",
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

export default CartScreen;