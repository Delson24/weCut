// js/views/adminDashboard.js
import { appState } from '../state/appState.js';
import { renderView } from '../main.js';
import { convexApproveSalon } from '../services/api.js';

export function getAdminDashboardContent() {
    const pendingRegistrations = appState.pendingRegistrations.filter(reg => reg.status === 'pending');
    const approvedProfessionals = appState.professionals.filter(pro => pro.status === 'approved');
    
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                    <p class="text-gray-600">Gerencie cadastros, salões e usuários do sistema</p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${appState.users.length}</p>
                                <p class="text-gray-600">Total de Usuários</p>
                            </div>
                            <i data-lucide="users" class="w-8 h-8 text-blue-600"></i>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${approvedProfessionals.length}</p>
                                <p class="text-gray-600">Salões Ativos</p>
                            </div>
                            <i data-lucide="check-circle" class="w-8 h-8 text-green-600"></i>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${pendingRegistrations.length}</p>
                                <p class="text-gray-600">Cadastros Pendentes</p>
                            </div>
                            <i data-lucide="clock" class="w-8 h-8 text-yellow-600"></i>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${appState.appointments.length}</p>
                                <p class="text-gray-600">Agendamentos</p>
                            </div>
                            <i data-lucide="calendar" class="w-8 h-8 text-purple-600"></i>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="bg-white rounded-lg border border-gray-300 shadow-sm">
                    <div class="border-b border-gray-300">
                        <div class="flex overflow-x-auto">
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${appState.adminTab === 'pending-salons' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchAdminTab('pending-salons')">
                                <i data-lucide="clock" class="w-4 h-4 inline mr-2"></i>
                                Cadastros Pendentes
                                ${pendingRegistrations.length > 0 ? `
                                    <span class="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">${pendingRegistrations.length}</span>
                                ` : ''}
                            </button>
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${appState.adminTab === 'approved-salons' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchAdminTab('approved-salons')">
                                <i data-lucide="check-circle" class="w-4 h-4 inline mr-2"></i>
                                Salões Aprovados
                            </button>
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${appState.adminTab === 'users' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchAdminTab('users')">
                                <i data-lucide="user" class="w-4 h-4 inline mr-2"></i>
                                Todos os Usuários
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        ${getAdminTabContent()}
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Rejeição -->
        <div id="reject-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
            <div class="bg-white rounded-lg w-full max-w-md mx-4">
                <div class="border-b border-gray-300 p-6">
                    <h3 class="text-xl font-medium text-black">Rejeitar Cadastro</h3>
                </div>
                
                <div class="p-6">
                    <form id="reject-form" onsubmit="handleRejectSubmission(event)">
                        <input type="hidden" id="reject-registration-id">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-black mb-2">Motivo da Rejeição</label>
                            <textarea id="reject-reason" required rows="4" 
                                      class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                      placeholder="Digite o motivo da rejeição..."></textarea>
                        </div>
                        
                        <div class="flex gap-3">
                            <button type="button" onclick="closeRejectModal()" 
                                    class="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded wecut-button-hover">
                                Cancelar
                            </button>
                            <button type="submit" 
                                    class="flex-1 bg-red-600 text-white hover:bg-red-700 py-2 rounded wecut-button-hover">
                                Confirmar Rejeição
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modal de Detalhes do Salão -->
        <div id="salon-details-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
            <div class="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div class="border-b border-gray-300 p-6">
                    <h3 class="text-xl font-medium text-black" id="salon-details-title">Detalhes do Salão</h3>
                </div>
                
                <div class="p-6" id="salon-details-content">
                    <!-- Conteúdo será preenchido por JavaScript -->
                </div>
                
                <div class="border-t border-gray-300 p-6 flex gap-3">
                    <button onclick="closeSalonDetailsModal()" 
                            class="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded wecut-button-hover">
                        Fechar
                    </button>
                    <button id="approve-from-details" class="flex-1 bg-green-600 text-white hover:bg-green-700 py-2 rounded wecut-button-hover">
                        Aprovar Salão
                    </button>
                    <button id="reject-from-details" class="flex-1 bg-red-600 text-white hover:bg-red-700 py-2 rounded wecut-button-hover">
                        Rejeitar Salão
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getAdminTabContent() {
    const pendingRegistrations = appState.pendingRegistrations.filter(reg => reg.status === 'pending');
    const approvedProfessionals = appState.professionals.filter(pro => pro.status === 'approved');
    
    switch(appState.adminTab || 'pending-salons') {
        case 'pending-salons':
            return `
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Cadastros de Profissionais Pendentes</h2>
                    
                    ${pendingRegistrations.length === 0 ? `
                        <div class="text-center py-12">
                            <i data-lucide="check-circle" class="w-16 h-16 text-green-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum cadastro pendente</h3>
                            <p class="text-gray-600">Todos os cadastros foram revisados.</p>
                        </div>
                    ` : `
                        <div class="space-y-6">
                            ${pendingRegistrations.map(registration => `
                                <div class="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div class="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 class="text-lg font-medium text-gray-900">${registration.salonName}</h3>
                                            <p class="text-gray-600">Solicitado por: ${registration.name}</p>
                                            <p class="text-sm text-gray-500">Enviado em: ${new Date(registration.submittedAt).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <span class="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">Pendente</span>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="mail" class="w-4 h-4 text-gray-400"></i>
                                            <span>${registration.email}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="phone" class="w-4 h-4 text-gray-400"></i>
                                            <span>${registration.phone}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="map-pin" class="w-4 h-4 text-gray-400"></i>
                                            <span>${registration.location}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="scissors" class="w-4 h-4 text-gray-400"></i>
                                            <span>${registration.specialty}</span>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
                                        <p class="text-gray-600">${registration.address}</p>
                                    </div>
                                    
                                    <div class="flex gap-3">
                                        <button onclick="approveRegistration(${registration.id})" 
                                                class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg wecut-button-hover flex items-center gap-2">
                                            <i data-lucide="check" class="w-4 h-4"></i>
                                            Aprovar Cadastro
                                        </button>
                                        <button onclick="openRejectModal(${registration.id})" 
                                                class="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg wecut-button-hover flex items-center gap-2">
                                            <i data-lucide="x" class="w-4 h-4"></i>
                                            Rejeitar
                                        </button>
                                        <button onclick="viewSalonDetails(${registration.id})" 
                                                class="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg wecut-button-hover flex items-center gap-2">
                                            <i data-lucide="eye" class="w-4 h-4"></i>
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;
            
        case 'approved-salons':
            return `
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Salões Aprovados</h2>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="border-b border-gray-300 bg-gray-50">
                                    <th class="text-left py-3 px-4 text-black font-medium">Salão</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Proprietário</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Localização</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Especialidade</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Data de Aprovação</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${approvedProfessionals.map(professional => {
                                    const registration = appState.pendingRegistrations.find(reg => reg.professionalId === professional.id);
                                    return `
                                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                                            <td class="py-3 px-4">
                                                <div class="flex items-center gap-3">
                                                    <img src="${professional.image}" alt="${professional.name}" class="w-10 h-10 rounded-lg object-cover">
                                                    <span class="font-medium">${professional.name}</span>
                                                </div>
                                            </td>
                                            <td class="py-3 px-4">${registration?.name || professional.name}</td>
                                            <td class="py-3 px-4">${professional.location}</td>
                                            <td class="py-3 px-4">${professional.specialty}</td>
                                            <td class="py-3 px-4">${registration?.approvedAt ? new Date(registration.approvedAt).toLocaleDateString('pt-BR') : 'N/A'}</td>
                                            <td class="py-3 px-4">
                                                <div class="flex gap-2">
                                                    <button onclick="viewSalonDetails(${professional.id})" 
                                                            class="text-blue-600 hover:text-blue-800 text-sm">
                                                        Ver
                                                    </button>
                                                    <button onclick="deactivateSalon(${professional.id})" 
                                                            class="text-red-600 hover:text-red-800 text-sm">
                                                        Desativar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
        case 'users':
            return `
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Todos os Usuários</h2>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="border-b border-gray-300 bg-gray-50">
                                    <th class="text-left py-3 px-4 text-black font-medium">Usuário</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Email</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Tipo</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Data de Registo</th>
                                    <th class="text-left py-3 px-4 text-black font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${appState.users.map(user => {
                                    const professional = appState.professionals.find(pro => pro.userId === user.id);
                                    return `
                                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                                            <td class="py-3 px-4">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <i data-lucide="user" class="w-4 h-4 text-gray-600"></i>
                                                    </div>
                                                    <span>${user.name}</span>
                                                </div>
                                            </td>
                                            <td class="py-3 px-4">${user.email}</td>
                                            <td class="py-3 px-4">
                                                <span class="px-2 py-1 rounded-full text-xs ${user.type === 'admin' ? 'bg-purple-100 text-purple-800' : user.type === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                                                    ${user.type === 'admin' ? 'Administrador' : user.type === 'professional' ? 'Profissional' : 'Cliente'}
                                                </span>
                                            </td>
                                            <td class="py-3 px-4">${new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                                            <td class="py-3 px-4">
                                                <span class="px-2 py-1 rounded-full text-xs ${professional?.status === 'approved' ? 'bg-green-100 text-green-800' : professional?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">
                                                    ${professional ? (professional.status === 'approved' ? 'Ativo' : 'Pendente') : 'Ativo'}
                                                </span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
        default:
            return '<p class="text-gray-600">Conteúdo não disponível</p>';
    }
}

export function switchAdminTab(tab) {
    appState.adminTab = tab;
    renderView('admin-dashboard-page');
}

export async function approveRegistration(registrationId) {
    const registration = appState.pendingRegistrations.find(reg => reg.id === registrationId);
    if (registration) {
        const result = await convexApproveSalon(registration.professionalId);
        if (result.success) {
            registration.status = 'approved';
            registration.approvedAt = new Date().toISOString();
            alert('Cadastro aprovado com sucesso!');
            renderView('admin-dashboard-page');
        } else {
            alert('Erro ao aprovar cadastro: ' + result.error);
        }
    }
}

export function openRejectModal(registrationId) {
    document.getElementById('reject-registration-id').value = registrationId;
    document.getElementById('reject-modal').classList.remove('hidden');
}

export function closeRejectModal() {
    document.getElementById('reject-modal').classList.add('hidden');
}

export function handleRejectSubmission(event) {
    event.preventDefault();
    const registrationId = document.getElementById('reject-registration-id').value;
    const reason = document.getElementById('reject-reason').value;
    
    const registration = appState.pendingRegistrations.find(reg => reg.id === parseInt(registrationId));
    if (registration) {
        registration.status = 'rejected';
        registration.rejectionReason = reason;
        alert('Cadastro rejeitado com sucesso!');
        closeRejectModal();
        renderView('admin-dashboard-page');
    }
}

export function viewSalonDetails(registrationId) {
    const registration = appState.pendingRegistrations.find(reg => reg.id === registrationId);
    if (!registration) return;

    const modal = document.getElementById('salon-details-modal');
    const title = document.getElementById('salon-details-title');
    const content = document.getElementById('salon-details-content');

    title.textContent = `Detalhes do Salão - ${registration.salonName}`;
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="font-medium text-black mb-2">Informações do Salão</h4>
                <div class="space-y-2">
                    <p><strong>Nome do Salão:</strong> ${registration.salonName}</p>
                    <p><strong>Localização:</strong> ${registration.location}</p>
                    <p><strong>Endereço:</strong> ${registration.address}</p>
                    <p><strong>Telefone:</strong> ${registration.phone}</p>
                    <p><strong>Especialidade:</strong> ${registration.specialty}</p>
                </div>
            </div>
            <div>
                <h4 class="font-medium text-black mb-2">Informações do Proprietário</h4>
                <div class="space-y-2">
                    <p><strong>Nome:</strong> ${registration.name}</p>
                    <p><strong>Email:</strong> ${registration.email}</p>
                    <p><strong>Data de Envio:</strong> ${new Date(registration.submittedAt).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
        </div>
        ${registration.services ? `
            <div class="mt-4">
                <h4 class="font-medium text-black mb-2">Serviços Oferecidos</h4>
                <div class="flex flex-wrap gap-2">
                    ${registration.services.map(service => `
                        <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">${service}</span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    // Configurar os botões de aprovar e rejeitar no modal
    const approveBtn = document.getElementById('approve-from-details');
    const rejectBtn = document.getElementById('reject-from-details');

    approveBtn.onclick = () => {
        approveRegistration(registrationId);
        closeSalonDetailsModal();
    };

    rejectBtn.onclick = () => {
        openRejectModal(registrationId);
        closeSalonDetailsModal();
    };

    modal.classList.remove('hidden');
}

export function closeSalonDetailsModal() {
    document.getElementById('salon-details-modal').classList.add('hidden');
}

export function deactivateSalon(professionalId) {
    const professional = appState.professionals.find(pro => pro.id === professionalId);
    if (professional) {
        professional.status = 'inactive';
        alert('Salão desativado com sucesso!');
        renderView('admin-dashboard-page');
    }
}

export function initAdminDashboardListeners() {
    // Listeners serão adicionados dinamicamente quando o conteúdo for renderizado
}

// Adicionar funções ao escopo global
window.switchAdminTab = switchAdminTab;
window.approveRegistration = approveRegistration;
window.openRejectModal = openRejectModal;
window.closeRejectModal = closeRejectModal;
window.handleRejectSubmission = handleRejectSubmission;
window.viewSalonDetails = viewSalonDetails;
window.closeSalonDetailsModal = closeSalonDetailsModal;
window.deactivateSalon = deactivateSalon;