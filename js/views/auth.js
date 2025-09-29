// js/views/auth.js
import { appState } from '../state/appState.js';
import { renderView } from '../main.js';
import { convexAuth, convexRegister } from '../services/api.js';

export async function handleLogin(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = await convexAuth(email, password);
    
    if (result.success) {
        appState.currentUser = result.user;
        appState.userType = result.user.type;
        
        // Redirecionamento inteligente baseado no tipo de usuário
        if (appState.userType === 'admin') {
            renderView('admin-dashboard-page');
        } else if (appState.userType === 'professional') {
            // Verificar se o profissional está aprovado
            const professional = appState.professionals.find(pro => pro.userId === result.user.id);
            if (professional && professional.status === 'approved') {
                renderView('professional-dashboard-page');
            } else {
                renderView('pending-approval-page');
            }
        } else {
            renderView('search-page');
        }
        
        updateAuthUI();
    } else {
        alert('Erro no login: ' + result.error);
    }
}

export async function handleRegister(event) {
    event.preventDefault();
    
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const userData = {
        name,
        email,
        password,
        type: userType
    };

    if (userType === 'professional') {
        // Coletar dados adicionais do profissional
        const salonData = {
            name: document.getElementById('salon-name').value,
            location: document.getElementById('salon-location').value,
            phone: document.getElementById('salon-phone').value,
            address: document.getElementById('salon-address').value,
            services: Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value),
            openingHours: {
                opening: document.getElementById('opening-time').value,
                closing: document.getElementById('closing-time').value
            },
            photos: document.getElementById('salon-photos').value.split(',').map(url => url.trim()).filter(url => url),
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        userData.salonData = salonData;
    }

    const result = await convexRegister(userData);
    
    if (result.success) {
        if (userType === 'professional') {
            // Redirecionar para página de aguardando aprovação
            renderView('pending-approval-page');
        } else {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            renderView('login-page');
        }
        
        // Limpar formulário
        document.getElementById('register-form').reset();
    } else {
        alert('Erro no cadastro: ' + result.error);
    }
}

