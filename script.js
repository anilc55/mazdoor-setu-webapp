// ========== GLOBAL VARIABLES ==========
let currentLanguage = 'hi';
let otpTimer;
let otpTimeLeft = 60;
let confirmationResult = null;
let appVerifier = null;

// Translations
const translations = {
    hi: {
        back: "वापस",
        loginTitle: "लॉगिन / Login",
        loginSubtitle: "अपना मोबाइल नंबर दर्ज करें",
        continue: "जारी रखें",
        sendOTP: "OTP भेजें",
        verifyOTP: "वेरिफाई करें",
        resendOTP: "OTP पुनः भेजें",
        otpSent: "OTP भेजा गया",
        verifying: "वेरिफाई कर रहा है...",
        otpInstructions: "6 अंकों का OTP आपके मोबाइल पर भेजा गया है",
        timerPrefix: "OTP समय:",
        timerSuffix: "सेकंड"
    },
    en: {
        back: "Back",
        loginTitle: "Login / लॉगिन",
        loginSubtitle: "Enter your mobile number",
        continue: "Continue",
        sendOTP: "Send OTP",
        verifyOTP: "Verify OTP",
        resendOTP: "Resend OTP",
        otpSent: "OTP Sent",
        verifying: "Verifying...",
        otpInstructions: "6 digit OTP sent to your mobile",
        timerPrefix: "OTP Time:",
        timerSuffix: "seconds"
    }
};

// ========== DOM ELEMENTS ==========
const elements = {
    splashScreen: document.getElementById('splash-screen'),
    appContainer: document.getElementById('app-container'),
    languageScreen: document.getElementById('language-screen'),
    loginScreen: document.getElementById('login-screen'),
    roleScreen: document.getElementById('role-screen'),
    otpSection: document.getElementById('otp-section'),
    otpInputSection: document.getElementById('otp-input-section'),
    phoneNumber: document.getElementById('phone-number'),
    phoneError: document.getElementById('phone-error'),
    sendOtpBtn: document.getElementById('send-otp-btn'),
    verifyOtpBtn: document.getElementById('verify-otp-btn'),
    resendOtpBtn: document.getElementById('resend-otp-btn'),
    otpTimer: document.getElementById('otp-timer'),
    timerSpan: document.getElementById('timer'),
    loginTitle: document.getElementById('login-title'),
    loginSubtitle: document.getElementById('login-subtitle'),
    backText: document.getElementById('back-text')
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase Recaptcha
    initializeRecaptcha();
    
    // Check if user is already logged in
    checkLoginStatus();
    
    // Setup OTP input auto-focus
    setupOTPAutoFocus();
    
    // Hide splash screen after 3 seconds
    setTimeout(() => {
        elements.splashScreen.style.opacity = '0';
        setTimeout(() => {
            elements.splashScreen.classList.add('hidden');
            elements.appContainer.classList.remove('hidden');
            
            // Show language screen by default
            showScreen('language-screen');
            
            // Check URL parameters for auto-login
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('autoLogin')) {
                devLogin();
            }
        }, 500);
    }, 3000);
});

// ========== SCREEN MANAGEMENT ==========
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    
    // Update UI based on screen
    updateUIForScreen(screenId);
}

function updateUIForScreen(screenId) {
    switch(screenId) {
        case 'language-screen':
            updateTexts();
            break;
        case 'login-screen':
            updateTexts();
            // Reset OTP section
            hideOTPSection();
            break;
        case 'role-screen':
            // Role screen doesn't need text updates
            break;
    }
}

// ========== LANGUAGE MANAGEMENT ==========
function selectLanguage(lang) {
    currentLanguage = lang;
    
    // Update active language card
    document.querySelectorAll('.language-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.lang === lang) {
            card.classList.add('active');
        }
    });
    
    // Update texts
    updateTexts();
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

