function setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            renderView(this.dataset.view);
        });
    });
    
    document.getElementById('logo').addEventListener('click', function() {
        renderView('home-page');
    });
    
    document.getElementById('login-btn').addEventListener('click', function() {
        renderView('login-page');
    });
    
    document.getElementById('signup-btn').addEventListener('click', function() {
        renderView('login-page');
    });
    
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    document.getElementById('user-type-switcher').addEventListener('change', function() {
        appState.userType = this.value;
        updateUserTypeNavigation();
        
        if (this.value === 'professional') {
            renderView('professional-dashboard-page');
        } else if (this.value === 'admin') {
            renderView('admin-dashboard-page');
        } else {
            renderView('home-page');
        }
    });
}