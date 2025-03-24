import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

export default function BeginScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/first_wallpaper.jpeg")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(22, 20, 25, 0.3)', 'rgba(22, 20, 25, 0.7)', 'rgba(22, 20, 25, 0.95)']}
                    style={styles.overlay}
                />
                <View style={styles.logoContainer}>
                    <View style={styles.logoInner}>
                        <Text style={styles.logoText}>BS</Text>
                    </View>
                    <Text style={styles.tagline}>YOUR PERSONAL LIBRARY</Text>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Chọn sách của bạn</Text>
                <Text style={styles.subtitle}>
                    Đi vào thế giới tri thức và tưởng tượng. Thư viện cá nhân của bạn đang chờ đợi.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Đăng nhập")}
                >
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.signUpButton]}
                    onPress={() => navigation.navigate("Đăng ký")}
                >
                    <Text style={[styles.buttonText, styles.signUpText]}>Đăng ký</Text>
                </TouchableOpacity>
                <View style={styles.privacyContainer}>
                    <Text style={styles.privacyText}>
                        Bằng cách tiếp tục, bạn đồng ý với{' '}
                        <Text style={styles.privacyLink}>Điều khoản dịch vụ</Text> và{' '}
                        <Text style={styles.privacyLink}>Chính sách bảo mật</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161419",
    },
    imageContainer: {
        flex: 5,
        overflow: "hidden",
        width: "100%",
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    logoContainer: {
        position: "absolute",
        top: height * 0.15,
        width: "100%",
        alignItems: "center",
    },
    logoInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(212, 175, 55, 0.9)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    logoText: {
        color: "#161419",
        fontSize: 36,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    tagline: {
        color: "#F8F0E5",
        fontSize: 12,
        fontWeight: "500",
        letterSpacing: 3,
        opacity: 0.9,
    },
    contentContainer: {
        flex: 4,
        backgroundColor: "#161419",
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 30,
        width: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    title: {
        color: "#F8F0E5",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
        letterSpacing: 1,
        textAlign: "center",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        color: "rgba(248, 240, 229, 0.7)",
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        marginBottom: 36,
        width: "90%",
    },
    button: {
        backgroundColor: "#D4AF37",
        width: "100%",
        padding: 18,
        borderRadius: 30,
        alignItems: "center",
        marginVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buttonText: {
        color: "#161419",
        fontSize: 17,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    signUpButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D4AF37",
    },
    signUpText: {
        color: "#D4AF37",
    },
    privacyContainer: {
        marginTop: 30,
        width: "90%",
    },
    privacyText: {
        color: "rgba(248, 240, 229, 0.5)",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 18,
    },
    privacyLink: {
        color: "#D4AF37",
        textDecorationLine: "underline",
    },
});