function updateTexts() {
    const texts = translations[currentLanguage];
    
    // Update login screen texts
    if (elements.loginTitle) {
        elements.loginTitle.textContent = texts.loginTitle;
        elements.loginSubtitle.textContent = texts.loginSubtitle;
        elements.backText.textContent = texts.back;
    }
    
    // Update OTP section texts
    const sendOtpBtn = document.querySelector('.btn-send-otp');
    if (sendOtpBtn) {
        sendOtpBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${texts.sendOTP}`;
    }
    
    const verifyOtpBtn = document.querySelector('.btn-verify-otp');
    if (verifyOtpBtn) {
        verifyOtpBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${texts.verifyOTP}`;
    }
    
    const resendOtpBtn = document.querySelector('.btn-resend-otp');
    if (resendOtpBtn) {
        resendOtpBtn.innerHTML = `<i class="fas fa-redo"></i> ${texts.resendOTP}`;
    }
    
    // Update OTP instructions
    const otpInstructions = document.querySelector('.otp-instructions p');
    if (otpInstructions) {
        otpInstructions.innerHTML = `<i class="fas fa-info-circle"></i> ${texts.otpInstructions}`;
    }
    
    // Update continue button
    const continueBtn = document.querySelector('.btn-continue');
    if (continueBtn) {
        continueBtn.innerHTML = `<i class="fas fa-arrow-right"></i> ${texts.continue}`;
    }
}

// ========== NAVIGATION FUNCTIONS ==========
function showLanguageScreen() {
    showScreen('language-screen');
}

function showLoginScreen() {
    showScreen('login-screen');
}

function showRoleSelection() {
    showScreen('role-screen');
}

// ========== OTP SECTION MANAGEMENT ==========
function showOTPSection() {
    elements.otpSection.classList.remove('hidden');
    // Scroll to OTP section
    elements.otpSection.scrollIntoView({ behavior: 'smooth' });
}

function hideOTPSection() {
    elements.otpSection.classList.add('hidden');
    elements.otpInputSection.classList.add('hidden');
    elements.phoneError.classList.remove('show');
    elements.phoneNumber.value = '';
    resetOTPTimer();
}

// ========== FIREBASE & OTP FUNCTIONS ==========
function initializeRecaptcha() {
    appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
            console.log("reCAPTCHA verified:", response);
        }
    });
}

async function sendOTP() {
    const phoneNumber = elements.phoneNumber.value.trim();
    
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
        showError(elements.phoneError, "कृपया सही मोबाइल नंबर दर्ज करें");
        return;
    }
    
    // Clear any previous errors
    clearError(elements.phoneError);
    
    // Format phone number
    const formattedPhone = '+91' + phoneNumber;
    
    try {
        // Disable send button and show loading
        disableButton(elements.sendOtpBtn, "भेज रहा है...");
        
        // Send OTP using Firebase
        confirmationResult = await firebase.auth().signInWithPhoneNumber(formattedPhone, appVerifier);
        
        // Show success message
        showNotification("OTP भेजा गया", "6 अंकों का OTP आपके मोबाइल नंबर पर भेज दिया गया है", "success");
        
        // Show OTP input section
        elements.otpInputSection.classList.remove('hidden');
        
        // Start OTP timer
        startOTPTimer();
        
        // Focus first OTP input
        document.querySelector('.otp-digit').focus();
        
        // Reset send button
        enableButton(elements.sendOtpBtn, translations[currentLanguage].sendOTP);
        
    } catch (error) {
        console.error("OTP Send Error:", error);
        
        // Handle specific errors
        let errorMessage = "OTP भेजने में त्रुटि";
        if (error.code === 'auth/too-many-requests') {
            errorMessage = "बहुत सारे अनुरोध। कृपया कुछ समय बाद प्रयास करें";
        } else if (error.code === 'auth/invalid-phone-number') {
            errorMessage = "अमान्य मोबाइल नंबर";
        } else if (error.code === 'auth/quota-exceeded') {
            errorMessage = "दैनिक कोटा समाप्त। कल पुनः प्रयास करें";
        }
        
        showError(elements.phoneError, errorMessage);
        showNotification("त्रुटि", errorMessage, "error");
        
        // Reset button
        enableButton(elements.sendOtpBtn, translations[currentLanguage].sendOTP);
        
        // Reset recaptcha
        initializeRecaptcha();
    }
}

