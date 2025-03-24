import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useNotification from "../hooks/useNotification";

const { width, height } = Dimensions.get("window");

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();
  const { showNotification, NotificationComponent } = useNotification();

  const handleSubmit = () => {
    if (!email.trim()) {
      showNotification({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ email của bạn",
        type: "warning",
        duration: 3000
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification({
        title: "Email không hợp lệ",
        message: "Vui lòng nhập địa chỉ email hợp lệ",
        type: "error",
        duration: 3000
      });
      return;
    }

    // Simulate API call
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showNotification({
        title: "Yêu cầu đã được gửi",
        message: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu",
        type: "success",
        duration: 3000
      });
      setTimeout(() => {
        navigation.navigate("Đăng nhập");
      }, 2000);
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
          onPress={() => navigation.navigate("Đăng nhập")}
        >
          <Ionicons name="arrow-back" size={24} color="#F8F0E5" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-open-outline" size={50} color="#D4AF37" />
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Khôi phục mật khẩu</Text>
              <Text style={styles.subtitle}>
                Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập địa chỉ email của bạn"
                  placeholderTextColor="rgba(248, 240, 229, 0.4)"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  editable={!isProcessing}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isProcessing && styles.processingButton]}
                onPress={handleSubmit}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isProcessing ? ['#A89449', '#8A7A3D'] : ['#D4AF37', '#C09B31']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  {isProcessing ? (
                    <Text style={styles.submitButtonText}>Đang xử lý...</Text>
                  ) : (
                    <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Bạn đã nhớ mật khẩu?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Đăng nhập")}>
                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomDecoration}>
        <Text style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={14} color="rgba(212, 175, 55, 0.7)" />
          Thông tin của bạn được bảo mật
        </Text>
      </View>
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
    paddingTop: 50,
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8F0E5",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(248, 240, 229, 0.7)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: "#D4AF37",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 30,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#F8F0E5",
    fontSize: 15,
    paddingVertical: 12,
  },
  submitButton: {
    width: "100%",
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  processingButton: {
    opacity: 0.8,
  },
  gradientButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#161419",
    fontSize: 16,
    fontWeight: "bold",
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  helpText: {
    fontSize: 14,
    color: "rgba(248, 240, 229, 0.6)",
  },
  loginLink: {
    fontSize: 14,
    color: "#D4AF37",
    fontWeight: "bold",
    marginLeft: 5,
  },
  bottomDecoration: {
    paddingBottom: 30,
    alignItems: "center",
  },
  securityNote: {
    fontSize: 12,
    color: "rgba(248, 240, 229, 0.5)",
    textAlign: "center",
  },
});
