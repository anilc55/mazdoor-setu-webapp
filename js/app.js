// App JavaScript for Mazdoor Setu

// Language handling
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'hi';
    applyLanguage(savedLang);
});

function applyLanguage(lang) {
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    // You can add more dynamic language switching here
}

// Location selector
function openLocationSelector() {
    const locations = ['दिल्ली', 'नोएडा', 'गुड़गांव', 'फरीदाबाद', 'गाजियाबाद'];
    const currentLocation = document.querySelector('.location-btn').innerText.split(' ')[1];
    
    // Simple prompt for demo - in real app, use a modal
    const newLocation = prompt('अपना शहर चुनें / Select your city:\n' + locations.join(', '), currentLocation);
    if (newLocation && locations.includes(newLocation)) {
        document.querySelector('.location-btn').innerHTML = `📍 ${newLocation} <span class="chevron">▼</span>`;
    }
}

// Call function
function makeCall(phoneNumber = '+911234567890') {
    window.location.href = `tel:${phoneNumber}`;
}

// WhatsApp function
function openWhatsApp(phoneNumber = '911234567890', message = 'Hi, I need worker from Mazdoor Setu') {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// Open GPS/Map
function openMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
            },
            (error) => {
                alert('लोकेशन एक्सेस नहीं हो पाई। कृपया अनुमति दें।\nCould not access location. Please allow permission.');
                // Fallback to default location (Delhi)
                window.open('https://www.google.com/maps?q=28.6139,77.2090', '_blank');
            }
        );
    } else {
        alert('आपका ब्राउज़र जियोलोकेशन सपोर्ट नहीं करता।');
    }
}

// Voice Search (for Phase 2)
function startVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'hi-IN';
        recognition.start();
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            alert('आपने कहा: ' + transcript);
            // Here you would redirect to search results
        };
        
        recognition.onerror = () => {
            alert('फिर से कोशिश करें / Try again');
        };
    } else {
        alert('आपका ब्राउज़र वॉयस सर्च सपोर्ट नहीं करता।');
    }
}

// SOS Emergency
function triggerSOS() {
    if (confirm('🆘 आपातकालीन अलर्ट भेजें? आपके रजिस्टर्ड कॉन्टैक्ट्स को सूचना भेजी जाएगी।')) {
        // In real app, this would send location to emergency contacts
        alert('सुरक्षा टीम को सूचित कर दिया गया है। जल्द ही आपसे संपर्क किया जाएगा।');
        
        // Also call emergency number
        window.location.href = 'tel:112';
    }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker error:', err));
    });
}
