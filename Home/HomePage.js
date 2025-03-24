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
                borderRadius: 25,
                overflow: 'hidden',
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(20, 20, 30, 0.4)',
                margin: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.45,
                shadowRadius: 10,
                elevation: 15,
                borderWidth: 1,
                borderColor: 'rgba(212, 175, 55, 0.15)',
            }}>
                <Image
                    source={getValidImage(item.image)}
                    style={{
                        width: '90%',
                        height: '90%',
                        borderRadius: 20,
                    }}
                    resizeMode="contain"
                    defaultSource={ERROR_IMAGE}
                />
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    backgroundColor: 'rgba(13, 10, 20, 0.85)',
                    borderTopWidth: 1,
                    borderColor: 'rgba(212, 175, 55, 0.2)',
                }}>
                    <Text style={{
                        color: '#F8F0E5',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 10,
                        textAlign: 'center',
                        letterSpacing: 0.8,
                    }}>
                        {item.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#161419' }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 220,
                backgroundColor: '#D4AF37',
                opacity: 0.03,
                borderBottomLeftRadius: 60,
                borderBottomRightRadius: 60,
            }} />

            <View style={{ padding: 22 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 22,
                    marginTop: 10,
                }}>
                    <View>
                        <Text style={{
                            fontSize: 13,
                            color: '#D4AF37',
                            marginBottom: 6,
                            letterSpacing: 1.5,
                            opacity: 0.9,
                        }}>CHÀO MỪNG</Text>
                        <Text style={{
                            fontSize: 22,
                            color: '#F8F0E5',
                            fontWeight: 'bold',
                            letterSpacing: 0.5,
                        }}>Your BookShelf 🌿</Text>
                    </View>
                    <View style={{
                        borderWidth: 2,
                        borderColor: '#D4AF37',
                        borderRadius: 30,
                        padding: 2,
                        shadowColor: "#D4AF37",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 4,
                    }}>
                        <Image
                            source={getValidImage(image)}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                    </View>
                </View>

                <Text style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    marginVertical: 18,
                    color: '#F8F0E5',
                    letterSpacing: 0.5,
                    textShadowColor: "rgba(0, 0, 0, 0.3)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                }}>
                    Thư giãn và đọc sách
                </Text>

                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 30,
                    paddingVertical: 14,
                    paddingHorizontal: 18,
                    alignItems: 'center',
                    marginBottom: 25,
                    borderWidth: 1,
                    borderColor: 'rgba(212, 175, 55, 0.25)',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }}>
                    <FontAwesome name="search" size={18} color="#D4AF37" style={{ marginRight: 12 }} />
                    <TextInput
                        placeholder="Tìm kiếm sách..."
                        placeholderTextColor="rgba(248, 240, 229, 0.4)"
                        style={{ flex: 1, color: '#F8F0E5', fontSize: 15 }}
                        value={searchTerm}
                        onChangeText={handleSearch}
                    />
                </View>

                <View style={{
                    height: 230,
                    marginBottom: 30,
                    marginHorizontal: -12,
                }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: '600',
                        color: '#D4AF37',
                        marginBottom: 12,
                        marginLeft: 12,
                        letterSpacing: 0.5,
                    }}>
                        Sách nổi bật
                    </Text>
                    <Swiper
                        style={{}}
                        showsButtons={false}
                        autoplay={true}
                        autoplayTimeout={3.5}
                        showsPagination={true}
                        paginationStyle={{ bottom: 10 }}
                        dotColor="rgba(212, 175, 55, 0.25)"
                        activeDotColor="#D4AF37"
                        dotStyle={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginLeft: 4,
                            marginRight: 4,
                        }}
                        activeDotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginLeft: 4,
                            marginRight: 4,
                        }}
                    >
                        {carouselItems.map((item, index) => (
                            <CarouselImageContainer key={index} item={item} />
                        ))}
                    </Swiper>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 15,
                }}>
                    <Text style={{
                        fontSize: 21,
                        fontWeight: 'bold',
                        color: '#F8F0E5',
                        letterSpacing: 0.5,
                    }}>
                        Sách đang nổi
                    </Text>
                    <TouchableOpacity>
                        <Text style={{
                            fontSize: 14,
                            color: '#D4AF37',
                            fontWeight: '500',
                        }}>
                            Xem tất cả
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 20 }}>
                    {filteredBooks.map((book, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                padding: 16,
                                borderRadius: 20,
                                marginBottom: 14,
                                borderLeftWidth: 4,
                                borderLeftColor: '#D4AF37',
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 5,
                                elevation: 4,
                            }}
                            onPress={() => navigateToDetail(book.bookID)}
                        >
                            <Image
                                source={getValidImage(book.image)}
                                style={{
                                    width: 65,
                                    height: 85,
                                    borderRadius: 10,
                                    marginRight: 18
                                }}
                                resizeMode="cover"
                                defaultSource={ERROR_IMAGE}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    color: '#F8F0E5',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginBottom: 8,
                                    letterSpacing: 0.3,
                                }}>
                                    {book.bookName}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Text style={{
                                        color: '#D4AF37',
                                        fontSize: 14,
                                        fontWeight: '600',
                                        marginRight: 10,
                                    }}>
                                        Còn: {book.quantity}
                                    </Text>
                                    <View style={{
                                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: 'rgba(212, 175, 55, 0.3)',
                                    }}>
                                        <Text style={{ color: '#D4AF37', fontSize: 12, fontWeight: '500' }}>Available</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                padding: 8,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(212, 175, 55, 0.2)',
                            }}>
                                <FontAwesome name="angle-right" size={18} color="#D4AF37" />
                            </View>
                        </TouchableOpacity>
                    ))}
                    {filteredBooks.length === 0 && (
                        <View style={{
                            padding: 25,
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: 'rgba(212, 175, 55, 0.1)',
                        }}>
                            <FontAwesome name="search" size={30} color="rgba(212, 175, 55, 0.4)" style={{ marginBottom: 12 }} />
                            <Text style={{ color: '#F8F0E5', textAlign: 'center', fontSize: 16, opacity: 0.8 }}>
                                Không tìm thấy sách nào
                            </Text>
                            <Text style={{ color: '#F8F0E5', textAlign: 'center', fontSize: 14, opacity: 0.5, marginTop: 5 }}>
                                Thử tìm kiếm với từ khóa khác
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}