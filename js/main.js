// js/main.js
import { stateManager } from './state/stateManager.js';
import { updateAuthUI } from './views/auth.js';

// Sistema de navegação por show/hide
export function renderView(viewName) {
    console.log('🔄 Navegando para:', viewName);
    
    // Esconder todas as sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active-page');
    });

    // Mostrar section alvo
    const targetSection = document.getElementById(viewName);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active-page');
        
        // Atualizar ícones Lucide
        if (window.lucide) {
            lucide.createIcons();
        }
        
        // Inicializar listeners específicos da view
        initViewListeners(viewName);
    } else {
        console.error('❌ Section não encontrada:', viewName);
    }
}

// Inicializar listeners específicos por página
function initViewListeners(viewName) {
    console.log('🎯 Inicializando listeners para:', viewName);
    
    switch (viewName) {
        case 'login-page':
            initAuthPageListeners();
            break;
        case 'search-page':
            initSearchListeners();
            break;
        case 'booking-page':
            initBookingListeners();
            break;
        case 'admin-dashboard-page':
            import('./views/adminDashboard.js').then(module => {
                if (module.initAdminDashboardListeners) {
                    module.initAdminDashboardListeners();
                }
            });
            break;
        case 'professional-dashboard-page':
            import('./views/profissionalDashboard.js').then(module => {
                if (module.initProfessionalDashboardListeners) {
                    module.initProfessionalDashboardListeners();
                }
            });
            break;
    }
}

function initAuthPageListeners() {
    console.log('🎯 Inicializando listeners da página de auth');
    // Os formulários já usam onsubmit, então não precisamos adicionar listeners aqui
}

function initSearchListeners() {
    console.log('🎯 Inicializando listeners de busca');
    
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('[onclick="performSearch()"]');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function initBookingListeners() {
    console.log('🎯 Inicializando listeners de agendamento');
    
    // Atualizar resumo em tempo real
    const bookingService = document.getElementById('booking-service');
    const bookingDate = document.getElementById('booking-date');
    const bookingTime = document.getElementById('booking-time');
    
    if (bookingService) {
        bookingService.addEventListener('change', updateBookingSummary);
    }
    if (bookingDate) {
        bookingDate.addEventListener('change', updateBookingSummary);
    }
    if (bookingTime) {
        bookingTime.addEventListener('change', updateBookingSummary);
    }
}

// Funções de agendamento
function updateBookingSummary() {
    const service = document.getElementById('booking-service')?.value;
    const date = document.getElementById('booking-date')?.value;
    const time = document.getElementById('booking-time')?.value;

    const summaryService = document.getElementById('summary-service');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryPrice = document.getElementById('summary-price');

    if (summaryService) summaryService.textContent = service || '-';
    if (summaryDate) summaryDate.textContent = date ? new Date(date).toLocaleDateString('pt-BR') : '-';
    if (summaryTime) summaryTime.textContent = time || '-';
    if (summaryPrice) summaryPrice.textContent = getServicePrice(service) || '-';
}

function getServicePrice(service) {
    const prices = {
        'Corte Masculino': '1.800 MT',
        'Barba': '1.000 MT',
        'Corte + Barba': '2.400 MT'
    };
    return prices[service] || 'A combinar';
}

// ========== CRÍTICO: EXPOR FUNÇÕES GLOBAIS ==========

// Funções globais para navegação
window.renderView = renderView;

window.viewProfessional = function(professionalId) {
    console.log('Ver profissional:', professionalId);
    stateManager.state.bookingProfessionalId = professionalId;
    renderView('professional-profile-page');
};

window.startBooking = function(professionalId) {
    console.log('Iniciar agendamento para:', professionalId);
    if (!stateManager.state.currentUser) {
        alert('Por favor, faça login para agendar um serviço.');
        renderView('login-page');
        return;
    }
    stateManager.state.bookingProfessionalId = professionalId;
    renderView('booking-page');
};

window.showRegisterForm = function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm && registerForm) {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
};

window.showLoginForm = function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm && registerForm) {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
};

