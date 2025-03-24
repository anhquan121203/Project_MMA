import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL || "https://bookshelf-be.onrender.com";

function DetailScreen({ route, navigation }) {
    const { bookID } = route.params;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    let parsedBookID;
    try {
        parsedBookID = typeof bookID === "string" && bookID.trim().startsWith("{")
            ? JSON.parse(bookID).id
            : bookID;
    } catch (e) {
        console.error("Error parsing bookID:", e);
        parsedBookID = bookID;
    }

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const favorites = await AsyncStorage.getItem("favorites");
                const favoritesArray = favorites ? JSON.parse(favorites) : [];
                setIsFavorite(favoritesArray.includes(parsedBookID));
            } catch (err) {
                console.error("Error checking favorite status:", err);
            }
        };

        checkFavoriteStatus();
    }, [parsedBookID]);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                if (!parsedBookID || typeof parsedBookID !== 'string' || parsedBookID.trim() === '') {
                    throw new Error("Invalid book ID");
                }
                console.log("Fetching book details for parsedBookID:", parsedBookID);
                const response = await fetch(`${API_URL}/api/books/${parsedBookID}`);

                if (!response.ok) {
                    console.log("Book not found, navigating to QRScreen");
                    navigation.navigate("QRScreen");
                    return;
                } else {
                    const data = await response.json();
                    if (!data || !data.bookName) {
                        console.log("Invalid book data, navigating to QRScreen");
                        navigation.navigate("QRScreen");
                        return;
                    }
                    setBook(data);
                    setLoading(false);
                }
            } catch (err) {
                setError("Không thể tải thông tin sách");
                setLoading(false);
                console.error("Error fetching book details:", err);
            }
        };

        fetchBookDetails();
    }, [parsedBookID, navigation]);

    const toggleFavorite = async () => {
        try {
            const favorites = await AsyncStorage.getItem("favorites");
            let favoritesArray = favorites ? JSON.parse(favorites) : [];

            if (isFavorite) {
                favoritesArray = favoritesArray.filter((id) => id !== parsedBookID);
                console.log("Removed from favorites", { parsedBookID, favoritesArray });
            } else {
                favoritesArray.push(parsedBookID);
                console.log("Added to favorites", { parsedBookID, favoritesArray });
            }

            await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    const handleAddToCart = async () => {
        try {
            const bookData = {
                id: parsedBookID,
                name: book.bookName,
                price: book?.price?.$numberDecimal,
                author: book.actor?.actorName || "Chưa xác định",
                image: book.image,
                quantity: 1 // Fixed quantity of 1
            };

            // Get existing cart items from AsyncStorage
            const cartItems = await AsyncStorage.getItem("cart");
            let cartArray = cartItems ? JSON.parse(cartItems) : [];

            // Check if book already exists in cart
            const existingBookIndex = cartArray.findIndex(item => item.id === parsedBookID);
            if (existingBookIndex === -1) {
                // If book doesn't exist, add it to cart
                cartArray.push(bookData);
            }
            // If book exists, we won't update quantity since it's fixed at 1

            // Save updated cart to AsyncStorage
            await AsyncStorage.setItem("cart", JSON.stringify(cartArray));

            console.log("Added to cart:", { bookData, cartArray });
            navigation.navigate("Giỏ hàng", { addedBook: bookData });
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };

    if (loading) {
        console.log("Rendering loading state for parsedBookID:", parsedBookID);
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    if (error) {
        console.log("Rendering error state:", error);
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    console.log("Rendering book details:", {
        parsedBookID,
        bookName: book.bookName,
        isFavorite,
        hasImage: !!book.image,
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                    >
                        <Icon
                            name={isFavorite ? "star" : "star-o"}
                            size={30}
                            color={isFavorite ? "gold" : "#5A4032"}
                        />
                    </TouchableOpacity>
                    {Array.isArray(book.image) && book.image.length > 0 ? (
                        <Image
                            source={{ uri: book.image[0] }}
                            style={styles.bookImage}
                            onError={(e) => console.log("Image load error:", e)}
                        />
                    ) : typeof book.image === "string" && book.image.trim() ? (
                        <Image
                            source={{ uri: book.image }}
                            style={styles.bookImage}
                            onError={(e) => console.log("Image load error:", e)}
                        />
                    ) : (
                        <Image
                            source={require("../assets/loi-404-tren-cyber-panel.jpg")}
                            style={styles.bookImage}
                        />
                    )}
                </View>

                <View style={styles.detailsCard}>
                    <Text style={styles.title}>{book.bookName}</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Tác giả: </Text>
                        <Text style={styles.value}>
                            {book.actor?.actorName
                                ? book.actor.actorName
                                : "Chưa xác định"}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Danh mục: </Text>
                        <Text style={styles.value}>
                            {book.category ? book.category.categoryName : "Không có"}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Mô tả: </Text>
                        <Text style={styles.description}>{book.description}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.priceButton}
                        onPress={handleAddToCart}
                    >
                        <View style={styles.priceButtonContent}>
                            <Icon size={24} color="#FFF8E7" />
                            <Text style={styles.priceButtonText}>
                                {book?.price?.$numberDecimal
                                    ? `${parseFloat(book.price.$numberDecimal).toLocaleString("vi-VN")} ₫`
                                    : "Không có giá"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5E8C7",
    },
    content: {
        padding: 15,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5E8C7",
    },
    imageContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#8F6B4A",
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        position: "relative",
    },
    bookImage: {
        width: "90%",
        height: 300,
        borderRadius: 10,
        resizeMode: "contain",
    },
    detailsCard: {
        backgroundColor: "#FFF8E7",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#5A4032",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "System",
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "flex-start",
    },
    label: {
        fontSize: 18,
        color: "#7A5D3F",
        fontWeight: "600",
        width: 100,
        fontFamily: "System",
    },
    value: {
        fontSize: 18,
        color: "#3D2B1F",
        flex: 1,
        fontFamily: "System",
    },
    description: {
        fontSize: 16,
        color: "#3D2B1F",
        lineHeight: 24,
        flex: 1,
        fontFamily: "System",
    },
    loadingText: {
        fontSize: 18,
        color: "#5A4032",
        marginTop: 10,
        fontFamily: "System",
    },
    errorText: {
        fontSize: 18,
        color: "#D32F2F",
        fontFamily: "System",
    },
    favoriteButton: {
        position: "absolute",
        left: 15,
        top: 15,
        zIndex: 1,
    },
    priceButton: {
        marginTop: 20,
        backgroundColor: "#8F6B4A",
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
    },
    priceButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    priceButtonText: {
        marginLeft: 10,
        fontSize: 18,
        color: "#FFF8E7",
        fontFamily: "System",
        fontWeight: "600",
    },
});

export default DetailScreen;