export function getLoginPageContent() {
    return `
        <div class="min-h-screen bg-white flex items-center justify-center px-4 py-8">
            <div class="w-full max-w-md">
                <!-- Back Button -->
                <button class="mb-8 text-black hover:bg-gray-50 p-2 rounded wecut-button-hover"
                        onclick="renderView('home-page')">
                    <i data-lucide="arrow-left" class="w-4 h-4 inline mr-2"></i>
                    Voltar
                </button>

                <!-- Logo -->
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-medium text-black mb-2">WeCut</h1>
                    <p class="text-gray-600">Entre na sua conta</p>
                </div>

                <!-- Login Form -->
                <div class="border border-gray-300 rounded-lg wecut-shadow p-6">
                    <h2 class="text-2xl text-center text-black mb-6">Fazer Login</h2>
                    
                    <form id="login-form" onsubmit="handleLogin(event)" class="space-y-6">
                        <div>
                            <label for="email" class="block text-black mb-2">E-mail</label>
                            <input type="email" id="email" required
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                   placeholder="seu@email.com">
                        </div>
                        
                        <div>
                            <label for="password" class="block text-black mb-2">Senha</label>
                            <input type="password" id="password" required
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                   placeholder="••••••••">
                        </div>

                        <button type="submit" 
                                class="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg wecut-button-hover">
                            Entrar
                        </button>

                        <div class="text-center">
                            <span class="text-gray-600">Não tem uma conta? </span>
                            <button type="button" class="text-black hover:text-gray-600" 
                                    onclick="showRegisterForm()">
                                Criar conta
                            </button>
                        </div>
                    </form>

                    <!-- Registration Form -->
                    <div id="register-form" class="hidden space-y-6 mt-6">
                        <div>
                            <label class="block text-black mb-3">Tipo de conta</label>
                            <div class="grid grid-cols-2 gap-4">
                                <label class="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input type="radio" name="userType" value="client" class="mr-3" checked>
                                    <div>
                                        <p class="font-medium text-black">Cliente</p>
                                        <p class="text-sm text-gray-600">Agendar serviços</p>
                                    </div>
                                </label>
                                <label class="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input type="radio" name="userType" value="professional" class="mr-3">
                                    <div>
                                        <p class="font-medium text-black">Profissional</p>
                                        <p class="text-sm text-gray-600">Oferecer serviços</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <input type="text" id="register-name" placeholder="Nome completo" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0" required>
                        <input type="email" id="register-email" placeholder="E-mail" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0" required>
                        <input type="password" id="register-password" placeholder="Senha" 
                               class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0" required>

                        <!-- Professional fields -->
                        <div id="professional-fields" class="hidden space-y-4">
                            <input type="text" id="salon-name" placeholder="Nome do salão/estabelecimento" 
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                            <input type="text" id="salon-location" placeholder="Localização (cidade, bairro)" 
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                            <input type="tel" id="salon-phone" placeholder="Telefone do salão" 
                                   class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                            <textarea id="salon-address" placeholder="Endereço completo do salão" 
                                      class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"></textarea>
                            
                            <!-- Serviços oferecidos -->
                            <div>
                                <label class="block text-sm font-medium text-black mb-2">Serviços Oferecidos</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" value="Corte Masculino" class="mr-2 service-checkbox">
                                        <span class="text-sm">Corte Masculino</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" value="Corte Feminino" class="mr-2 service-checkbox">
                                        <span class="text-sm">Corte Feminino</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" value="Barba" class="mr-2 service-checkbox">
                                        <span class="text-sm">Barba</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" value="Coloração" class="mr-2 service-checkbox">
                                        <span class="text-sm">Coloração</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" value="Manicure" class="mr-2 service-checkbox">
                                        <span class="text-sm">Manicure</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" value="Pedicure" class="mr-2 service-checkbox">
                                        <span class="text-sm">Pedicure</span>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Horário de funcionamento -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-black mb-2">Horário de Abertura</label>
                                    <input type="time" id="opening-time" 
                                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-black mb-2">Horário de Fechamento</label>
                                    <input type="time" id="closing-time" 
                                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                                </div>
                            </div>
                            
                            <!-- Upload de fotos (simulado) -->
                            <div>
                                <label class="block text-sm font-medium text-black mb-2">Fotos do Salão (URLs separadas por vírgula)</label>
                                <textarea id="salon-photos" placeholder="https://exemplo.com/foto1.jpg, https://exemplo.com/foto2.jpg" 
                                          class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                          rows="2"></textarea>
                                <p class="text-xs text-gray-500 mt-1">Forneça URLs separadas por vírgula para simular o upload de fotos</p>
                            </div>
                        </div>

                        <button onclick="handleRegister(event)" 
                                class="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-lg wecut-button-hover">
                            Cadastrar
                        </button>

                        <div class="text-center">
                            <button type="button" onclick="showLoginForm()" 
                                    class="text-black hover:text-gray-600">
                                Já tem conta? Fazer login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export function getSignupPageContent() {
    return getLoginPageContent(); // Reutiliza o mesmo conteúdo
}

export function getPendingApprovalContent() {
    return `
        <div class="min-h-screen bg-white flex items-center justify-center px-4 py-8">
            <div class="w-full max-w-md text-center">
                <div class="mb-8">
                    <i data-lucide="clock" class="w-16 h-16 text-yellow-500 mx-auto mb-4"></i>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Cadastro em Análise</h1>
                    <p class="text-gray-600">Seu cadastro como profissional está sendo revisado pela nossa equipe.</p>
                    <p class="text-gray-600 mt-2">Você receberá uma notificação por e-mail assim que for aprovado.</p>
                </div>
                
                <button onclick="renderView('home-page')" 
                        class="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg wecut-button-hover">
                    Voltar para o Início
                </button>
            </div>
        </div>
    `;
}

export function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

export function showLoginForm() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

export function initAuthListeners() {
    // Listener para alteração do tipo de conta
    document.addEventListener('change', function(e) {
        if (e.target.name === 'userType') {
            const professionalFields = document.getElementById('professional-fields');
            if (professionalFields) {
                professionalFields.classList.toggle('hidden', e.target.value !== 'professional');
            }
        }
    });
}

export function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userTypeSwitcher = document.getElementById('user-type-switcher');

    if (appState.currentUser) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        // Remover o seletor de tipo de usuário conforme solicitado
        if (userTypeSwitcher) {
            userTypeSwitcher.classList.add('hidden');
        }
        
        // Atualizar nome do usuário
        document.getElementById('user-name').textContent = appState.currentUser.name;
        
        // Atualizar navegação baseada no tipo de usuário
        updateUserTypeNavigation();
    } else {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
        if (userTypeSwitcher) {
            userTypeSwitcher.classList.add('hidden');
        }
    }
}

function updateUserTypeNavigation() {
    const clientNav = document.getElementById('client-nav');
    const professionalNav = document.getElementById('professional-nav');
    const adminNav = document.getElementById('admin-nav');

    // Esconder todas as navegações
    clientNav.classList.add('hidden');
    professionalNav.classList.add('hidden');
    adminNav.classList.add('hidden');

    // Mostrar apenas a navegação relevante
    if (appState.userType === 'client') {
        clientNav.classList.remove('hidden');
    } else if (appState.userType === 'professional') {
        professionalNav.classList.remove('hidden');
    } else if (appState.userType === 'admin') {
        adminNav.classList.remove('hidden');
    }
}

// Adicionar funções ao escopo global
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.showRegisterForm = showRegisterForm;
window.showLoginForm = showLoginForm;