async function verifyOTP() {
    const otpDigits = document.querySelectorAll('.otp-digit');
    let otp = '';
    
    // Collect OTP digits
    otpDigits.forEach(digit => {
        otp += digit.value;
    });
    
    // Validate OTP
    if (otp.length !== 6) {
        showNotification("त्रुटि", "कृपया 6 अंकों का OTP दर्ज करें", "error");
        
        // Highlight empty digits
        otpDigits.forEach(digit => {
            if (!digit.value) {
                digit.style.borderColor = 'var(--danger)';
                digit.style.animation = 'shake 0.5s';
            }
        });
        
        setTimeout(() => {
            otpDigits.forEach(digit => {
                digit.style.animation = '';
            });
        }, 500);
        
        return;
    }
    
    try {
        // Disable verify button and show loading
        disableButton(elements.verifyOtpBtn, "वेरिफाई कर रहा है...");
        
        // Verify OTP
        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        
        // Save user info
        saveUserInfo(user.uid, user.phoneNumber);
        
        // Show success message
        showNotification("सफल लॉगिन", "स्वागत है! आप सफलतापूर्वक लॉग इन हो गए हैं", "success");
        
        // Check if user exists in database
        setTimeout(() => {
            checkUserInDatabase(user.uid, user.phoneNumber);
        }, 1500);
        
    } catch (error) {
        console.error("OTP Verify Error:", error);
        
        let errorMessage = "OTP वेरिफिकेशन त्रुटि";
        if (error.code === 'auth/invalid-verification-code') {
            errorMessage = "गलत OTP. कृपया दोबारा प्रयास करें";
        } else if (error.code === 'auth/code-expired') {
            errorMessage = "OTP समाप्त हो गया। कृपया नया OTP भेजें";
        }
        
        showNotification("त्रुटि", errorMessage, "error");
        
        // Clear OTP inputs
        otpDigits.forEach(digit => {
            digit.value = '';
        });
        
        // Reset button
        enableButton(elements.verifyOtpBtn, translations[currentLanguage].verifyOTP);
        
        // Focus first OTP input
        document.querySelector('.otp-digit').focus();
    }
}

function resendOTP() {
    // Clear OTP inputs
    document.querySelectorAll('.otp-digit').forEach(digit => {
        digit.value = '';
    });
    
    // Hide OTP input section temporarily
    elements.otpInputSection.classList.add('hidden');
    
    // Reset timer and button
    resetOTPTimer();
    
    // Re-send OTP after a short delay
    setTimeout(() => {
        sendOTP();
    }, 500);
}

// ========== USER MANAGEMENT ==========
function saveUserInfo(uid, phoneNumber) {
    localStorage.setItem('userId', uid);
    localStorage.setItem('userPhone', phoneNumber);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
}

async function checkUserInDatabase(uid, phoneNumber) {
    try {
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(uid).get();
        
        if (userDoc.exists) {
            // User exists - get user data
            const userData = userDoc.data();
            localStorage.setItem('userRole', userData.role);
            localStorage.setItem('userName', userData.name || '');
            localStorage.setItem('userLocation', userData.location || '');
            
            // Redirect to dashboard based on role
            redirectToDashboard(userData.role);
        } else {
            // New user - show registration
            showRegistrationForm(uid, phoneNumber);
        }
    } catch (error) {
        console.error("Database Error:", error);
        // If database fails, show role selection
        showRoleSelection();
    }
}

function showRegistrationForm(uid, phoneNumber) {
    // For now, just show role selection
    // In production, you would show a full registration form
    showRoleSelection();
    
    // Save phone number for registration
    localStorage.setItem('tempPhone', phoneNumber);
    localStorage.setItem('tempUid', uid);
}

function selectRole(role) {
    const uid = localStorage.getItem('tempUid') || 'temp-' + Date.now();
    const phone = localStorage.getItem('tempPhone') || localStorage.getItem('userPhone');
    
    // Save role
    localStorage.setItem('userRole', role);
    
    // Create user data
    const userData = {
        uid: uid,
        phone: phone,
        role: role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'active',
        lastLogin: new Date().toISOString()
    };
    
    // Save to Firestore (in production)
    if (uid.startsWith('temp-')) {
        // For testing without Firebase
        localStorage.setItem('userData', JSON.stringify(userData));
        showNotification("रजिस्ट्रेशन पूर्ण", "आप सफलतापूर्वक पंजीकृत हो गए हैं", "success");
    } else {
        // Save to Firestore
        db.collection('users').doc(uid).set(userData, { merge: true })
            .then(() => {
                showNotification("रजिस्ट्रेशन पूर्ण", "आप सफलतापूर्वक पंजीकृत हो गए हैं", "success");
            })
            .catch(error => {
                console.error("Registration Error:", error);
                showNotification("चेतावनी", "रजिस्ट्रेशन सहेजने में त्रुटि, लेकिन लॉगिन सफल", "warning");
            });
    }
    
    // Redirect to dashboard
    setTimeout(() => {
        redirectToDashboard(role);
    }, 1000);
}

