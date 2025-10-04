// js/views/adminDashboard.js
import { stateManager } from '../state/stateManager.js';
import { renderView } from '../main.js';

export function getAdminDashboardContent() {
    const professionals = stateManager.getApprovedProfessionals();
    const totalUsers = stateManager.state.users.length;
    const totalAppointments = stateManager.state.appointments.length;
    
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                    <p class="text-gray-600">Gerencie profissionais e usuários do sistema</p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${totalUsers}</p>
                                <p class="text-gray-600">Total de Usuários</p>
                            </div>
                            <i data-lucide="users" class="w-8 h-8 text-blue-600"></i>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${professionals.length}</p>
                                <p class="text-gray-600">Profissionais Cadastrados</p>
                            </div>
                            <i data-lucide="scissors" class="w-8 h-8 text-green-600"></i>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${totalAppointments}</p>
                                <p class="text-gray-600">Total de Agendamentos</p>
                            </div>
                            <i data-lucide="calendar" class="w-8 h-8 text-purple-600"></i>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="bg-white rounded-lg border border-gray-300 shadow-sm">
                    <div class="border-b border-gray-300">
                        <div class="flex overflow-x-auto">
                            <button id="professionals-tab" class="px-6 py-4 border-b-2 whitespace-nowrap ${stateManager.state.adminTab === 'professionals' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}">
                                <i data-lucide="scissors" class="w-4 h-4 inline mr-2"></i>
                                Profissionais Cadastrados
                            </button>
                            <button id="appointments-tab" class="px-6 py-4 border-b-2 whitespace-nowrap ${stateManager.state.adminTab === 'appointments' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}">
                                <i data-lucide="calendar" class="w-4 h-4 inline mr-2"></i>
                                Agendamentos
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        ${getAdminTabContent()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getAdminTabContent() {
    const professionals = stateManager.getApprovedProfessionals();
    const appointments = stateManager.state.appointments;
    
    switch(stateManager.state.adminTab) {
        case 'professionals':
            return `
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Todos os Profissionais Cadastrados</h2>
                    
                    ${professionals.length === 0 ? `
                        <div class="text-center py-12">
                            <i data-lucide="user-x" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum profissional cadastrado</h3>
                            <p class="text-gray-600">Ainda não há profissionais cadastrados no sistema.</p>
                        </div>
                    ` : `
                        <div class="overflow-x-auto">
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="border-b border-gray-300 bg-gray-50">
                                        <th class="text-left py-3 px-4 text-black font-medium">ID</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Profissional</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Salão</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Localização</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Contacto</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Serviços</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Data de Cadastro</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${professionals.map(professional => {
                                        const user = stateManager.state.users.find(u => u.id === professional.userId);
                                        const salon = stateManager.state.salons.find(s => s.id === professional.salonId);
                                        return `
                                            <tr class="border-b border-gray-200 hover:bg-gray-50">
                                                <td class="py-3 px-4 font-mono text-sm">${professional.id}</td>
                                                <td class="py-3 px-4">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                            <img src="${professional.image}" alt="${professional.name}" class="w-full h-full object-cover">
                                                        </div>
                                                        <div>
                                                            <div class="font-medium text-gray-900">${professional.name}</div>
                                                            <div class="text-sm text-gray-600">${professional.specialty}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="py-3 px-4">
                                                    <div class="font-medium text-gray-900">${salon?.name || 'N/A'}</div>
                                                    <div class="text-sm text-gray-600">${salon?.address || 'N/A'}</div>
                                                </td>
                                                <td class="py-3 px-4">${salon?.location || 'N/A'}</td>
                                                <td class="py-3 px-4">
                                                    <div class="text-sm">${salon?.phone || 'N/A'}</div>
                                                    <div class="text-xs text-gray-600">${user?.email || 'N/A'}</div>
                                                </td>
                                                <td class="py-3 px-4">
                                                    <div class="flex flex-wrap gap-1 max-w-xs">
                                                        ${professional.services.slice(0, 3).map(service => `
                                                            <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">${service}</span>
                                                        `).join('')}
                                                        ${professional.services.length > 3 ? `
                                                            <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">+${professional.services.length - 3}</span>
                                                        ` : ''}
                                                    </div>
                                                </td>
                                                <td class="py-3 px-4 text-sm">${new Date(salon?.submittedAt).toLocaleDateString('pt-BR')}</td>
                                                <td class="py-3 px-4">
                                                    <div class="flex gap-2">
                                                        <button data-professional-id="${professional.id}" class="view-professional-details-btn border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded text-sm wecut-button-hover">
                                                            <i data-lucide="eye" class="w-4 h-4 inline mr-1"></i>
                                                            Ver
                                                        </button>
                                                        <button data-professional-id="${professional.id}" class="remove-professional-btn bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded text-sm wecut-button-hover">
                                                            <i data-lucide="trash-2" class="w-4 h-4 inline mr-1"></i>
                                                            Remover
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            `;
            
        case 'appointments':
            return `
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Todos os Agendamentos</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-white p-4 rounded-lg border border-gray-300">
                            <p class="text-2xl font-bold text-gray-900">${appointments.length}</p>
                            <p class="text-gray-600">Total</p>
                        </div>
                        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                            <p class="text-2xl font-bold text-yellow-800">${appointments.filter(a => a.status === 'pending').length}</p>
                            <p class="text-yellow-700">Pendentes</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg border border-green-300">
                            <p class="text-2xl font-bold text-green-800">${appointments.filter(a => a.status === 'accepted').length}</p>
                            <p class="text-green-700">Aceites</p>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg border border-red-300">
                            <p class="text-2xl font-bold text-red-800">${appointments.filter(a => a.status === 'rejected').length}</p>
                            <p class="text-red-700">Recusados</p>
                        </div>
                    </div>

                    ${appointments.length === 0 ? `
                        <div class="text-center py-12">
                            <i data-lucide="calendar" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento</h3>
                            <p class="text-gray-600">Ainda não há agendamentos no sistema.</p>
                        </div>
                    ` : `
                        <div class="overflow-x-auto">
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="border-b border-gray-300 bg-gray-50">
                                        <th class="text-left py-3 px-4 text-black font-medium">Código</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Cliente</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Profissional</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Serviço</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Data/Hora</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Valor</th>
                                        <th class="text-left py-3 px-4 text-black font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${appointments.map(apt => {
                                        const professional = stateManager.state.professionals.find(pro => pro.id === apt.professionalId);
                                        return `
                                            <tr class="border-b border-gray-200 hover:bg-gray-50">
                                                <td class="py-3 px-4 font-mono">${apt.code}</td>
                                                <td class="py-3 px-4">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <i data-lucide="user" class="w-4 h-4 text-gray-600"></i>
                                                        </div>
                                                        <span>${apt.clientName}</span>
                                                    </div>
                                                </td>
                                                <td class="py-3 px-4">${professional?.name || 'N/A'}</td>
                                                <td class="py-3 px-4">${apt.service}</td>
                                                <td class="py-3 px-4">
                                                    <div>${new Date(apt.date).toLocaleDateString('pt-BR')}</div>
                                                    <div class="text-sm text-gray-600">${apt.time}</div>
                                                </td>
                                                <td class="py-3 px-4">${apt.price}</td>
                                                <td class="py-3 px-4">
                                                    <span class="px-2 py-1 rounded-full text-xs ${getAppointmentStatusBadgeClass(apt.status)}">
                                                        ${getAppointmentStatusText(apt.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            `;
            
        default:
            return '<p class="text-gray-600">Conteúdo não disponível</p>';
    }
}

function getAppointmentStatusBadgeClass(status) {
    switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getAppointmentStatusText(status) {
    switch(status) {
        case 'pending': return 'Pendente';
        case 'accepted': return 'Aceite';
        case 'rejected': return 'Recusado';
        case 'completed': return 'Concluído';
        default: return status;
    }
}

export function switchAdminTab(tab) {
    stateManager.setAdminTab(tab);
    renderView('admin-dashboard-page');
}

export function removeProfessional(professionalId) {
    if (!confirm('Tem certeza que deseja remover este profissional do sistema? Esta ação não pode ser desfeita.')) {
        return;
    }

    if (stateManager.removeProfessional(professionalId)) {
        alert('✅ Profissional removido com sucesso!');
        renderView('admin-dashboard-page');
    } else {
        alert('❌ Erro ao remover profissional.');
    }
}

export function viewProfessionalDetails(professionalId) {
    const professional = stateManager.state.professionals.find(p => p.id === professionalId);
    if (!professional) return;

    const user = stateManager.state.users.find(u => u.id === professional.userId);
    const salon = stateManager.state.salons.find(s => s.id === professional.salonId);

    const modal = document.getElementById('professional-details-modal');
    const title = document.getElementById('professional-details-title');
    const content = document.getElementById('professional-details-content');

    title.textContent = `Detalhes - ${professional.name}`;
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="font-medium text-black mb-2">Informações do Profissional</h4>
                <div class="space-y-2">
                    <p><strong>Nome:</strong> ${professional.name}</p>
                    <p><strong>Especialidade:</strong> ${professional.specialty}</p>
                    <p><strong>Avaliação:</strong> ${professional.rating} ⭐ (${professional.reviews} avaliações)</p>
                    <p><strong>Preço médio:</strong> ${professional.price}</p>
                    <p><strong>Descrição:</strong> ${professional.description}</p>
                </div>
                
                <h4 class="font-medium text-black mb-2 mt-4">Informações de Contacto</h4>
                <div class="space-y-2">
                    <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
                    <p><strong>Telefone:</strong> ${salon?.phone || 'N/A'}</p>
                </div>
            </div>
            <div>
                <h4 class="font-medium text-black mb-2">Informações do Salão</h4>
                <div class="space-y-2">
                    <p><strong>Nome do Salão:</strong> ${salon?.name || 'N/A'}</p>
                    <p><strong>Localização:</strong> ${salon?.location || 'N/A'}</p>
                    <p><strong>Endereço:</strong> ${salon?.address || 'N/A'}</p>
                    <p><strong>Horário:</strong> ${salon?.openingHours?.opening || '09:00'} - ${salon?.openingHours?.closing || '18:00'}</p>
                    <p><strong>Data de Cadastro:</strong> ${new Date(salon?.submittedAt).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Status:</strong> <span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Aprovado</span></p>
                </div>
                
                <h4 class="font-medium text-black mb-2 mt-4">Serviços Oferecidos</h4>
                <div class="flex flex-wrap gap-2">
                    ${professional.services.map(service => `
                        <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">${service}</span>
                    `).join('')}
                </div>
            </div>
        </div>
        ${salon?.photos && salon.photos.length > 0 ? `
            <div class="mt-4">
                <h4 class="font-medium text-black mb-2">Fotos do Salão</h4>
                <div class="grid grid-cols-3 gap-4">
                    ${salon.photos.map(photo => `
                        <img src="${photo}" alt="Foto do salão" class="w-full h-32 object-cover rounded-lg">
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    const removeBtn = document.getElementById('remove-from-details');
    removeBtn.onclick = () => {
        removeProfessional(professionalId);
        closeProfessionalDetailsModal();
    };

    modal.classList.remove('hidden');
}

export function closeProfessionalDetailsModal() {
    document.getElementById('professional-details-modal').classList.add('hidden');
}

export function initAdminDashboardListeners() {
    // Listeners para abas
    document.getElementById('professionals-tab')?.addEventListener('click', () => {
        switchAdminTab('professionals');
    });
    
    document.getElementById('appointments-tab')?.addEventListener('click', () => {
        switchAdminTab('appointments');
    });
    
    // Listeners para botões
    document.querySelectorAll('.view-professional-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const professionalId = parseInt(e.target.closest('button').dataset.professionalId);
            viewProfessionalDetails(professionalId);
        });
    });
    
    document.querySelectorAll('.remove-professional-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const professionalId = parseInt(e.target.closest('button').dataset.professionalId);
            removeProfessional(professionalId);
        });
    });
    
    // Atualizar ícones
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Adicionar funções ao escopo global
window.switchAdminTab = switchAdminTab;
window.removeProfessional = removeProfessional;
window.viewProfessionalDetails = viewProfessionalDetails;
window.closeProfessionalDetailsModal = closeProfessionalDetailsModal;