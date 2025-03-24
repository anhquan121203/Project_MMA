import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function BeginScreen() {

    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/Login-Wallpaper.jpg")} // Replace with your image path
                    style={styles.image}
                    resizeMode="cover" // Ensure the image covers the entire container
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Choose your BookShelf</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Đăng nhập")}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Đăng ký")}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#222",
    },
    imageContainer: {
        flex: 4,
        overflow: "hidden",
        width: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    contentContainer: {
        flex: 2,
        backgroundColor: "#C4A484",
        alignItems: "center",
        paddingVertical: 20,
        width: "100%",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#fff",
        width: "80%",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
});