function redirectToDashboard(role) {
    switch(role) {
        case 'mazdoor':
            window.location.href = 'dashboard/mazdoor.html';
            break;
        case 'contractor':
            window.location.href = 'dashboard/contractor.html';
            break;
        case 'owner':
            window.location.href = 'dashboard/owner.html';
            break;
        default:
            window.location.href = 'pages/home.html';
    }
}

// ========== GUEST & DEV LOGIN ==========
function guestLogin() {
    // Set guest mode
    localStorage.setItem('userMode', 'guest');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'guest');
    
    showNotification("अतिथि मोड", "आप अतिथि के रूप में प्रवेश कर रहे हैं", "success");
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'pages/home.html';
    }, 1000);
}

function devLogin() {
    // Development mode login (bypass OTP)
    const testUid = 'dev-' + Date.now();
    const testPhone = '+919702559135';
    
    saveUserInfo(testUid, testPhone);
    
    // Create test user data
    const userData = {
        uid: testUid,
        phone: testPhone,
        name: 'Test User',
        role: 'mazdoor',
        location: 'Mumbai',
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userRole', 'mazdoor');
    localStorage.setItem('userName', 'Test User');
    
    showNotification("डेवलपमेंट लॉगिन", "OTP बाईपास किया गया, टेस्ट मोड में", "success");
    
    // Show role selection
    setTimeout(() => {
        showRoleSelection();
    }, 1000);
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (isLoggedIn === 'true' && userRole) {
        // User is already logged in, redirect to appropriate page
        setTimeout(() => {
            if (userRole === 'guest') {
                window.location.href = 'pages/home.html';
            } else {
                redirectToDashboard(userRole);
            }
        }, 1000);
    }
}

// ========== OTP TIMER FUNCTIONS ==========
function startOTPTimer() {
    clearInterval(otpTimer);
    otpTimeLeft = 60;
    updateTimerDisplay();
    
    // Disable resend button
    elements.resendOtpBtn.disabled = true;
    
    // Start timer
    otpTimer = setInterval(() => {
        otpTimeLeft--;
        updateTimerDisplay();
        
        if (otpTimeLeft <= 0) {
            clearInterval(otpTimer);
            enableResendButton();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const texts = translations[currentLanguage];
    elements.timerSpan.textContent = otpTimeLeft;
    elements.otpTimer.innerHTML = `<i class="fas fa-clock"></i> ${texts.timerPrefix} <span id="timer">${otpTimeLeft}</span> ${texts.timerSuffix}`;
}

function resetOTPTimer() {
    clearInterval(otpTimer);
    otpTimeLeft = 60;
    updateTimerDisplay();
    enableResendButton();
}

function enableResendButton() {
    elements.resendOtpBtn.disabled = false;
    elements.resendOtpBtn.innerHTML = `<i class="fas fa-redo"></i> ${translations[currentLanguage].resendOTP}`;
}

// ========== UTILITY FUNCTIONS ==========
function validatePhoneNumber(phone) {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
}

function setupOTPAutoFocus() {
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('otp-digit')) {
            const index = parseInt(e.target.dataset.index);
            const nextIndex = index + 1;
            const prevIndex = index - 1;
            
            // Move to next input if current is filled
            if (e.target.value.length === 1 && nextIndex < 6) {
                document.querySelector(`.otp-digit[data-index="${nextIndex}"]`).focus();
            }
            
            // Mark as filled
            if (e.target.value.length === 1) {
                e.target.classList.add('filled');
            } else {
                e.target.classList.remove('filled');
            }
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('otp-digit')) {
            const index = parseInt(e.target.dataset.index);
            const prevIndex = index - 1;
            
            // Move to previous input on backspace if empty
            if (e.key === 'Backspace' && e.target.value.length === 0 && prevIndex >= 0) {
                document.querySelector(`.otp-digit[data-index="${prevIndex}"]`).focus();
            }
        }
    });
}

function disableButton(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

function enableButton(button, text) {
    button.disabled = false;
    button.innerHTML = text;
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        clearError(element);
    }, 5000);
}

function clearError(element) {
    element.textContent = '';
    element.classList.remove('show');
}

function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="icon">
            <i 
