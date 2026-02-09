// ========== FIREBASE CONFIGURATION ==========
// Replace these values with your actual Firebase config

// Production Config (Replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyC7hFRLw6qJtWkHr9zMq8Q7K8LpZxYvBnA",
    authDomain: "mazdoor-setu-production.firebaseapp.com",
    projectId: "mazdoor-setu-production",
    storageBucket: "mazdoor-setu-production.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef",
    measurementId: "G-ABCDEF1234"
};

// Development Config (For testing)
const devFirebaseConfig = {
    apiKey: "AIzaSyBh3f3qyJcZgXH8Qq5L6QNpR9tQb9vT6sA",
    authDomain: "mazdoor-setu-dev.firebaseapp.com",
    projectId: "mazdoor-setu-dev",
    storageBucket: "mazdoor-setu-dev.appspot.com",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:1234567890abcdef123456",
    measurementId: "G-DEV1234567"
};

// ========== FIREBASE INITIALIZATION ==========
let firebaseApp;
let auth;
let db;
let analytics;

try {
    // Initialize Firebase
    firebaseApp = firebase.initializeApp(firebaseConfig);
    
    // Get Firebase services
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Enable offline persistence
    db.enablePersistence()
        .catch((err) => {
            console.error("Firebase persistence error:", err);
        });
    
    // Settings for Firestore
    db.settings({
        timestampsInSnapshots: true,
        merge: true
    });
    
    console.log("Firebase initialized successfully");
    
} catch (error) {
    console.error("Firebase initialization error:", error);
    
    // Try development config if production fails
    try {
        firebaseApp = firebase.initializeApp(devFirebaseConfig, 'Secondary');
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase development config loaded");
    } catch (devError) {
        console.error("Both Firebase configs failed:", devError);
        
        // Create mock Firebase functions for offline development
        createMockFirebase();
    }
}

// ========== FIREBASE AUTH FUNCTIONS ==========
// Phone Authentication Wrapper
async function sendOTPToPhone(phoneNumber, appVerifier) {
    try {
        return await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
    } catch (error) {
        console.error("Firebase OTP Error:", error);
        throw error;
    }
}

// Verify OTP Wrapper
async function verifyOTPCode(confirmationResult, otp) {
    try {
        return await confirmationResult.confirm(otp);
    } catch (error) {
        console.error("Firebase OTP Verification Error:", error);
        throw error;
    }
}

// Get Current User
function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        });
    });
}

// Sign Out
async function signOutUser() {
    try {
        await auth.signOut();
        localStorage.clear();
        return { success: true };
    } catch (error) Firestore Operations
async function saveUserData(userId, userData) {
    try {
        await db.collection('users').doc(userId).set(userData, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Save User Error:", error);
        return { success: false, error: error.message };
    }
}

// Get User Data
async function getUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        } else {
            return { success: false, error: "User not found" };
        }
    } catch (error) {
        console.error("Get User Error:", error);
        return { success: false, error: error.message };
    }
}

