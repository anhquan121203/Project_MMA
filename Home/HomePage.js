import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

const ERROR_IMAGE = require('../assets/loi-404-tren-cyber-panel.jpg');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bookshelf-be.onrender.com';

export default function HomeScreen({ navigation }) {
    const [image, setImage] = useState('https://i.pinimg.com/564x/79/18/0d/79180d55bc72774c0b5a7daaf14de77f.jpg');
    const [carouselItems, setCarouselItems] = useState([]);
    const [trendingBooks, setTrendingBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/books`)
            .then(response => response.json())
            .then(data => {
                const formattedItems = data.slice(0, 3).map(book => ({
                    title: book.bookName,
                    image: book.image || book.coverUrl || null,
                    bookID: book._id
                }));
                setCarouselItems(formattedItems);

                const booksData = data.map(book => ({
                    bookName: book.bookName,
                    quantity: book.quantity || 0,
                    image: book.image || book.coverUrl || null,
                    bookID: book._id
                }));
                setTrendingBooks(booksData);
                setFilteredBooks(booksData);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                setCarouselItems([
                    { title: 'Book 1', image: null },
                    { title: 'Book 2', image: null },
                    { title: 'Book 3', image: null },
                ]);
                setTrendingBooks([]);
                setFilteredBooks([]);
            });
    }, []);

    const handleSearch = (text) => {
        setSearchTerm(text);
        if (text.trim() === '') {
            setFilteredBooks(trendingBooks);
        } else {
            const filtered = trendingBooks.filter(book =>
                book.bookName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredBooks(filtered);
        }
    };

    const getValidImage = (imageUrl) => {
        if (imageUrl && imageUrl !== 'null' && imageUrl !== '' && typeof imageUrl === 'string') {
            return { uri: imageUrl };
        }
        return ERROR_IMAGE;
    };

    const navigateToDetail = (bookID) => {
        navigation.navigate('Chi tiết', { bookID });
    };

    // Container object for Carousel images
    const CarouselImageContainer = ({ item }) => (
        <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigateToDetail(item.bookID)}
        >
            <View style={{
                flex: 1,
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                height: 200, // Giữ nguyên chiều cao container
                justifyContent: 'center', // Căn giữa theo chiều dọc
                alignItems: 'center', // Căn giữa theo chiều ngang
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Thêm background để thấy rõ vùng container
            }}>
                <Image
                    source={getValidImage(item.image)}
                    style={{
                        width: '80%', // Giảm chiều rộng ảnh xuống 80% container
                        height: '80%', // Giảm chiều cao ảnh xuống 80% container
                        borderRadius: 10,
                    }}
                    resizeMode="contain" // Giữ tỷ lệ ảnh, không crop
                    defaultSource={ERROR_IMAGE}
                />
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 10
                }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 10,
                        textAlign: 'center'
                    }}>
                        {item.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#C4A484' }}>
            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#fff' }}>Xin chào USER 🌿</Text>
                    <Image
                        source={getValidImage(image)}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                </View>

                <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10, color: '#fff' }}>
                    Relax and read book
                </Text>

                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 10,
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <FontAwesome name="search" size={20} color="#000" style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Search book"
                        style={{ flex: 1 }}
                        value={searchTerm}
                        onChangeText={handleSearch}
                    />
                </View>

                <View style={{ height: 200, marginBottom: 20 }}>
                    <Swiper
                        style={{}}
                        showsButtons={false}
                        autoplay={true}
                        autoplayTimeout={3}
                        showsPagination={false}
                    >
                        {carouselItems.map((item, index) => (
                            <CarouselImageContainer key={index} item={item} />
                        ))}
                    </Swiper>
                </View>

                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: 10
                }}>
                    Sách đang nổi
                </Text>

                <View style={{ marginBottom: 20 }}>
                    {filteredBooks.map((book, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                padding: 10,
                                borderRadius: 10,
                                marginBottom: 10
                            }}
                            onPress={() => navigateToDetail(book.bookID)}
                        >
                            <Image
                                source={getValidImage(book.image)}
                                style={{
                                    width: 50,
                                    height: 70,
                                    borderRadius: 5,
                                    marginRight: 10
                                }}
                                resizeMode="cover"
                                defaultSource={ERROR_IMAGE}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>
                                    {book.bookName}
                                </Text>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 14
                                }}>
                                    Còn: {book.quantity}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {filteredBooks.length === 0 && (
                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                            Không tìm thấy sách nào
                        </Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}