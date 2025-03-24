import { useState, useRef, useEffect } from 'react';
import {
    Animated,
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const useNotification = () => {
    const [notification, setNotification] = useState({
        visible: false,
        message: '',
        title: '',
        type: 'success',
        duration: 3000,
    });

    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const timer = useRef(null);

    useEffect(() => {
        if (notification.visible) {
            // Hiển thị thông báo
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: Platform.OS === 'ios' ? 50 : 20,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                })
            ]).start();

            // Ẩn thông báo sau khoảng thời gian
            timer.current = setTimeout(() => {
                hideNotification();
            }, notification.duration);
        }

        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [notification.visible]);

    const hideNotification = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setNotification(prev => ({ ...prev, visible: false }));
        });
    };

    const showNotification = (options) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        setNotification({
            visible: true,
            message: options.message || '',
            title: options.title || '',
            type: options.type || 'success',
            duration: options.duration || 3000,
        });
    };

    const NotificationComponent = () => {
        if (!notification.visible) return null;

        const getIconName = () => {
            switch (notification.type) {
                case 'success':
                    return { name: 'checkmark-circle', color: '#D4AF37' };
                case 'error':
                    return { name: 'close-circle', color: '#e74c3c' };
                case 'warning':
                    return { name: 'warning', color: '#f39c12' };
                case 'info':
                    return { name: 'information-circle', color: '#3498db' };
                default:
                    return { name: 'checkmark-circle', color: '#D4AF37' };
            }
        };

        const getBackgroundColors = () => {
            switch (notification.type) {
                case 'success':
                    return ['rgba(22, 20, 25, 0.95)', 'rgba(22, 20, 25, 0.98)'];
                case 'error':
                    return ['rgba(22, 20, 25, 0.95)', 'rgba(22, 20, 25, 0.98)'];
                case 'warning':
                    return ['rgba(22, 20, 25, 0.95)', 'rgba(22, 20, 25, 0.98)'];
                case 'info':
                    return ['rgba(22, 20, 25, 0.95)', 'rgba(22, 20, 25, 0.98)'];
                default:
                    return ['rgba(22, 20, 25, 0.95)', 'rgba(22, 20, 25, 0.98)'];
            }
        };

        const getBorderColor = () => {
            switch (notification.type) {
                case 'success':
                    return '#D4AF37';
                case 'error':
                    return '#e74c3c';
                case 'warning':
                    return '#f39c12';
                case 'info':
                    return '#3498db';
                default:
                    return '#D4AF37';
            }
        };

        const icon = getIconName();
        const backgroundColors = getBackgroundColors();
        const borderColor = getBorderColor();

        return (
            <Animated.View
                style={[
                    styles.notificationContainer,
                    {
                        transform: [{ translateY }],
                        opacity,
                        borderLeftColor: borderColor
                    }
                ]}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name={icon.name} size={26} color={icon.color} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{notification.title}</Text>
                    <Text style={styles.message}>{notification.message}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
                    <AntDesign name="close" size={18} color="#F8F0E5" opacity={0.7} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return {
        showNotification,
        hideNotification,
        NotificationComponent
    };
};

const styles = StyleSheet.create({
    notificationContainer: {
        position: 'absolute',
        top: 0,
        left: width * 0.05,
        width: width * 0.9,
        backgroundColor: 'rgba(22, 20, 25, 0.97)',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderLeftWidth: 4,
        zIndex: 1000,
    },
    iconContainer: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#F8F0E5',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    message: {
        color: 'rgba(248, 240, 229, 0.8)',
        fontSize: 14,
        lineHeight: 18,
    },
    closeButton: {
        marginLeft: 10,
        padding: 5,
    }
});

export default useNotification;
