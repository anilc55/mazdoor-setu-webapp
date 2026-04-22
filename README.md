# 🏗️ मजदूर सेतु - Mazdoor Setu App

**काम की तलाश नहीं, समाधान का रास्ता**

---

## 📱 App Overview

Mazdoor Setu एक Flutter-based Marketplace App है जो India के मजदूरों, ठेकेदारों, कंपनियों और रूम ओनर्स को एक platform पर जोड़ती है।

---

## 🚀 Setup Instructions

### Step 1: Prerequisites Install करें
```bash
# Flutter SDK (3.0+)
https://flutter.dev/docs/get-started/install

# Android Studio
https://developer.android.com/studio

# Java JDK 11+
```

### Step 2: Project Setup
```bash
git clone <your-repo>
cd mazdoor_setu
flutter pub get
```

### Step 3: Firebase Setup
1. [Firebase Console](https://console.firebase.google.com) पर जाएं
2. New Project बनाएं: "mazdoor-setu"
3. Android App add करें: `com.mazdoorsetu.app`
4. `google-services.json` download करें → `android/app/` में रखें
5. `main.dart` में Firebase.initializeApp() uncomment करें

### Step 4: Razorpay Setup
1. [Razorpay Dashboard](https://dashboard.razorpay.com) पर account बनाएं
2. API Key लें
3. `payment_screen.dart` में Razorpay.open() configure करें

### Step 5: App Logo
```
assets/images/logo.png  ← मजदूर सेतु का logo यहाँ रखें
```

### Step 6: Build & Run
```bash
# Debug mode
flutter run

# Release APK (Play Store के लिए)
flutter build apk --release

# App Bundle (Recommended for Play Store)
flutter build appbundle --release
```

---

## 📂 Project Structure

```
lib/
├── main.dart                    # Entry point
├── theme/
│   └── app_theme.dart           # Colors, Typography
├── models/
│   ├── user_model.dart          # User, Roles, Skills
│   └── room_model.dart          # Room, Lead, Chat models
├── providers/
│   └── auth_provider.dart       # Auth state management
├── screens/
│   ├── splash_screen.dart       # Splash Screen
│   ├── privacy_policy_screen.dart
│   ├── login_screen.dart        # Phone login
│   ├── otp_screen.dart          # OTP verification
│   ├── role_selection_screen.dart
│   ├── kyc_screen.dart          # KYC upload
│   ├── home_screen.dart         # Main dashboard
│   ├── worker_listing_screen.dart
│   ├── room_listing_screen.dart
│   ├── add_room_screen.dart
│   ├── chat_list_screen.dart
│   ├── chat_screen.dart
│   ├── profile_screen.dart
│   ├── payment_screen.dart      # Razorpay plans
│   ├── lead_screen.dart
│   ├── worker_detail_screen.dart
│   └── room_detail_screen.dart
└── widgets/
    └── common_widgets.dart       # Reusable components
```

---

## 👥 User Roles

| Role | Hindi | Features |
|------|-------|----------|
| Worker | मजदूर | Profile, Skills, Available toggle |
| Thekedar | ठेकेदार | Worker search, Chat, Call |
| Company | कंपनी | Bulk worker hiring, Leads |
| Room Owner | रूम ओनर | Room listing, Photo/Video upload |

---

## 💰 Monetization

| Feature | Price |
|---------|-------|
| Free Calls | 2 per user |
| Free Chats | 3 per user |
| Call Pack | ₹49 - ₹399 |
| Lead | ₹2 per lead |
| Room Listing | FREE 10 days, then ₹10/10d or ₹20/30d |

---

## 🔐 Security Features

- OTP Mobile Authentication (Firebase)
- KYC Verification (Aadhaar/PAN/Voter ID)
- Face Selfie Verification
- Without KYC: Call/Chat blocked
- Admin can verify/reject KYC
- Legal: Crime data shared with authorities

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Flutter (Dart) |
| Auth | Firebase Auth (Phone OTP) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Payment | Razorpay |
| Location | Geolocator |
| State | Provider |

---

## 📤 Play Store Upload Steps

1. **flutter build appbundle --release** चलाएं
2. `build/app/outputs/bundle/release/app-release.aab` मिलेगा
3. [Play Console](https://play.google.com/console) खोलें
4. New App → **मजदूर सेतु** → Dart/Flutter
5. App Bundle upload करें
6. Store listing: Screenshots, Description, Privacy Policy URL
7. Content Rating form भरें
8. Pricing: Free
9. Review के लिए Submit करें

---

## 📞 Support

- Email: support@mazdoorsetu.in
- Admin Panel: admin.mazdoorsetu.in

---

*Made with ❤️ for भारत के मजदूर*
