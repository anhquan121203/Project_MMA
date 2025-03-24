import { Ionicons } from "@expo/vector-icons";
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
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useNotification from "../hooks/useNotification";

const { width, height } = Dimensions.get("window");

export default function ChangeInfoScreen({ navigation }) {
  const [email, setEmail] = useState("alexander.barnes@example.com");
  const [username, setUserName] = useState("Alexander Barnes");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showNotification, NotificationComponent } = useNotification();

  const handleSave = () => {
    // Validate form
    if (!email || !username) {
      showNotification({
        title: "Thông tin bị thiếu",
        message: "Vui lòng điền đầy đủ các trường bắt buộc",
        type: "warning",
        duration: 3000
      });
      return;
    }

    if (password && password !== confirmPassword) {
      showNotification({
        title: "Mật khẩu không khớp",
        message: "Mật khẩu không khớp. Vui lòng kiểm tra và thử lại.",
        type: "error",
        duration: 3000
      });
      return;
    }

    // Show success notification
    showNotification({
      title: "Cập nhật thông tin",
      message: "Thông tin tài khoản của bạn đã được cập nhật thành công",
      type: "success",
      duration: 2000
    });

    // Navigate back after delay
    setTimeout(() => {
      navigation.goBack();
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
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Form Title */}
          <View style={styles.formTitleContainer}>
            <Text style={styles.formTitle}>Thông tin cá nhân</Text>
            <Text style={styles.formSubtitle}>Cập nhật thông tin tài khoản của bạn dưới đây</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên tài khoản</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên tài khoản của bạn"
                  placeholderTextColor="rgba(248, 240, 229, 0.4)"
                  value={username}
                  onChangeText={setUserName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(248, 240, 229, 0.4)"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu mới</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor="rgba(248, 240, 229, 0.4)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.visibilityIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#D4AF37"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>Để trống để giữ nguyên mật khẩu hiện tại</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor="rgba(248, 240, 229, 0.4)"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.visibilityIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#D4AF37"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formTitleContainer: {
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F8F0E5",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: "rgba(248, 240, 229, 0.6)",
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  inputGroup: {
    marginBottom: 20,
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
  visibilityIcon: {
    padding: 8,
  },
  helperText: {
    fontSize: 12,
    color: "rgba(248, 240, 229, 0.4)",
    marginTop: 6,
    fontStyle: "italic",
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  cancelButtonText: {
    color: "#F8F0E5",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 2,
    backgroundColor: "#D4AF37",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  saveButtonText: {
    color: "#161419",
    fontSize: 16,
    fontWeight: "bold",
  },
});
