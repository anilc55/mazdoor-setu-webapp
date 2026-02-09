## **7. `pages/home.html` - Home Screen with Flower Design**
```html
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Mazdoor Setu</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="home.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="home-container">
        <!-- Header -->
        <header class="app-header">
            <button class="menu-btn" onclick="toggleMenu()">
                <i class="fas fa-bars"></i>
            </button>
            <h1 class="app-title">मजदूर सेतु</h1>
            <button class="profile-btn" onclick="goToProfile()">
                <i class="fas fa-user"></i>
            </button>
        </header>

        <!-- Flower Navigation -->
        <div class="flower-navigation">
            <div class="flower-center-logo">
                MS
            </div>
            
            <!-- Petal 1: Home Info -->
            <button class="petal-btn p1" onclick="openPage('info')">
                <i class="fas fa-info-circle"></i>
                <span>जानकारी</span>
            </button>
            
            <!-- Petal 2: Search Mazdoor -->
            <button class="petal-btn p2" onclick="openPage('search-mazdoor')">
                <i class="fas fa-search"></i>
                <span>मजदूर खोजें</span>
            </button>
            
            <!-- Petal 3: Search Room -->
            <button class="petal-btn p3" onclick="openPage('search-room')">
                <i class="fas fa-home"></i>
                <span>कमरा खोजें</span>
            </button>
            
            <!-- Petal 4: Post Room/Job -->
            <button class="petal-btn p4" onclick="openPage('post-ad')">
                <i class="fas fa-plus-circle"></i>
                <span>पोस्ट करें</span>
            </button>
            
            <!-- Petal 5: Profile -->
            <button class="petal-btn p5" onclick="openPage('profile')">
                <i class="fas fa-user-circle"></i>
                <span>प्रोफाइल</span>
            </button>
        </div>

        <!-- Nearby Services -->
        <div class="nearby-services">
            <h3><i class="fas fa-map-marker-alt"></i> नजदीकी सेवाएं</h3>
            <div class="services-grid">
                <div class="service-card">
                    <i class="fas fa-tools"></i>
                    <span>हार्डवेयर</span>
                </div>
                <div class="service-card">
                    <i class="fas fa-ambulance"></i>
                    <span>अस्पताल</span>
                </div>
                <div class="service-card">
                    <i class="fas fa-utensils"></i>
                    <span>भोजनालय</span>
                </div>
                <div class="service-card">
                    <i class="fas fa-bus"></i>
                    <span>ट्रांसपोर्ट</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Side Menu -->
    <div id="side-menu" class="side-menu">
        <div class="menu-header">
            <button class="close-menu" onclick="toggleMenu()">
                <i class="fas fa-times"></i>
            </button>
            <h3>मेनू</h3>
        </div>
        <div class="menu-items">
            <a href="info.html" class="menu-item">
                <i class="fas fa-question-circle"></i>
                <span>ऐप गाइड</span>
            </a>
            <a href="help.html" class="menu-item">
                <i class="fas fa-hands-helping"></i>
                <span>सहायता</span>
            </a>
            <a href="settings.html" class="menu-item">
                <i class="fas fa-cog"></i>
                <span>सेटिंग</span>
            </a>
            <a href="language.html" class="menu-item">
                <i class="fas fa-language"></i>
                <span>भाषा बदलें</span>
            </a>
            <button onclick="logout()" class="menu-item logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>लॉगआउट</span>
            </button>
        </div>
    </div>

    <script src="../script.js"></script>
    <script src="home.js"></script>
</body>
</html>
