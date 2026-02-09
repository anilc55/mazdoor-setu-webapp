// Firebase Configuration Template
// Replace with your actual Firebase config

const firebaseConfig = {
    apiKey: "AIzaSyYOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Phone Authentication
function setupRecaptcha() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            onSignInSubmit();
        }
    });
}

async function sendOTP(phoneNumber) {
    const appVerifier = window.recaptchaVerifier;
    
    try {
        const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        return { success: true, message: "OTP sent successfully" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function verifyOTP(otp) {
    try {
        const result = await window.confirmationResult.confirm(otp);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // New user - redirect to role selection
            window.location.href = 'pages/role-selection.html?uid=' + user.uid;
        } else {
            // Existing user - redirect to dashboard
            const userData = userDoc.data();
            localStorage.setItem('userRole', userData.role);
            localStorage.setItem('userId', user.uid);
            redirectToDashboard(userData.role);
        }
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
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

// Firestore Functions
async function saveUserData(uid, userData) {
    try {
        await db.collection('users').doc(uid).set(userData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function postJob(jobData) {
    try {
        jobData.timestamp = firebase.firestore.FieldValue.serverTimestamp();
        jobData.status = 'active';
        
        const docRef = await db.collection('jobs').add(jobData);
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function searchMazdoor(filters) {
    try {
        let query = db.collection('users').where('role', '==', 'mazdoor');
        
        if (filters.skill) {
            query = query.where('skills', 'array-contains', filters.skill);
        }
        
        if (filters.area) {
            query = query.where('area', '==', filters.area);
        }
        
        if (filters.maxRate) {
            query = query.where('dailyRate', '<=', parseInt(filters.maxRate));
        }
        
        const snapshot = await query.get();
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return { success: true, data: results };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Storage Functions
async function uploadImage(file, path) {
    try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(path + '/' + Date.now() + '_' + file.name);
        
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return { success: true, url: downloadURL };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Export Firebase services
export { 
    auth, 
    db, 
    storage, 
    sendOTP, 
    verifyOTP, 
    saveUserData, 
    postJob, 
    searchMazdoor, 
    uploadImage 
};
