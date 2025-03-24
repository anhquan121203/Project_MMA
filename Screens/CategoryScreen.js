import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ProductScreen from './ProductScreen';

// API URL từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bookshelf-be.onrender.com';

function CategoryScreen({ navigation }) { // Thêm navigation prop từ React Navigation
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [listKey, setListKey] = useState(0);

    // Lấy danh sách danh mục khi component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/api/categories`);
                const data = await response.json();
                setCategories(data);
                setLoading(false);
                setListKey(prevKey => prevKey + 1);
            } catch (err) {
                setError('Không thể tải danh mục');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Render từng danh mục với khả năng nhấn để điều hướng
    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate('Sách', { categoryName: item.categoryName })} // Điều hướng sang ProductScreen
        >
            <Image
                source={require('../assets/loi-404-tren-cyber-panel.jpg')}
                style={styles.backgroundImage}
            />
            <Text style={styles.categoryText}>{item.categoryName}</Text>
        </TouchableOpacity>
    );

    // Hiển thị loading, lỗi, hoặc danh sách
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
            <Text style={styles.header}>Danh mục sách</Text>
            <FlatList
                key={listKey}
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id ? item.id.toString() : item.categoryName}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

// Styles cho màn hình
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
    categoryItem: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        margin: 5,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        position: 'absolute',
        opacity: 0.5,
    },
    categoryText: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        top: 25,
        zIndex: 1,
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
});

export default CategoryScreen;