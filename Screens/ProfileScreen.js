import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Assuming you're using FontAwesome for icons

function ProfileScreen({ navigation }) {
    // Add navigation as a prop
    return (
        <View style={styles.container}>
            {/* Header with greeting and avatar */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Xin chào USER 🌿</Text>
                <Image
                    source={require("../assets/avatar.jpg")} // Replace with your avatar image path
                    style={styles.avatar}
                />
            </View>

            {/* Profile title or main text */}
            <Text style={styles.title}>Profile Information</Text>

            {/* List of options/buttons with icons */}
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate("Thay đổi thông tin")}
                >
                    <FontAwesome name="edit" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.optionText}>Thay đổi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                    <FontAwesome
                        name="history"
                        size={20}
                        color="#fff"
                        style={styles.icon}
                    />
                    <Text style={styles.optionText}>Lịch sử</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate("Yêu thích")}
                >
                    <FontAwesome
                        name="heart"
                        size={20}
                        color="#fff"
                        style={styles.icon}
                    />
                    <Text style={styles.optionText}>Sách yêu thích</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                    <FontAwesome name="bell" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.optionText}>Thông báo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate("Begin")} // Navigate to BeginScreen
                >
                    <FontAwesome
                        name="sign-out"
                        size={20}
                        color="#fff"
                        style={styles.icon}
                    />
                    <Text style={styles.optionText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#C4A484", // Matching the brown background from your HomeScreen
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    greeting: {
        fontSize: 16,
        color: "#fff",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#fff",
    },
    optionsContainer: {
        marginTop: 20,
    },
    optionButton: {
        flexDirection: "row", // Align icon and text horizontally
        backgroundColor: "#333", // Dark gray buttons as in the image
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 25,
        marginBottom: 20,
        alignItems: "center",
    },
    icon: {
        marginRight: 10, // Space between icon and text
    },
    optionText: {
        color: "#fff",
        fontSize: 16,
        flex: 1, // Ensures text takes available space and aligns left
        textAlign: "left", // Explicitly align text to the left
    },
});

export default ProfileScreen;