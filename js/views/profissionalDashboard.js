// js/views/professionalDashboard.js
import { appState } from '../state/appState.js';
import { renderView } from '../main.js';
import { convexUpdateAppointmentStatus } from '../services/api.js';

export function getProfessionalDashboardContent() {
    const professional = appState.professionals.find(p => p.userId === appState.currentUser.id);
    const professionalAppointments = appState.appointments.filter(apt => apt.professionalId === professional.id);
    
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard Profissional</h1>
                    <p class="text-gray-600">Gerencie seus agendamentos e serviços</p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${getTodayAppointments(professionalAppointments).length}</p>
                                <p class="text-gray-600">Agendamentos Hoje</p>
                            </div>
                            <i data-lucide="calendar" class="w-8 h-8 text-blue-600"></i>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${getUpcomingAppointments(professionalAppointments).length}</p>
                                <p class="text-gray-600">Próximos 7 Dias</p>
                            </div>
                            <i data-lucide="calendar-days" class="w-8 h-8 text-green-600"></i>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${professional.rating || '4.8'}</p>
                                <p class="text-gray-600">Avaliação Média</p>
                            </div>
                            <i data-lucide="star" class="w-8 h-8 text-yellow-600"></i>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-bold text-gray-900">${professional.reviews || '0'}</p>
                                <p class="text-gray-600">Avaliações</p>
                            </div>
                            <i data-lucide="message-circle" class="w-8 h-8 text-purple-600"></i>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="bg-white rounded-lg border border-gray-300 shadow-sm">
                    <div class="border-b border-gray-300">
                        <div class="flex overflow-x-auto">
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${appState.professionalTab === 'today' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchProfessionalTab('today')">
                                <i data-lucide="calendar" class="w-4 h-4 inline mr-2"></i>
                                Hoje
                            </button>
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${appState.professionalTab === 'upcoming' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchProfessionalTab('upcoming')">
                                <i data-lucide="calendar-days" class="w-4 h-4 inline mr-2"></i>
                                Próximos
                            </button>
                            <button class="px-6 py-4 border-b-2 whitespace-nowrap ${appState.professionalTab === 'completed' ? 'border-black text-black font-medium' : 'text-gray-600 hover:text-black'}" 
                                    onclick="switchProfessionalTab('completed')">
                                <i data-lucide="check-circle" class="w-4 h-4 inline mr-2"></i>
                                Concluídos
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        ${getProfessionalTabContent(professionalAppointments)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getProfessionalTabContent(appointments) {
    const today = new Date().toDateString();
    
    switch(appState.professionalTab || 'today') {
        case 'today':
            const todayAppointments = appointments.filter(apt => 
                new Date(apt.date).toDateString() === today
            );
            return renderAppointmentsList(todayAppointments, 'today');
            
        case 'upcoming':
            const upcomingAppointments = appointments.filter(apt => 
                new Date(apt.date) >= new Date() && 
                new Date(apt.date).toDateString() !== today
            );
            return renderAppointmentsList(upcomingAppointments, 'upcoming');
            
        case 'completed':
            const completedAppointments = appointments.filter(apt => 
                apt.status === 'completed' || new Date(apt.date) < new Date()
            );
            return renderAppointmentsList(completedAppointments, 'completed');
            
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
                <p class="text-gray-600">${type === 'today' ? 'Não há agendamentos para hoje.' : 
                                         type === 'upcoming' ? 'Não há agendamentos futuros.' : 
                                         'Não há agendamentos concluídos.'}</p>
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
                        </div>
                        <span class="px-3 py-1 rounded-full text-sm ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                        }">
                            ${apt.status === 'confirmed' ? 'Confirmado' :
                              apt.status === 'pending' ? 'Pendente' :
                              apt.status === 'completed' ? 'Concluído' :
                              'Cancelado'}
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div class="flex items-center gap-4">
                            <span>📅 ${new Date(apt.date).toLocaleDateString('pt-BR')}</span>
                            <span>⏰ ${apt.time}</span>
                            <span>💰 ${apt.price}</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <button onclick="viewAppointmentDetails(${apt.id})" 
                                class="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded text-sm wecut-button-hover">
                            <i data-lucide="eye" class="w-4 h-4 inline mr-1"></i>
                            Detalhes
                        </button>
                        
                        ${type === 'today' || type === 'upcoming' ? `
                            <button onclick="markAppointmentAsCompleted(${apt.id})" 
                                    class="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded text-sm wecut-button-hover">
                                <i data-lucide="check" class="w-4 h-4 inline mr-1"></i>
                                Concluir
                            </button>
                            <button onclick="cancelAppointment(${apt.id})" 
                                    class="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded text-sm wecut-button-hover">
                                <i data-lucide="x" class="w-4 h-4 inline mr-1"></i>
                                Cancelar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Funções auxiliares
function getTodayAppointments(appointments) {
    const today = new Date().toDateString();
    return appointments.filter(apt => new Date(apt.date).toDateString() === today);
}

function getUpcomingAppointments(appointments) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return appointments.filter(apt => new Date(apt.date) >= today && new Date(apt.date) <= nextWeek);
}

// Ações nos agendamentos
export async function markAppointmentAsCompleted(appointmentId) {
    try {
        const result = await convexUpdateAppointmentStatus(appointmentId, 'completed');
        if (result.success) {
            const appointment = appState.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = 'completed';
            }
            alert('Agendamento marcado como concluído!');
            renderView('professional-dashboard-page');
        }
    } catch (error) {
        alert('Erro ao atualizar agendamento: ' + error.message);
    }
}

export async function cancelAppointment(appointmentId) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        try {
            const result = await convexUpdateAppointmentStatus(appointmentId, 'cancelled');
            if (result.success) {
                const appointment = appState.appointments.find(apt => apt.id === appointmentId);
                if (appointment) {
                    appointment.status = 'cancelled';
                }
                alert('Agendamento cancelado!');
                renderView('professional-dashboard-page');
            }
        } catch (error) {
            alert('Erro ao cancelar agendamento: ' + error.message);
        }
    }
}

export function viewAppointmentDetails(appointmentId) {
    const appointment = appState.appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;
    
    alert(`Detalhes do agendamento:\nCliente: ${appointment.clientName}\nServiço: ${appointment.service}\nData: ${new Date(appointment.date).toLocaleDateString('pt-BR')}\nHora: ${appointment.time}\nValor: ${appointment.price}`);
}

export function switchProfessionalTab(tab) {
    appState.professionalTab = tab;
    renderView('professional-dashboard-page');
}

export function initProfessionalDashboardListeners() {
    // Listeners serão adicionados dinamicamente quando o conteúdo for renderizado
}

// Adicionar funções ao escopo global
window.switchProfessionalTab = switchProfessionalTab;
window.markAppointmentAsCompleted = markAppointmentAsCompleted;
window.cancelAppointment = cancelAppointment;
window.viewAppointmentDetails = viewAppointmentDetails;