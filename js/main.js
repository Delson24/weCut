// js/main.js
import { appState } from './state/appState.js';
import { 
    getLoginPageContent, 
    getSignupPageContent, 
    getPendingApprovalContent, 
    initAuthListeners,
    updateAuthUI 
} from './views/auth.js';
import { 
    getAdminDashboardContent, 
    initAdminDashboardListeners 
} from './views/adminDashboard.js';
import { 
    getProfessionalDashboardContent, 
    initProfessionalDashboardListeners 
} from './views/professionalDashboard.js';
import { getHomePageContent } from './views/home.js';
import { getSearchPageContent } from './views/search.js';
import { getBookingPageContent, initBookingListeners } from './views/booking.js';
import { getAppointmentsPageContent } from './views/appointments.js';
import { getProfessionalProfileContent } from './views/professionalProfile.js';

// Função principal para renderizar views
export function renderView(viewName) {
    const pageContainer = document.getElementById('page-container');
    const pageSections = document.querySelectorAll('.page-section');
    
    // Esconder todas as seções
    pageSections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active-page');
    });

    let content = '';
    let targetSection = document.getElementById(viewName);

    // Gerar conteúdo baseado na view
    switch (viewName) {
        case 'home-page':
            content = getHomePageContent();
            break;
        case 'search-page':
            content = getSearchPageContent();
            break;
        case 'login-page':
            content = getLoginPageContent();
            break;
        case 'signup-page':
            content = getSignupPageContent();
            break;
        case 'admin-dashboard-page':
            content = getAdminDashboardContent();
            break;
        case 'professional-dashboard-page':
            content = getProfessionalDashboardContent();
            break;
        case 'pending-approval-page':
            content = getPendingApprovalContent();
            break;
        case 'booking-page':
            content = getBookingPageContent();
            break;
        case 'appointments-page':
            content = getAppointmentsPageContent();
            break;
        case 'professional-profile-page':
            content = getProfessionalProfileContent();
            break;
        default:
            content = '<div class="p-8 text-center">Página não encontrada</div>';
    }

    // Se a seção não existe, criar uma nova
    if (!targetSection) {
        targetSection = document.createElement('section');
        targetSection.id = viewName;
        targetSection.className = 'page-section hidden';
        pageContainer.appendChild(targetSection);
    }

    // Atualizar conteúdo e mostrar a seção
    targetSection.innerHTML = content;
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active-page');

    // Inicializar listeners específicos da view
    initViewListeners(viewName);

    // Atualizar ícones Lucide
    if (window.lucide) {
        lucide.createIcons();
    }
}

function initViewListeners(viewName) {
    switch (viewName) {
        case 'login-page':
        case 'signup-page':
        case 'pending-approval-page':
            initAuthListeners();
            break;
        case 'admin-dashboard-page':
            initAdminDashboardListeners();
            break;
        case 'professional-dashboard-page':
            initProfessionalDashboardListeners();
            break;
        case 'booking-page':
            initBookingListeners();
            break;
    }

    // Listeners globais
    initGlobalListeners();
}

function initGlobalListeners() {
    // Navegação por links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-view');
            renderView(targetPage);
        });
    });

    // Logo - volta para home
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => {
            renderView('home-page');
        });
    }

    // Botões de autenticação
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            renderView('login-page');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            renderView('signup-page');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Botões com data-view
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-view')) {
            const targetPage = e.target.getAttribute('data-view');
            renderView(targetPage);
        }
    });
}

function handleLogout() {
    appState.currentUser = null;
    appState.userType = 'client';
    updateAuthUI();
    renderView('home-page');
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ícones Lucide
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Inicializar estado se não existir
    if (!window.appState) {
        window.appState = {
            currentUser: null,
            userType: 'client',
            activeView: 'home-page',
            adminTab: 'pending-salons',
            professionalTab: 'today',
            users: [],
            professionals: [],
            pendingRegistrations: [],
            appointments: []
        };
    }
    
    renderView('home-page');
    updateAuthUI();
});

// Adicionar funções ao escopo global
window.renderView = renderView;
window.handleLogout = handleLogout;