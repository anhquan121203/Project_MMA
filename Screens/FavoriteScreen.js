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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL || "https://bookshelf-be.onrender.com";

function FavoriteScreen({ navigation }) {
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const scaleAnim = new Animated.Value(1);

    const fetchFavoriteBooks = async () => {
        try {
            // Get favorite book IDs from AsyncStorage
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
            console.error("Error fetching favorite books:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFavoriteBooks();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFavoriteBooks();
    }, []);

    const removeFavorite = async (bookId) => {
        try {
            const favorites = await AsyncStorage.getItem("favorites");
            let favoritesArray = favorites ? JSON.parse(favorites) : [];
            favoritesArray = favoritesArray.filter((id) => id !== bookId);
            await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));

            // Update the UI
            setFavoriteBooks((prevBooks) =>
                prevBooks.filter((book) => book._id !== bookId)
            );
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    };

    const handleBookPress = (bookId) => {
        // Scale down animation
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
                fromFavorite: true, // Add flag to indicate navigation source
            });
        });
    };

    const renderBookItem = ({ item }) => (
        <Animated.View
            style={[styles.bookCard, { transform: [{ scale: scaleAnim }] }]}
        >
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(item._id)}
            >
                <Icon name="times-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleBookPress(item._id)}
                activeOpacity={0.7}
            >
                {/* Book Image */}
                <View style={styles.imageContainer}>
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

                {/* Book Info */}
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={2}>
                        {item.bookName}
                    </Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                        {item.actorID?.actorName || "Chưa xác định"}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (favoriteBooks.length === 0) {
        return (
            <View style={styles.center}>
                <Icon name="heart-o" size={50} color="#5A4032" />
                <Text style={styles.emptyText}>Chưa có sách yêu thích</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favoriteBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#FFD700"]}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5E8C7",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5E8C7",
    },
    listContainer: {
        padding: 10,
    },
    bookCard: {
        flex: 1,
        margin: 8,
        backgroundColor: "#FFF8E7",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        position: "relative",
        transform: [{ scale: 1 }],
    },
    imageContainer: {
        width: "100%",
        height: 180,
        backgroundColor: "#8F6B4A",
        justifyContent: "center",
        alignItems: "center",
    },
    bookImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    bookInfo: {
        padding: 10,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#5A4032",
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 14,
        color: "#7A5D3F",
    },
    loadingText: {
        fontSize: 18,
        color: "#5A4032",
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        color: "#D32F2F",
    },
    emptyText: {
        fontSize: 18,
        color: "#5A4032",
        marginTop: 10,
        textAlign: "center",
    },
    removeButton: {
        position: "absolute",
        right: 8,
        top: 8,
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 12,
        padding: 4,
    },
});

export default FavoriteScreen;