// Funções de navegação específicas
window.switchAppointmentTab = function(tab) {
    console.log(`Alternando para aba de agendamentos: ${tab}`);
    // Implementar lógica de alternância de abas
    document.querySelectorAll('[onclick*="switchAppointmentTab"]').forEach(btn => {
        btn.classList.remove('border-black', 'text-black', 'font-medium');
        btn.classList.add('text-gray-600');
    });
    
    const activeBtn = document.querySelector(`[onclick*="switchAppointmentTab('${tab}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('border-black', 'text-black', 'font-medium');
        activeBtn.classList.remove('text-gray-600');
    }
};

window.switchAdminTab = function(tab) {
    stateManager.setAdminTab(tab);
    renderView('admin-dashboard-page');
};

window.switchProfessionalTab = function(tab) {
    stateManager.setProfessionalTab(tab);
    renderView('professional-dashboard-page');
};

// Funções de busca
window.performSearch = function() {
    const searchTerm = document.getElementById('search-input')?.value;
    console.log(`Buscando por: ${searchTerm}`);
    alert(`Buscando por: ${searchTerm}`);
};

window.showFilters = function() {
    console.log('Mostrar filtros de busca');
    alert('Mostrar filtros de busca');
};

// Funções de agendamento
window.confirmBooking = function(event) {
    if (event) event.preventDefault();
    
    const service = document.getElementById('booking-service')?.value;
    const date = document.getElementById('booking-date')?.value;
    const time = document.getElementById('booking-time')?.value;
    
    if (!service || !date || !time) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    alert(`📅 Agendamento confirmado para ${date} às ${time}`);
    renderView('appointments-page');
};

// Logout
window.handleLogout = function() {
    stateManager.setCurrentUser(null);
    updateAuthUI();
    renderView('home-page');
};

// Funções para ações do admin
window.approveRegistration = function(registrationId) {
    if (stateManager.approveProfessionalRegistration(registrationId)) {
        alert('✅ Cadastro aprovado com sucesso!');
        renderView('admin-dashboard-page');
    } else {
        alert('❌ Erro ao aprovar cadastro.');
    }
};

window.openRejectModal = function(registrationId) {
    alert(`Abrir modal para rejeitar cadastro: ${registrationId}`);
};

window.viewSalonDetails = function(salonId) {
    alert(`Ver detalhes do salão: ${salonId}`);
};

// Funções para ações do profissional
window.viewAppointmentDetails = function(appointmentId) {
    alert(`Ver detalhes do agendamento: ${appointmentId}`);
};

window.markAppointmentAsCompleted = function(appointmentId) {
    if (confirm('Marcar este agendamento como concluído?')) {
        if (stateManager.updateAppointmentStatus(appointmentId, 'completed')) {
            alert('✅ Agendamento marcado como concluído!');
            renderView('professional-dashboard-page');
        }
    }
};

window.cancelAppointment = function(appointmentId) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        if (stateManager.updateAppointmentStatus(appointmentId, 'cancelled')) {
            alert('❌ Agendamento cancelado.');
            renderView('professional-dashboard-page');
        }
    }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 WeCut iniciado');
    
    // Restaurar estado
    stateManager.restoreState();
    
    // Inicializar ícones
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Navegação por data-view
    document.querySelectorAll('[data-view]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const targetView = this.getAttribute('data-view');
            renderView(targetView);
        });
    });
    
    // Logo -> Home
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => renderView('home-page'));
    }
    
    // Botões de auth
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => renderView('login-page'));
    if (signupBtn) signupBtn.addEventListener('click', () => renderView('login-page'));
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    // ========== CRÍTICO: IMPORTAR E EXPOR FUNÇÕES DE AUTH ==========
    import('./views/auth.js').then(module => {
        console.log('✅ Módulo auth carregado');
        
        // Expor funções de autenticação
        if (module.handleLogin) {
            window.handleLogin = module.handleLogin;
            console.log('✅ handleLogin exposto globalmente');
        }
        
        if (module.handleRegister) {
            window.handleRegister = module.handleRegister;
            console.log('✅ handleRegister exposto globalmente');
        }
        
        if (module.showRegisterForm) {
            window.showRegisterForm = module.showRegisterForm;
        }
        
        if (module.showLoginForm) {
            window.showLoginForm = module.showLoginForm;
        }
        
        // Verificar se as funções estão disponíveis
        console.log('typeof window.handleLogin:', typeof window.handleLogin);
        console.log('typeof window.handleRegister:', typeof window.handleRegister);
        console.log('typeof window.renderView:', typeof window.renderView);
    }).catch(error => {
        console.error('❌ Erro ao carregar módulo auth:', error);
    });
    
    // Atualizar UI de autenticação
    updateAuthUI();
    
    console.log('✅ Inicialização completa');
    
    // Debug: verificar funções globais
    setTimeout(() => {
        console.log('=== VERIFICAÇÃO DE FUNÇÕES GLOBAIS ===');
        console.log('handleLogin:', typeof window.handleLogin);
        console.log('handleRegister:', typeof window.handleRegister);
        console.log('renderView:', typeof window.renderView);
        console.log('performSearch:', typeof window.performSearch);
        console.log('viewProfessional:', typeof window.viewProfessional);
        console.log('startBooking:', typeof window.startBooking);
    }, 1000);
});