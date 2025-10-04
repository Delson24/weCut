// js/views/profissionalDashboard.js
import { stateManager } from '../state/stateManager.js';
import { renderView } from '../main.js';

export function getProfessionalDashboardContent() {
    const professional = stateManager.state.professionals.find(p => p.userId === stateManager.state.currentUser?.id);
    const appointments = stateManager.getProfessionalAppointments(professional?.id);
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
    
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard Profissional</h1>
                    <p class="text-gray-600">Gerencie seus agendamentos e serviços</p>
                    
                    <!-- Banner de Status -->
                    <div class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <p>✅ Seu perfil está ativo e visível para clientes</p>
                    </div>
                    
                    ${pendingAppointments.length > 0 ? `
                        <div class="mt-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                            <p>📬 Você tem <strong>${pendingAppointments.length}</strong> novo(s) agendamento(s) para confirmar</p>
                        </div>
                    ` : ''}
                </div>

                <!-- Tabs -->
                <div class="bg-white rounded-lg border border-gray-300 shadow-sm">
                    <div class="border-b border-gray-300">
                        <div class="flex overflow-x-auto">
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${stateManager.state.professionalTab === 'pending' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchProfessionalTab('pending')">
                                <i data-lucide="clock" class="w-4 h-4 inline mr-2"></i>
                                Pendentes
                                ${pendingAppointments.length > 0 ? `
                                    <span class="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">${pendingAppointments.length}</span>
                                ` : ''}
                            </button>
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${stateManager.state.professionalTab === 'accepted' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchProfessionalTab('accepted')">
                                <i data-lucide="check-circle" class="w-4 h-4 inline mr-2"></i>
                                Aceites
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        ${getProfessionalTabContent(appointments)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getProfessionalTabContent(appointments) {
    switch(stateManager.state.professionalTab) {
        case 'pending':
            const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
            return renderAppointmentsList(pendingAppointments, 'pending');
            
        case 'accepted':
            const acceptedAppointments = appointments.filter(apt => apt.status === 'accepted');
            return renderAppointmentsList(acceptedAppointments, 'accepted');
            
        default:
            return '<p class="text-gray-600">Conteúdo não disponível</p>';
    }
}

function renderAppointmentsList(appointments, type) {
    if (appointments.length === 0) {
        return `
            <div class="text-center py-12">
                <i data-lucide="calendar" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento</h3>
                <p class="text-gray-600">${type === 'pending' ? 'Não há agendamentos pendentes.' : 'Não há agendamentos aceites.'}</p>
            </div>
        `;
    }
    
    return `
        <div class="space-y-4">
            ${appointments.map(apt => `
                <div class="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <h3 class="font-medium text-gray-900">${apt.clientName}</h3>
                            <p class="text-gray-600">${apt.service} • ${apt.time}</p>
                            <p class="text-sm text-gray-500">Código: ${apt.code}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-sm ${type === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                            ${type === 'pending' ? 'Pendente' : 'Aceite'}
                        </span>
                    </div>
                    
                    <div class="text-sm text-gray-600 mb-3">
                        <p><strong>Data:</strong> ${new Date(apt.date).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Hora:</strong> ${apt.time}</p>
                        <p><strong>Valor:</strong> ${apt.price}</p>
                        <p><strong>Contacto:</strong> ${apt.phone}</p>
                        <p><strong>Local:</strong> ${apt.address}</p>
                        ${apt.notes ? `<p><strong>Observações:</strong> ${apt.notes}</p>` : ''}
                    </div>
                    
                    <div class="flex gap-2">
                        ${type === 'pending' ? `
                            <button onclick="acceptAppointment(${apt.id})" class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded text-sm wecut-button-hover">
                                <i data-lucide="check" class="w-4 h-4 inline mr-1"></i>
                                Aceitar
                            </button>
                            <button onclick="rejectAppointment(${apt.id})" class="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded text-sm wecut-button-hover">
                                <i data-lucide="x" class="w-4 h-4 inline mr-1"></i>
                                Recusar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

export function switchProfessionalTab(tab) {
    stateManager.setProfessionalTab(tab);
    renderView('professional-dashboard-page');
}

export function acceptAppointment(appointmentId) {
    if (stateManager.updateAppointmentStatus(appointmentId, 'accepted')) {
        alert('✅ Agendamento aceito! O cliente foi notificado.');
        renderView('professional-dashboard-page');
    }
}

export function rejectAppointment(appointmentId) {
    if (confirm('Tem certeza que deseja recusar este agendamento?')) {
        if (stateManager.updateAppointmentStatus(appointmentId, 'rejected')) {
            alert('❌ Agendamento recusado. O cliente foi notificado.');
            renderView('professional-dashboard-page');
        }
    }
}

export function initProfessionalDashboardListeners() {
    console.log('🔧 Inicializando listeners do professional dashboard');
    
    // Atualizar ícones
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Adicionar funções ao escopo global
window.switchProfessionalTab = switchProfessionalTab;
window.acceptAppointment = acceptAppointment;
window.rejectAppointment = rejectAppointment;