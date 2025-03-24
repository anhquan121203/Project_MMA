import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// API URL từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bookshelf-be.onrender.com';

function ProductScreen({ route, navigation }) {
    const { categoryName } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/books?categoryName=${categoryName}`);
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải danh sách sản phẩm');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('Chi tiết', { bookID: item._id })}
        >
            {Array.isArray(item.image) && item.image.length > 0 ? (
                <Image
                    source={{ uri: item.image[0] }} // Use the first image in the array
                    style={styles.productImage}
                    onError={(error) => console.log('Image load error:', error)}
                />
            ) : typeof item.image === 'string' && item.image.trim() ? (
                <Image
                    source={{ uri: item.image }} // Use the string directly as a URI
                    style={styles.productImage}
                    onError={(error) => console.log('Image load error:', error)}
                />
            ) : (
                <Image
                    source={require('../assets/loi-404-tren-cyber-panel.jpg')}
                    style={styles.productImage}
                />
            )}
            <Text style={styles.productTitle}>{item.bookName}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Đang tải...</Text>
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sách trong danh mục: {categoryName}</Text>
            <FlatList
                data={products}
                renderItem={renderProduct}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4A484',
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    productItem: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    productTitle: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginTop: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    list: {
        paddingBottom: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    // Optional: If using ScrollView for multiple images
    imageScroll: {
        width: '100%',
        height: 150,
    },
});

export default ProductScreen;