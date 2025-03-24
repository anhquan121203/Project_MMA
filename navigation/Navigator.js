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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Category Tab
const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Begin" component={BeginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Đăng ký" component={Register} />
            <Stack.Screen name="Đăng nhập" component={Login} />
            <Stack.Screen name="Trang chủ" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Thể loại" component={CategoryScreen} />
            <Stack.Screen name="Sách" component={ProductScreen} />
            <Stack.Screen name="Chi tiết" component={DetailScreen} />
            <Stack.Screen name="Thông tin" component={ProfileScreen} />
            {/* <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Result' }} /> */}
            <Stack.Screen name="Quên mật khẩu" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Thay đổi thông tin" component={ChangeInfoScreen} />
            <Stack.Screen name="Giỏ hàng" component={CartScreen} />
            <Stack.Screen name="Hóa đơn" component={InvoiceDetailScreen} />
            <Stack.Screen
                name="Yêu thích"
                component={FavoriteScreen}
                options={{
                    title: "Sách yêu thích",
                    headerStyle: {
                        backgroundColor: "#8B5E3C",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
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
                tabBarStyle: { backgroundColor: '#8B5E3C' },
                tabBarActiveTintColor: '#1E90FF',
                tabBarInactiveTintColor: '#E0E0E0',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="home" size={24} color={color} />)
                }}
            />
            <Tab.Screen
                name="Category"
                component={CategoryScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="list" size={24} color={color} />)
                }}
            />
            <Tab.Screen
                name="QR"
                component={QRScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="qrcode" size={24} color={color} />)
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="shopping-cart" size={24} color={color} />)
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (<FontAwesome name="user" size={24} color={color} />)
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