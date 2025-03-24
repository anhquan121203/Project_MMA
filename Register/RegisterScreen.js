import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'https://bookshelf-be.onrender.com';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!userName || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, email, password }),
            });
            console.log(userName, email, password)
            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Registration successful!");
                navigation.navigate('Đăng nhập');
            } else {
                Alert.alert("Error", data.message || "Registration failed.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong!");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.backgroundDecoration} />

            <View style={styles.headerContainer}>
                <Text style={styles.title}>Hãy bắt đầu!</Text>
                <Text style={styles.subtitle}>Tạo tài khoản của bạn</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputOuterContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="person-outline" size={20} color="#D4AF37" />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Tên tài khoản"
                        placeholderTextColor="rgba(248, 240, 229, 0.4)"
                        value={userName}
                        onChangeText={setUsername}
                    />
                </View>

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
                        style={styles.input}
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

                <View style={styles.inputOuterContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#D4AF37" />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Xác nhận mật khẩu"
                        placeholderTextColor="rgba(248, 240, 229, 0.4)"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.icon}>
                        <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#D4AF37" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <Text style={styles.agreement}>
                    Bằng cách tạo tài khoản hoặc tiếp tục với Google, bạn đồng ý với{' '}
                    <Text style={styles.link}>Điều khoản dịch vụ</Text> và <Text style={styles.link}>Chính sách bảo mật</Text>.
                </Text>

                <TouchableOpacity style={styles.createAccountButton} onPress={handleRegister}>
                    <Text style={styles.createAccountText}>Tạo tài khoản</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>HOẶC</Text>
                    <View style={styles.divider} />
                </View>

                <TouchableOpacity style={styles.googleButton}>
                    <Ionicons name="logo-google" size={20} color="#D4AF37" />
                    <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                    Đã có tài khoản?{' '}
                    <TouchableOpacity onPress={() => navigation.navigate('Đăng nhập')}>
                        <Text style={styles.link}>Đăng nhập</Text>
                    </TouchableOpacity>
                </Text>
            </View>
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
        top: -200,
        left: -150,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#D4AF37',
        opacity: 0.03,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 140,
        paddingBottom: 30,
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
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
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
        marginBottom: 18,
        position: 'relative',
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
    icon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    agreement: {
        fontSize: 12,
        color: '#F8F0E5',
        textAlign: 'center',
        marginBottom: 17,
        opacity: 0.6,
        lineHeight: 18,
    },
    link: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: '#D4AF37',
    },
    createAccountButton: {
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
    createAccountText: {
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
});
