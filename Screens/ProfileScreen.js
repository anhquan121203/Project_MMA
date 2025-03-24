import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "react-native-vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useNotification from "../hooks/useNotification";

const { width, height } = Dimensions.get("window");

function ProfileScreen({ navigation }) {
    const { showNotification, NotificationComponent } = useNotification();
    const [userName, setUserName] = useState("Nguyen Van Quan");

    const handleLogout = () => {
        showNotification({
            title: "Đăng xuất",
            message: "Bạn có chắc chắn muốn đăng xuất?",
            type: "warning",
            duration: 3000
        });

        setTimeout(() => {
            navigation.navigate("Begin");
            showNotification({
                title: "Đăng xuất thành công",
                message: "Bạn đã đăng xuất thành công",
                type: "success",
                duration: 2000
            });
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NotificationComponent />

            <LinearGradient
                colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.1)', 'rgba(22, 20, 25, 0)']}
                style={styles.topDecoration}
            />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#F8F0E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hồ sơ</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color="#F8F0E5" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileCard}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={require("../assets/avatar.jpg")}
                        style={styles.profileImage}
                    />
                    <View style={styles.editIconContainer}>
                        <Ionicons name="camera" size={18} color="#161419" />
                    </View>
                </View>

                <View style={styles.profileInfo}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>quangnguyen@gmail.com</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>24</Text>
                            <Text style={styles.statLabel}>Sách</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>16</Text>
                            <Text style={styles.statLabel}>Yêu thích</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>8</Text>
                            <Text style={styles.statLabel}>Đơn hàng</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.menuTitle}>Cài đặt tài khoản</Text>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("Thay đổi thông tin")}
                >
                    <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(90, 159, 240, 0.15)' }]}>
                        <Ionicons name="person-outline" size={22} color="#5A9FF0" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuItemText}>Chỉnh sửa hồ sơ</Text>
                        <Text style={styles.menuItemDescription}>Thay đổi thông tin tài khoản</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="rgba(248, 240, 229, 0.5)" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("Yêu thích")}
                >
                    <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(212, 175, 55, 0.15)' }]}>
                        <Ionicons name="heart-outline" size={22} color="#D4AF37" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuItemText}>Yêu thích</Text>
                        <Text style={styles.menuItemDescription}>Sách yêu thích của bạn</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="rgba(248, 240, 229, 0.5)" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(149, 97, 226, 0.15)' }]}>
                        <Ionicons name="time-outline" size={22} color="#9561E2" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuItemText}>Lịch sử đơn hàng</Text>
                        <Text style={styles.menuItemDescription}>Xem lịch sử đơn hàng của bạn</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="rgba(248, 240, 229, 0.5)" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(72, 187, 120, 0.15)' }]}>
                        <Ionicons name="card-outline" size={22} color="#48BB78" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuItemText}>Phương thức thanh toán</Text>
                        <Text style={styles.menuItemDescription}>Quản lý phương thức thanh toán của bạn</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="rgba(248, 240, 229, 0.5)" />
                </TouchableOpacity>

                <Text style={styles.menuTitle}>Thông báo</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(237, 100, 166, 0.15)' }]}>
                        <Ionicons name="notifications-outline" size={22} color="#ED64A6" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuItemText}>Thông báo</Text>
                        <Text style={styles.menuItemDescription}>Quản lý thông báo</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="rgba(248, 240, 229, 0.5)" />
                </TouchableOpacity>

                <Text style={styles.menuTitle}>Khác</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(237, 137, 54, 0.15)' }]}>
                        <Ionicons name="help-buoy-outline" size={22} color="#ED8936" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuItemText}>Trợ giúp & Hỗ trợ</Text>
                        <Text style={styles.menuItemDescription}>Nhận trợ giúp và hỗ trợ khách hàng</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="rgba(248, 240, 229, 0.5)" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleLogout}
                >
                    <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(229, 62, 62, 0.15)' }]}>
                        <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuItemText}>Đăng xuất</Text>
                        <Text style={styles.menuItemDescription}>Đăng xuất khỏi tài khoản của bạn</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="rgba(248, 240, 229, 0.5)" />
                </TouchableOpacity>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161419",
    },
    topDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
        zIndex: 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        zIndex: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(248, 240, 229, 0.1)",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#F8F0E5",
        letterSpacing: 1,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(248, 240, 229, 0.1)",
    },
    profileCard: {
        margin: 20,
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.2)",
        alignItems: "center",
        zIndex: 1,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: "#D4AF37",
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: "#D4AF37",
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "#161419",
    },
    profileInfo: {
        alignItems: 'center',
        width: '100%',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#F8F0E5",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: "rgba(248, 240, 229, 0.6)",
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        backgroundColor: "rgba(22, 20, 25, 0.5)",
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.1)",
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: "rgba(248, 240, 229, 0.1)",
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#D4AF37",
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: "rgba(248, 240, 229, 0.6)",
    },
    menuContainer: {
        paddingHorizontal: 20,
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: "#D4AF37",
        marginTop: 25,
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: 15,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.05)",
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: "#F8F0E5",
        marginBottom: 4,
    },
    menuItemDescription: {
        fontSize: 13,
        color: "rgba(248, 240, 229, 0.5)",
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 30,
    },
    versionText: {
        fontSize: 12,
        color: "rgba(248, 240, 229, 0.4)",
    }
});

export default ProfileScreen;