// Create Job Posting
async function createJobPosting(jobData) {
    try {
        const docRef = await db.collection('jobs').add({
            ...jobData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'active',
            views: 0,
            applications: 0
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Create Job Error:", error);
        return { success: false, error: error.message };
    }
}

// Search Workers
async function searchWorkers(filters = {}) {
    try {
        let query = db.collection('users').where('role', '==', 'mazdoor');
        
        // Apply filters
        if (filters.skill) {
            query = query.where('skills', 'array-contains', filters.skill);
        }
        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }
        if (filters.minRate) {
            query = query.where('dailyRate', '>=', parseInt(filters.minRate));
        }
        if (filters.maxRate) {
            query = query.where('dailyRate', '<=', parseInt(filters.maxRate));
        }
        
        const snapshot = await query.limit(50).get();
        const workers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return { success: true, data: workers };
    } catch (error) {
        console.error("Search Workers Error:", error);
        return { success: false, error: error.message };
    }
}

// Create Room Listing
async function createRoomListing(roomData) {
    try {
        const docRef = await db.collection('rooms').add({
            ...roomData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'available',
            views: 0,
            inquiries: 0
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Create Room Error:", error);
        return { success: false, error: error.message };
    }
}

// Search Rooms
async function searchRooms(filters = {}) {
    try {
        let query = db.collection('rooms').where('status', '==', 'available');
        
        // Apply filters
        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }
        if (filters.minRent) {
            query = query.where('rent', '>=', parseInt(filters.minRent));
        }
        if (filters.maxRent) {
            query = query.where('rent', '<=', parseInt(filters.maxRent));
        }
        if (filters.type) {
            query = query.where('type', '==', filters.type);
        }
        
        const snapshot = await query.limit(50).get();
        const rooms = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return { success: false, error: error.message };
    }
}

// ========== DATABASE FUNCTIONS ==========
// Save User Profile Image
async function uploadProfileImage(userId, file) {
    try {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`profiles/${userId}/${Date.now()}_${file.name}`);
        
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return { success: true, url: downloadURL };
    } catch (error) {
        console.error("Upload Image Error:", error);
        return { success: false, error: error.message };
    }
}

// Delete User Account
async function deleteUserAccount(userId) {
    try {
        // Delete from Firestore
        await db.collection('users').doc(userId).delete();
        
        // Delete from Auth
        const user = auth.currentUser;
        if (user) {
            await user.delete();
        }
        
        return { success: true };
    } catch (error) {
        console.error("Delete Account Error:", error);
        return { success: false, error: error.message };
    }
}

// Get Statistics
async function getPlatformStats() {
    try {
        const [usersCount, jobsCount, roomsCount] = await Promise.all([
            db.collection('users').count().get(),
            db.collection('jobs').count().get(),
            db.collection('rooms').count().get()
        ]);
        
        return {
            success: true,
            stats: {
                totalUsers: usersCount.data().count,
                totalJobs: jobsCount.data().count,
                totalRooms: roomsCount.data().count
            }
        };
    } catch (error) {
        console.error("Get Stats Error:", error);
        return { success: false, error: error.message };
    }
}

// ========== MOCK FIREBASE (For Development) ==========
function createMockFirebase() {
    console.log("Creating mock Firebase for offline development");
    
    // Mock auth object
    window.mockAuth = {
        currentUser: null,
        
        signInWithPhoneNumber: function(phoneNumber, appVerifier) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.currentUser = {
                        uid: 'mock-' + Date.now(),
                        phoneNumber: phoneNumber
                    };
                    
                    resolve({
                        confirm: function(otp) {
                            return new Promise((resolveConfirm) => {
                                setTimeout(() => {
                                    resolveConfirm({
                                        user: window.mockAuth.currentUser
                                    });
                                }, 1000);
                            });
                        }
                    });
                }, 1500);
            });
        },
        
        signOut: function() {
            return new Promise((resolve) => {
                this.currentUser = null;
                resolve();
            });
        },
        
        onAuthStateChanged: function(callback) {
            callback(this.currentUser);
            return () => {}; // Unsubscribe function
        }
    };
    
    // Mock firestore object
    window.mockDb = {
        collection: function(name) {
            return {
                doc: function(id) {
                    return {
                        get: function() {
                            return new Promise((resolve) => {
                                const data = localStorage.getItem(`mock_${name}_${id}`) || '{}';
                                resolve({
                                    exists: data !== '{}',
                                    data: function() {
                                        return JSON.parse(data);
                                    }
                                });
                            });
                        },
                        set: function(data) {
                            return new Promise((resolve) => {
                                localStorage.setItem(`mock_${name}_${id}`, JSON.stringify(data));
                                resolve();
                            });
                        }
                    };
                },
                add: function(data) {
                    return new Promise((resolve) => {
                        const id = 'mock-' + Date.now();
                        localStorage.setItem(`mock_${name}_${id}`, JSON.stringify(data));
                        resolve({ id: id });
                    });
                },
                where: function() { return this; },
                limit: function() { return this; },
                get: function() {
                    return new Promise((resolve) => {
                        const items = [];
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key.startsWith(`mock_${name}_`)) {
                                const id = key.replace(`mock_${name}_`, '');
                                items.push({
                                    id: id,
                                    data: function() {
                                        return JSON.parse(localStorage.getItem(key));
                                    }
                                });
                            }
                        }
                        resolve({
                            docs: items
                        });
                    });
                }
            };
        }
    };
    
    // Override Firebase objects with mocks
    if (!firebaseApp) {
        auth = window.mockAuth;
        db = window.mockDb;
        console.log("Mock Firebase loaded successfully");
    }
}

// ========== EXPORT FIREBASE SERVICES ==========
// Export Firebase services for use in other files
window.firebaseServices = {
    auth: auth,
    db: db,
    sendOTPToPhone: sendOTPToPhone,
    verifyOTPCode: verifyOTPCode,
    getCurrentUser: getCurrentUser,
    signOutUser: signOutUser,
    saveUserData: saveUserData,
    getUserData: getUserData,
    createJobPosting: createJobPosting,
    searchWorkers: searchWorkers,
    createRoomListing: createRoomListing,
    searchRooms: searchRooms,
    uploadProfileImage: uploadProfileImage,
    deleteUserAccount: deleteUserAccount,
    getPlatformStats: getPlatformStats
};

// Make services globally available
window.auth = auth;
window.db = db;
