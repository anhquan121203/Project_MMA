import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Dimensions,
    StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useNotification from "../hooks/useNotification";

const { width, height } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2; // Account for margins

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://bookshelf-be.onrender.com";

function FavoriteScreen({ navigation }) {
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const scaleAnim = new Animated.Value(1);
    const { showNotification, NotificationComponent } = useNotification();

    const fetchFavoriteBooks = async () => {
        try {
            const favorites = await AsyncStorage.getItem("favorites");
            const favoriteIds = favorites ? JSON.parse(favorites) : [];

            if (favoriteIds.length === 0) {
                setFavoriteBooks([]);
                setLoading(false);
                return;
            }

            // Fetch details for each favorite book
            const bookPromises = favoriteIds.map((id) =>
                fetch(`${API_URL}/api/books/${id}`).then((res) => res.json())
            );

            const books = await Promise.all(bookPromises);
            setFavoriteBooks(books);
        } catch (err) {
            setError("Không thể tải danh sách sách yêu thích");
            showNotification({
                title: "Lỗi",
                message: "Không thể tải danh sách sách yêu thích",
                type: "error",
                duration: 3000
            });
            console.error("Error fetching favorite books:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFavoriteBooks();
    }, []);

    useEffect(() => {
        // Refetch favorites when the screen is focused
        const unsubscribe = navigation.addListener('focus', () => {
            fetchFavoriteBooks();
        });

        return unsubscribe;
    }, [navigation]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFavoriteBooks();
    }, []);

    const removeFavorite = async (bookId, bookName) => {
        try {
            const favorites = await AsyncStorage.getItem("favorites");
            let favoritesArray = favorites ? JSON.parse(favorites) : [];
            favoritesArray = favoritesArray.filter((id) => id !== bookId);
            await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));

            setFavoriteBooks((prevBooks) =>
                prevBooks.filter((book) => book._id !== bookId)
            );

            showNotification({
                title: "Đã xóa",
                message: `"${bookName}" đã được xóa khỏi danh sách yêu thích`,
                type: "success",
                duration: 2000
            });
        } catch (err) {
            console.error("Error removing favorite:", err);
            showNotification({
                title: "Lỗi",
                message: "Không thể xóa sách khỏi danh sách yêu thích",
                type: "error",
                duration: 3000
            });
        }
    };

    const handleBookPress = (bookId) => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            navigation.navigate("Chi tiết", {
                bookID: bookId,
                fromFavorite: true,
            });
        });
    };

    const renderBookItem = ({ item, index }) => (
        <Animated.View
            style={[
                styles.bookCard,
                {
                    transform: [{ scale: scaleAnim }],
                    marginLeft: index % 2 === 0 ? 0 : 8,
                    marginRight: index % 2 === 0 ? 8 : 0
                }
            ]}
        >
            <LinearGradient
                colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
                style={styles.cardGradient}
            />

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(item._id, item.bookName)}
            >
                <Ionicons name="heart-dislike" size={20} color="#FF5E5E" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleBookPress(item._id)}
                activeOpacity={0.8}
                style={styles.bookContent}
            >
                <View style={styles.imageContainer}>
                    <LinearGradient
                        colors={['rgba(33, 31, 36, 0.9)', 'rgba(33, 31, 36, 0.6)']}
                        style={styles.imageGradient}
                    />
                    {Array.isArray(item.image) && item.image.length > 0 ? (
                        <Image
                            source={{ uri: item.image[0] }}
                            style={styles.bookImage}
                            onError={(e) => console.log("Image load error:", e)}
                        />
                    ) : typeof item.image === "string" && item.image.trim() ? (
                        <Image
                            source={{ uri: item.image }}
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

                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={2}>
                        {item.bookName}
                    </Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                        <Ionicons name="person-outline" size={12} color="#D4AF37" /> {item.actorID?.actorName || "Chưa xác định"}
                    </Text>

                    <View style={styles.bookMetaContainer}>
                        <View style={styles.metaItem}>
                            <Ionicons name="star" size={12} color="#D4AF37" />
                            <Text style={styles.metaText}>
                                {item.rating ? item.rating.toFixed(1) : "N/A"}
                            </Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Ionicons name="book-outline" size={12} color="#D4AF37" />
                            <Text style={styles.metaText}>
                                {item.pageCount || "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderHeader = () => (
        <View style={styles.headerSection}>
            <Text style={styles.sectionTitle}>Sách yêu thích của bạn</Text>
            <Text style={styles.sectionSubtitle}>
                {favoriteBooks.length > 0
                    ? `${favoriteBooks.length} cuốn sách trong bộ sưu tập`
                    : "Thêm sách yêu thích vào bộ sưu tập của bạn"}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <StatusBar barStyle="light-content" />
                <LinearGradient
                    colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)', 'rgba(22, 20, 25, 0)']}
                    style={styles.topDecoration}
                />
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Đang tải sách yêu thích...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <StatusBar barStyle="light-content" />
                <NotificationComponent />
                <LinearGradient
                    colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)', 'rgba(22, 20, 25, 0)']}
                    style={styles.topDecoration}
                />
                <MaterialIcons name="error-outline" size={60} color="#FF5E5E" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchFavoriteBooks}
                >
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (favoriteBooks.length === 0) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <NotificationComponent />
                <LinearGradient
                    colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)', 'rgba(22, 20, 25, 0)']}
                    style={styles.topDecoration}
                />

                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="heart-outline" size={70} color="#D4AF37" />
                    </View>
                    <Text style={styles.emptyTitle}>Chưa có sách yêu thích</Text>
                    <Text style={styles.emptyText}>
                        Thêm sách vào danh sách yêu thích để quản lý bộ sưu tập của bạn
                    </Text>

                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => navigation.navigate('Trang chủ')}
                    >
                        <LinearGradient
                            colors={['#D4AF37', '#C09B31']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.exploreButtonText}>Khám phá sách</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NotificationComponent />
            <LinearGradient
                colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)', 'rgba(22, 20, 25, 0)']}
                style={styles.topDecoration}
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sách yêu thích</Text>
            </View>

            <FlatList
                data={favoriteBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#D4AF37"
                        colors={["#D4AF37"]}
                        progressBackgroundColor="#161419"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161419",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#161419",
        padding: 30,
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
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 20,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#F8F0E5",
    },
    headerSection: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#D4AF37",
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "rgba(248, 240, 229, 0.6)",
    },
    listContainer: {
        padding: 12,
        paddingBottom: 80,
    },
    bookCard: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        position: "relative",
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.2)",
        height: 270,
        maxWidth: COLUMN_WIDTH,
    },
    cardGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    bookContent: {
        flex: 1,
    },
    imageContainer: {
        width: "100%",
        height: 170,
        backgroundColor: "rgba(33, 31, 36, 0.9)",
        position: "relative",
    },
    imageGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    bookImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        zIndex: 2,
    },
    bookInfo: {
        padding: 12,
        flex: 1,
        justifyContent: "space-between",
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginBottom: 4,
        lineHeight: 18,
    },
    bookAuthor: {
        fontSize: 12,
        color: "rgba(248, 240, 229, 0.7)",
        marginBottom: 6,
    },
    bookMetaContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    metaText: {
        fontSize: 11,
        color: "rgba(248, 240, 229, 0.6)",
        marginLeft: 3,
    },
    removeButton: {
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 10,
        backgroundColor: "rgba(22, 20, 25, 0.7)",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.3)",
    },
    loadingText: {
        fontSize: 16,
        color: "#F8F0E5",
        marginTop: 20,
        fontWeight: "500",
    },
    errorText: {
        fontSize: 16,
        color: "#FF5E5E",
        marginTop: 20,
        marginBottom: 20,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "rgba(212, 175, 55, 0.2)",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.4)",
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#F8F0E5",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(212, 175, 55, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.3)",
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#F8F0E5",
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: "rgba(248, 240, 229, 0.6)",
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 24,
    },
    exploreButton: {
        borderRadius: 30,
        overflow: "hidden",
        width: "70%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    gradientButton: {
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    exploreButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#161419",
    },
});

export default FavoriteScreen;