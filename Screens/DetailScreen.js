import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons, MaterialIcons, AntDesign } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import useNotification from "../hooks/useNotification";

const { width, height } = Dimensions.get("window");
const API_URL =
    process.env.EXPO_PUBLIC_API_URL || "https://bookshelf-be.onrender.com";

function DetailScreen({ route, navigation }) {
    const { bookID } = route.params;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { showNotification, NotificationComponent } = useNotification();

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
                showNotification({
                    title: "Đã xóa khỏi yêu thích",
                    message: "Sách này đã được xóa khỏi danh sách yêu thích của bạn",
                    type: "info",
                    duration: 2000
                });
            } else {
                favoritesArray.push(parsedBookID);
                console.log("Added to favorites", { parsedBookID, favoritesArray });
                showNotification({
                    title: "Đã thêm vào yêu thích",
                    message: "Sách này đã được thêm vào danh sách yêu thích của bạn",
                    type: "success",
                    duration: 2000
                });
            }

            await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error("Error toggling favorite:", err);
            showNotification({
                title: "Lỗi",
                message: "Không thể cập nhật danh sách yêu thích",
                type: "error",
                duration: 3000
            });
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
                quantity: 1
            };

            // Get existing cart items from AsyncStorage
            const cartItems = await AsyncStorage.getItem("cart");
            let cartArray = cartItems ? JSON.parse(cartItems) : [];

            const existingBookIndex = cartArray.findIndex(item => item.id === parsedBookID);
            if (existingBookIndex === -1) {
                cartArray.push(bookData);
                showNotification({
                    title: "Đã thêm vào giỏ hàng",
                    message: "Sách đã được thêm vào giỏ hàng của bạn",
                    type: "success",
                    duration: 2000
                });
            } else {
                showNotification({
                    title: "Đã có trong giỏ hàng",
                    message: "Sách đã có trong giỏ hàng của bạn",
                    type: "info",
                    duration: 2000
                });
            }

            await AsyncStorage.setItem("cart", JSON.stringify(cartArray));

            console.log("Added to cart:", { bookData, cartArray });

            setTimeout(() => {
                navigation.navigate("Giỏ hàng", { addedBook: bookData });
            }, 1000);

        } catch (err) {
            console.error("Error adding to cart:", err);
            showNotification({
                title: "Lỗi",
                message: "Không thể thêm sách vào giỏ hàng",
                type: "error",
                duration: 3000
            });
        }
    };

    if (loading) {
        console.log("Rendering loading state for parsedBookID:", parsedBookID);
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Đang tải thông tin sách...</Text>
            </View>
        );
    }

    if (error) {
        console.log("Rendering error state:", error);
        return (
            <View style={styles.errorContainer}>
                <StatusBar barStyle="light-content" />
                <Icon name="exclamation-triangle" size={60} color="#D4AF37" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.errorButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.errorButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    console.log("Rendering book details:", {
        parsedBookID,
        bookName: book.bookName,
        isFavorite,
        hasImage: !!book.image,
    });

    const getImageSource = () => {
        if (Array.isArray(book.image) && book.image.length > 0) {
            return { uri: book.image[0] };
        } else if (typeof book.image === "string" && book.image.trim()) {
            return { uri: book.image };
        } else {
            return require("../assets/loi-404-tren-cyber-panel.jpg");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NotificationComponent />

            {/* Top action bar */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#F8F0E5" />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={28}
                            color={isFavorite ? "#D4AF37" : "#F8F0E5"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareButton}>
                        <Ionicons name="share-social-outline" size={28} color="#F8F0E5" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.imageSection}>
                    <Image
                        source={getImageSource()}
                        style={styles.bookImage}
                        resizeMode="contain"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(22, 20, 25, 0.8)', 'rgba(22, 20, 25, 1)']}
                        style={styles.imageOverlay}
                    />
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{book.bookName}</Text>

                    <View style={styles.authorRow}>
                        <Text style={styles.authorLabel}>Bởi </Text>
                        <Text style={styles.authorName}>
                            {book.actor?.actorName ? book.actor.actorName : "Tác giả không xác định"}
                        </Text>
                    </View>

                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="bookmark-outline" size={20} color="#D4AF37" />
                            <Text style={styles.detailText}>
                                {book.category ? book.category.categoryName : "Không xác định"}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailItem}>
                            <Ionicons name="language-outline" size={20} color="#D4AF37" />
                            <Text style={styles.detailText}>Tiếng Việt</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailItem}>
                            <Ionicons name="albums-outline" size={20} color="#D4AF37" />
                            <Text style={styles.detailText}>Bìa mềm</Text>
                        </View>
                    </View>

                    <View style={styles.priceSection}>
                        <View style={styles.priceTag}>
                            <Text style={styles.priceLabel}>Giá</Text>
                            <Text style={styles.priceValue}>
                                {book?.price?.$numberDecimal
                                    ? `${parseFloat(book.price.$numberDecimal).toLocaleString("vi-VN")} ₫`
                                    : "Giá không khả dụng"}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={handleAddToCart}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cartButtonText}>Thêm vào giỏ hàng</Text>
                            <Ionicons name="cart-outline" size={20} color="#161419" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Mô tả</Text>
                        <Text style={styles.descriptionText}>
                            {book.description || "Không có mô tả cho cuốn sách này."}
                        </Text>
                    </View>

                    {/* Additional book information */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.sectionTitle}>Thông tin sách</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Danh mục</Text>
                            <Text style={styles.infoValue}>
                                {book.category ? book.category.categoryName : "Không xác định"}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Tác giả</Text>
                            <Text style={styles.infoValue}>
                                {book.actor?.actorName ? book.actor.actorName : "Không xác định"}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Nhà xuất bản</Text>
                            <Text style={styles.infoValue}>BookShelf Publishing</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Ngôn ngữ</Text>
                            <Text style={styles.infoValue}>Tiếng Việt</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Trang</Text>
                            <Text style={styles.infoValue}>
                                {book.pages || "Không xác định"}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161419",
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: "#F8F0E5",
        marginTop: 20,
        marginBottom: 30,
        textAlign: "center",
    },
    errorButton: {
        backgroundColor: "#D4AF37",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 30,
    },
    errorButtonText: {
        color: "#161419",
        fontSize: 16,
        fontWeight: "bold",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(22, 20, 25, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(248, 240, 229, 0.2)",
    },
    headerActions: {
        flexDirection: "row",
    },
    favoriteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(22, 20, 25, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "rgba(248, 240, 229, 0.2)",
    },
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(22, 20, 25, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(248, 240, 229, 0.2)",
    },
    scrollContainer: {
        flex: 1,
    },
    imageSection: {
        height: height * 0.55,
        width: width,
        position: "relative",
    },
    bookImage: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(20, 20, 30, 0.9)",
    },
    imageOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    detailsContainer: {
        marginTop: -40,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#161419",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    authorLabel: {
        fontSize: 16,
        color: "rgba(248, 240, 229, 0.6)",
    },
    authorName: {
        fontSize: 16,
        color: "#D4AF37",
        fontWeight: "500",
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 25,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    detailText: {
        color: "#F8F0E5",
        fontSize: 14,
        marginLeft: 6,
    },
    divider: {
        width: 1,
        height: 25,
        backgroundColor: "rgba(248, 240, 229, 0.2)",
    },
    priceSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    priceTag: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        color: "rgba(248, 240, 229, 0.6)",
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#D4AF37",
    },
    cartButton: {
        backgroundColor: "#D4AF37",
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    cartButtonText: {
        color: "#161419",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8,
    },
    descriptionContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginBottom: 15,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: "rgba(248, 240, 229, 0.8)",
    },
    infoContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(248, 240, 229, 0.1)",
    },
    infoLabel: {
        fontSize: 15,
        color: "rgba(248, 240, 229, 0.6)",
    },
    infoValue: {
        fontSize: 15,
        color: "#F8F0E5",
        fontWeight: "500",
    },
});

export default DetailScreen;