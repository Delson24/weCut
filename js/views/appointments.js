// js/views/appointments.js
import { appState } from '../state/appState.js';

export function getAppointmentsPageContent() {
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-6xl mx-auto px-4 py-8">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl text-black mb-2">Meus Agendamentos</h1>
                    <p class="text-gray-600">Gerencie seus agendamentos e histórico de serviços</p>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="border border-gray-300 rounded-lg p-6 text-center bg-white">
                        <div class="flex items-center justify-center mb-2">
                            <i data-lucide="calendar" class="w-6 h-6 text-blue-600"></i>
                        </div>
                        <p class="text-2xl text-black">${appState.appointments.length}</p>
                        <p class="text-sm text-gray-600">Próximos agendamentos</p>
                    </div>
                    
                    <div class="border border-gray-300 rounded-lg p-6 text-center bg-white">
                        <div class="flex items-center justify-center mb-2">
                            <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                        </div>
                        <p class="text-2xl text-black">${appState.appointments.filter(apt => apt.status === 'completed').length}</p>
                        <p class="text-sm text-gray-600">Serviços realizados</p>
                    </div>
                    
                    <div class="border border-gray-300 rounded-lg p-6 text-center bg-white">
                        <div class="flex items-center justify-center mb-2">
                            <i data-lucide="star" class="w-6 h-6 text-yellow-600"></i>
                        </div>
                        <p class="text-2xl text-black">4.5</p>
                        <p class="text-sm text-gray-600">Avaliação média dada</p>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="bg-white rounded-lg border border-gray-300">
                    <div class="border-b border-gray-300">
                        <div class="flex">
                            <button class="flex-1 py-4 text-center border-b-2 border-black text-black font-medium" onclick="switchAppointmentTab('upcoming')">Próximos</button>
                            <button class="flex-1 py-4 text-center text-gray-600 hover:text-black" onclick="switchAppointmentTab('history')">Histórico</button>
                            <button class="flex-1 py-4 text-center text-gray-600 hover:text-black" onclick="switchAppointmentTab('cancelled')">Cancelados</button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="space-y-6" id="appointments-list">
                            ${appState.appointments.map(appointment => `
                                <div class="border border-gray-300 rounded-lg hover:shadow-lg transition-shadow p-6">
                                    <div class="flex items-start gap-4">
                                        <div class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                            <img 
                                                src="${appointment.image}" 
                                                alt="${appointment.professional}"
                                                class="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        <div class="flex-1">
                                            <div class="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 class="text-lg text-black">${appointment.professional}</h3>
                                                    <p class="text-gray-600">${appointment.service}</p>
                                                    <p class="text-sm text-gray-500">Código: ${appointment.code}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-lg text-black">${appointment.price}</p>
                                                    <span class="bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded text-sm">Confirmado</span>
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                                                <div class="flex items-center gap-2 text-gray-600">
                                                    <i data-lucide="calendar" class="w-4 h-4"></i>
                                                    <span>${new Date(appointment.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                                </div>
                                                <div class="flex items-center gap-2 text-gray-600">
                                                    <i data-lucide="clock" class="w-4 h-4"></i>
                                                    <span>${appointment.time}</span>
                                                </div>
                                                <div class="flex items-center gap-2 text-gray-600">
                                                    <i data-lucide="map-pin" class="w-4 h-4"></i>
                                                    <span>${appointment.location}</span>
                                                </div>
                                                <div class="flex items-center gap-2 text-gray-600">
                                                    <i data-lucide="phone" class="w-4 h-4"></i>
                                                    <span>${appointment.phone}</span>
                                                </div>
                                            </div>

                                            <p class="text-sm text-gray-600 mb-4">${appointment.address}</p>

                                            <div class="flex flex-wrap gap-2">
                                                <button class="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded text-sm wecut-button-hover">
                                                    <i data-lucide="message-circle" class="w-4 h-4 inline mr-2"></i>
                                                    Mensagem
                                                </button>
                                                <button class="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded text-sm wecut-button-hover">
                                                    <i data-lucide="navigation" class="w-4 h-4 inline mr-2"></i>
                                                    Direções
                                                </button>
                                                <button class="border border-red-200 hover:bg-red-50 text-red-600 px-3 py-1 rounded text-sm wecut-button-hover">
                                                    <i data-lucide="x-circle" class="w-4 h-4 inline mr-2"></i>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function switchAppointmentTab(tab) {
    alert(`Alternando para aba: ${tab}`);
}

// Adicionar funções ao escopo global
window.switchAppointmentTab = switchAppointmentTab;