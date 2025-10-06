// js/views/auth.js
import { stateManager } from '../state/stateManager.js';
import { renderView } from '../main.js';


function handleLogin(event) {
    console.log('🔐 Tentando fazer login...');
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    try {
        // Buscar usuário no estado
        const user = stateManager.state.users.find(u => u.email === email);
        
        console.log('Usuário encontrado:', user);
        console.log('Senha digitada:', password);
        
        if (user) {
            // Verificar senha diretamente do usuário
            if (user.password === password) {
                stateManager.setCurrentUser(user);
                
                // Redirecionamento baseado no tipo de usuário
                if (user.type === 'admin') {
                    console.log('Redirecionando para admin dashboard');
                    renderView('admin-dashboard-page');
                } else if (user.type === 'professional') {
                    console.log('Redirecionando para professional dashboard');
                    renderView('professional-dashboard-page');
                } else {
                    console.log('Redirecionando para search page');
                    renderView('search-page');
                }
                
                updateAuthUI();
                alert(`✅ Login realizado com sucesso! Bem-vindo(a), ${user.name}`);
            } else {
                console.error('Senha incorreta. Esperada:', user.password, 'Recebida:', password);
                alert('❌ E-mail ou senha incorretos');
            }
        } else {
            console.error('Usuário não encontrado:', email);
            alert('❌ E-mail ou senha incorretos');
        }
    } catch (error) {
        console.error('Erro detalhado no login:', error);
        alert('Erro ao fazer login: ' + error.message);
    }
}

export async function handleRegister(event) {
    console.log('📝 handleRegister executado');
    if (event) event.preventDefault();
    
    const userType = document.querySelector('input[name="userType"]:checked')?.value;
    const name = document.getElementById('register-name')?.value;
    const email = document.getElementById('register-email')?.value;
    const password = document.getElementById('register-password')?.value;

    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Verificar se email já existe
    if (stateManager.state.users.find(u => u.email === email)) {
        alert('Este e-mail já está cadastrado');
        return;
    }

    try {
        const userData = {
            name,
            email,
            type: userType,
            password: password // Adicionar senha ao usuário
        };

        if (userType === 'professional') {
            const salonName = document.getElementById('salon-name')?.value;
            const salonLocation = document.getElementById('salon-location')?.value;
            const salonPhone = document.getElementById('salon-phone')?.value;
            const salonAddress = document.getElementById('salon-address')?.value;

            if (!salonName || !salonLocation || !salonPhone || !salonAddress) {
                alert('Por favor, preencha todos os campos obrigatórios do salão');
                return;
            }

            const salonData = {
                name: salonName,
                location: salonLocation,
                phone: salonPhone,
                address: salonAddress,
                services: Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value),
                openingHours: {
                    opening: document.getElementById('opening-time')?.value || '09:00',
                    closing: document.getElementById('closing-time')?.value || '18:00'
                },
                photos: document.getElementById('salon-photos')?.value.split(',').map(url => url.trim()).filter(url => url) || [],
                submittedAt: new Date().toISOString()
            };

            // CADASTRO AUTOMÁTICO
            const newUser = stateManager.addUser(userData);
            const newSalon = stateManager.addSalon({
                ...salonData,
                userId: newUser.id
            });
            
            stateManager.addProfessional({
                userId: newUser.id,
                salonId: newSalon.id,
                name: userData.name,
                specialty: salonData.services[0] || 'Profissional de Beleza',
                description: 'Profissional cadastrado no sistema WeCut',
                services: salonData.services,
                rating: 0,
                reviews: 0,
                image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
                price: '45,00 MT',
                location: salonData.location,
                status: 'approved'
            });

            stateManager.setCurrentUser(newUser);
            
            alert('✅ Cadastro realizado com sucesso! Seu perfil já está ativo.');
            renderView('professional-dashboard-page');
            
        } else {
            const newUser = stateManager.addUser(userData);
            stateManager.setCurrentUser(newUser);
            alert('✅ Cadastro realizado com sucesso!');
            renderView('search-page');
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) registerForm.reset();
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
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
                    
                    <form id="login-form" class="space-y-6">
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

                        <button type="button" onclick="handleLogin()" 
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
                                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                           value="09:00">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-black mb-2">Horário de Fechamento</label>
                                    <input type="time" id="closing-time" 
                                           class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                           value="18:00">
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

                        <button type="button" onclick="handleRegister()" 
                                class="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-lg wecut-button-hover">
                            Cadastrar
                        </button>

                        <div class="text-center">
                            <button type="button" onclick="showLoginForm()" 
                                    class="text-black hover:text-gray-600">
                                Já tem conta? Fazer login
                            </button>
                        </div>
                    </div>
                </div>

                <!-- AVISO DE SEGURANÇA -->
                <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    <strong>⚠️ AVISO:</strong> Esta é uma demonstração frontend. 
                    Em produção, a autenticação deve ser implementada no backend com medidas de segurança adequadas.
                </div>
            </div>
        </div>
    `;
}

export function getSignupPageContent() {
    return getLoginPageContent();
}

export function showRegisterForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm && registerForm) {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

export function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm && registerForm) {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

export function initAuthListeners() {
    console.log('🔧 Inicializando listeners de autenticação');
    
    // Toggle campos de profissional
    document.querySelectorAll('input[name="userType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const professionalFields = document.getElementById('professional-fields');
            if (professionalFields) {
                professionalFields.classList.toggle('hidden', this.value !== 'professional');
            }
        });
    });
    
    // Atualizar ícones
    if (window.lucide) {
        lucide.createIcons();
    }
}

export function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');

    if (stateManager.state.currentUser) {
        if (authButtons) authButtons.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        
        const userName = document.getElementById('user-name');
        if (userName) userName.textContent = stateManager.state.currentUser.name;
        updateUserTypeNavigation();
    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

function updateUserTypeNavigation() {
    const clientNav = document.getElementById('client-nav');
    const professionalNav = document.getElementById('professional-nav');
    const adminNav = document.getElementById('admin-nav');

    if (clientNav) clientNav.classList.add('hidden');
    if (professionalNav) professionalNav.classList.add('hidden');
    if (adminNav) adminNav.classList.add('hidden');

    if (stateManager.state.currentUser?.type === 'client') {
        if (clientNav) clientNav.classList.remove('hidden');
    } else if (stateManager.state.currentUser?.type === 'professional') {
        if (professionalNav) professionalNav.classList.remove('hidden');
    } else if (stateManager.state.currentUser?.type === 'admin') {
        if (adminNav) adminNav.classList.remove('hidden');
    }
}

// Adicionar funções ao escopo global
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.showRegisterForm = showRegisterForm;
window.showLoginForm = showLoginForm;