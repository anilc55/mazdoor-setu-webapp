// Language Management
let currentLanguage = 'hi';
const translations = {
    hi: {
        loginTitle: 'लॉगिन / Login',
        loginSubtitle: 'अपना मोबाइल नंबर दर्ज करें',
        continueBtn: 'जारी रखें / Continue'
    },
    en: {
        loginTitle: 'Login / लॉगिन',
        loginSubtitle: 'Enter your mobile number',
        continueBtn: 'Continue / जारी रखें'
    }
};

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const appContainer = document.getElementById('app-container');
const languageSelector = document.getElementById('language-selector');
const loginScreen = document.getElementById('login-screen');
const loginTitle = document.getElementById('login-title');
const loginSubtitle = document.getElementById('login-subtitle');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            showLanguageSelector();
        }, 500);
    }, 2000);
});

// Language Functions
function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.onclick.toString().includes(`'${lang}'`)) {
            btn.classList.add('active');
        }
    });
    updateTexts();
}

function updateTexts() {
    const texts = translations[currentLanguage];
    loginTitle.textContent = texts.loginTitle;
    loginSubtitle.textContent = texts.loginSubtitle;
    document.querySelector('.continue-btn').textContent = texts.continueBtn;
}

// Screen Navigation
function showLanguageSelector() {
    languageSelector.classList.remove('hidden');
    loginScreen.classList.add('hidden');
}

function showLogin() {
    languageSelector.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    updateTexts();
}

function showOTPForm() {
    const otpForm = document.getElementById('otp-form');
    otpForm.classList.remove('hidden');
}

function showRegister() {
    // Redirect to registration page
    window.location.href = 'pages/register.html';
}

function guestAccess() {
    // Set guest mode and redirect to home
    localStorage.setItem('userMode', 'guest');
    window.location.href = 'pages/home.html';
}

// OTP Functions
function sendOTP() {
    const mobileNumber = document.getElementById('mobile-number').value;
    
    if (!validateMobile(mobileNumber)) {
        alert('कृपया सही मोबाइल नंबर दर्ज करें');
        return;
    }
    
    // Simulate OTP sending
    const otpInputs = document.getElementById('otp-inputs');
    otpInputs.classList.remove('hidden');
    
    // In production, integrate with Firebase/OTP service
    console.log(`OTP sent to ${mobileNumber}`);
}

function verifyOTP() {
    // Simulate OTP verification
    const inputs = document.querySelectorAll('.otp-inputs input');
    let otp = '';
    inputs.forEach(input => otp += input.value);
    
    if (otp.length === 6) {
        // Success - Redirect to role selection
        showRoleSelection();
    } else {
        alert('कृपया सही OTP दर्ज करें');
    }
}

function showRoleSelection() {
    const roleHTML = `
        <div class="role-selection">
            <h3>अपनी भूमिका चुनें</h3>
            <div class="role-options">
                <div class="role-card" onclick="selectRole('mazdoor')">
                    <i class="fas fa-hard-hat"></i>
                    <h4>मजदूर</h4>
                </div>
                <div class="role-card" onclick="selectRole('contractor')">
                    <i class="fas fa-user-tie"></i>
                    <h4>ठेकेदार</h4>
                </div>
                <div class="role-card" onclick="selectRole('owner')">
                    <i class="fas fa-home"></i>
                    <h4>मालिक</h4>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.login-container').innerHTML = roleHTML;
}

function selectRole(role) {
    localStorage.setItem('userRole', role);
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to respective dashboard
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
    }
}

// Utility Functions
function validateMobile(mobile) {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
}

// PWA Features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
