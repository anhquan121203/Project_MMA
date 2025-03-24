import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, Keyboard, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import useNotification from '../hooks/useNotification';
import { StatusBar } from 'expo-status-bar';

// Lấy URL API từ .env
const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'https://bookshelf-be.onrender.com';

// Component Checkbox Tùy chỉnh
const CustomCheckBox = ({ value, onChange }) => {
    return (
        <Pressable style={styles.checkbox} onPress={() => onChange(!value)}>
            <Ionicons name={value ? "checkbox-outline" : "square-outline"} size={20} color="#D4AF37" />
        </Pressable>
    );
};

export default function Login() {
    const route = useRoute()
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const { showNotification, NotificationComponent } = useNotification();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    // Tải thông tin đã lưu khi component mount
    useFocusEffect(
        useCallback(() => {
            const loadCredentials = async () => {
                try {
                    const savedEmail = await SecureStore.getItemAsync('savedEmail');
                    const savedPassword = await SecureStore.getItemAsync('savedPassword');
                    const savedRememberMe = await SecureStore.getItemAsync('rememberMe');

                    if (savedRememberMe === 'true' && savedEmail && savedPassword) {
                        setEmail(savedEmail);
                        setPassword(savedPassword);
                        setRememberMe(true);
                    }
                } catch (error) {
                    console.error('Error loading saved credentials:', error);
                    showNotification({
                        title: 'Error',
                        message: 'Could not load saved credentials',
                        type: 'error'
                    });
                }
            };
            loadCredentials();
        }, [route]));

    // Xử lý đăng nhập
    const handleLogin = async () => {
        if (!email || !password) {
            showNotification({
                title: 'Thiếu thông tin',
                message: 'Vui lòng nhập email và mật khẩu của bạn.',
                type: 'warning',
                duration: 3000
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Lưu thông tin nếu "Remember me" được chọn
                if (rememberMe) {
                    await SecureStore.setItemAsync('savedEmail', email);
                    await SecureStore.setItemAsync('savedPassword', password);
                    await SecureStore.setItemAsync('rememberMe', 'true');
                } else {
                    // Xóa thông tin nếu "Remember me" không được chọn
                    await SecureStore.deleteItemAsync('savedEmail');
                    await SecureStore.deleteItemAsync('savedPassword');
                    await SecureStore.deleteItemAsync('rememberMe');
                }

                // Lưu token nếu cần
                // await SecureStore.setItemAsync('userToken', data.token);
                showNotification({
                    title: 'Chào mừng trở lại',
                    message: 'Đăng nhập thành công! Đang chuyển hướng đến trang chủ...',
                    type: 'success',
                    duration: 2000
                });

                setTimeout(() => {
                    navigation.navigate('Trang chủ'); // Chuyển hướng đến Home
                }, 1500);
            } else {
                showNotification({
                    title: 'Đăng nhập thất bại',
                    message: data.message || "Vui lòng kiểm tra thông tin đăng nhập và thử lại.",
                    type: 'error',
                    duration: 4000
                });
            }
        } catch (error) {
            console.error(error);
            showNotification({
                title: 'Lỗi kết nối',
                message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.',
                type: 'error',
                duration: 4000
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <NotificationComponent />
            <View style={styles.backgroundDecoration} />

            <View style={styles.headerContainer}>
                <Text style={styles.title}>Chào mừng trở lại</Text>
                <Text style={styles.subtitle}>Đăng nhập vào tài khoản của bạn</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputOuterContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="mail-outline" size={20} color="#D4AF37" />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="rgba(248, 240, 229, 0.4)"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputOuterContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#D4AF37" />
                    </View>
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Mật khẩu"
                        placeholderTextColor="rgba(248, 240, 229, 0.4)"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#D4AF37" />
                    </TouchableOpacity>
                </View>

                <View style={styles.rememberContainer}>
                    <CustomCheckBox value={rememberMe} onChange={setRememberMe} />
                    <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Quên mật khẩu')}>
                        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.LoginButton}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                >
                    <Text style={styles.LoginText}>Đăng nhập</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>HOẶC</Text>
                    <View style={styles.divider} />
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="logo-google" size={20} color="#D4AF37" />
                    <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
                </TouchableOpacity>
            </View>

            {!isKeyboardVisible && (
                <View style={styles.footerContainer}>
                    <Text style={styles.agreement}>
                        Bằng cách tạo tài khoản hoặc tiếp tục với Google, bạn đồng ý với{' '}
                        <Text style={styles.link}>Điều khoản dịch vụ</Text> và <Text style={styles.link}>Chính sách bảo mật</Text>.
                    </Text>

                    <Text style={styles.footerText}>
                        Không có tài khoản?{' '}
                        <Text style={styles.link} onPress={() => navigation.navigate('Đăng ký')}>
                            Đăng ký
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161419',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 0,
    },
    backgroundDecoration: {
        position: 'absolute',
        top: -150,
        right: -150,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#D4AF37',
        opacity: 0.03,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 170,
        paddingBottom: 40,
    },
    formContainer: {
        width: '85%',
        marginBottom: 20,
    },
    actionsContainer: {
        width: '85%',
        alignItems: 'center',
    },
    footerContainer: {
        width: '85%',
        position: 'absolute',
        bottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F8F0E5',
        marginBottom: 10,
        letterSpacing: 1,
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 18,
        color: '#F8F0E5',
        marginBottom: 10,
        opacity: 0.8,
    },
    inputOuterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    inputIconContainer: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 12,
        padding: 10,
        marginRight: 10,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 15,
        padding: 15,
        fontSize: 15,
        color: '#F8F0E5',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    inputContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 20,
    },
    inputPassword: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 15,
        padding: 15,
        fontSize: 15,
        color: '#F8F0E5',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    icon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
    },
    rememberText: {
        color: '#F8F0E5',
        fontSize: 14,
        opacity: 0.8,
    },
    forgotPassword: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginLeft: 'auto',
    },
    agreement: {
        fontSize: 12,
        color: '#F8F0E5',
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.6,
        lineHeight: 18,
    },
    link: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: '#D4AF37',
    },
    LoginButton: {
        backgroundColor: '#D4AF37',
        width: '100%',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    LoginText: {
        color: '#161419',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 25,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    orText: {
        marginHorizontal: 15,
        color: '#F8F0E5',
        opacity: 0.6,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        padding: 16,
        borderRadius: 30,
        justifyContent: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    googleButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#F8F0E5',
        fontWeight: '500',
    },
    footerText: {
        color: '#F8F0E5',
        fontSize: 14,
        opacity: 0.8,
        textAlign: 'center',
    },
    checkbox: {
        marginRight: 10,
    },
});