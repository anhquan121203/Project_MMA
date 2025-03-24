import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import Login from '../Login/LoginScreen';
import Register from '../Register/RegisterScreen';
import ProductScreen from "../Screens/ProductScreen";
import DetailScreen from "../Screens/DetailScreen";
import BeginScreen from '../Screens/BeginScreen';
import HomeScreen from '../Home/HomePage';
import QRScreen from '../Screens/QRScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import CategoryScreen from '../Screens/CategoryScreen';
import { NavigationContainer } from '@react-navigation/native';
// import ResultScreen from '../Screens/ResultScreen';
import ChangeInfoScreen from "../Screens/ChangeInfoScreen";
import ForgotPasswordScreen from "../Screens/ForgotPasswordScreen";
import FavoriteScreen from "../Screens/FavoriteScreen";
import CartScreen from '../Screens/CartScreen';
import InvoiceDetailScreen from '../Screens/InvoiceDetailScreen';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Category Tab
const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#1D1C21',
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTintColor: '#F8F0E5',
                headerTitleStyle: {
                    fontWeight: "bold",
                    letterSpacing: 0.5,
                },
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen name="Begin" component={BeginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Đăng ký" component={Register} options={{ headerTransparent: true, headerTitle: '' }} />
            <Stack.Screen name="Đăng nhập" component={Login} options={{ headerTransparent: true, headerTitle: '' }} />
            <Stack.Screen name="Trang chủ" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Thể loại" component={CategoryScreen} />
            <Stack.Screen name="Sách" component={ProductScreen} />
            <Stack.Screen name="Chi tiết" component={DetailScreen} />
            <Stack.Screen name="Thông tin" component={ProfileScreen} />
            {/* <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Result' }} /> */}
            <Stack.Screen name="Quên mật khẩu" component={ForgotPasswordScreen} options={{ headerTransparent: true, headerTitle: '' }} />
            <Stack.Screen name="Thay đổi thông tin" component={ChangeInfoScreen} />
            <Stack.Screen name="Giỏ hàng" component={CartScreen} />
            <Stack.Screen name="Hóa đơn" component={InvoiceDetailScreen} />
            <Stack.Screen
                name="Yêu thích"
                component={FavoriteScreen}
                options={{
                    title: "Sách yêu thích",
                }}
            />
        </Stack.Navigator>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#161419',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderTopWidth: 0,
                    elevation: 15,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                },
                tabBarActiveTintColor: '#D4AF37',
                tabBarInactiveTintColor: 'rgba(248, 240, 229, 0.5)',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="home" size={22} color={color} />)
                }}
            />
            <Tab.Screen
                name="Category"
                component={CategoryScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="list" size={22} color={color} />)
                }}
            />
            <Tab.Screen
                name="QR"
                component={QRScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View style={{
                            backgroundColor: '#D4AF37',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 8,
                        }}>
                            <FontAwesome name="qrcode" size={24} color="#161419" />
                        </View>
                    ),
                    tabBarLabel: () => null,
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="shopping-cart" size={22} color={color} />)
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="user" size={22} color={color} />)
                }}
            />
        </Tab.Navigator>
    );
};

export default function Navigator() {
    return (
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    );
}