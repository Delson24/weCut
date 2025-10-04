// js/views/booking.js
import { stateManager } from '../state/stateManager.js';
import { renderView } from '../main.js';

export function getBookingPageContent() {
    const professional = stateManager.state.professionals.find(p => p.id === stateManager.state.bookingProfessionalId) || stateManager.state.professionals[0];
    
    return `
        <div class="min-h-screen bg-white">
            <div class="max-w-6xl mx-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-300">
                    <button 
                        class="text-black hover:bg-gray-50 p-2 rounded wecut-button-hover"
                        onclick="renderView('professional-profile-page')"
                    >
                        <i data-lucide="arrow-left" class="w-4 h-4 inline mr-2"></i>
                        Voltar
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                    <!-- Left Column - Profile Info -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Professional Header -->
                        <div class="flex items-start gap-6">
                            <div class="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                                <img 
                                    src="${professional.image}" 
                                    alt="${professional.name}"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                            <div class="flex-1">
                                <h1 class="text-3xl font-medium text-black mb-1">${professional.name}</h1>
                                <p class="text-lg text-gray-600 mb-2">Barbearia Clássica</p>
                                <p class="text-gray-600 mb-3">Especialista em Cortes Masculinos e Barba</p>
                                
                                <div class="flex items-center gap-6 mb-4">
                                    <div class="flex items-center gap-2">
                                        <div class="flex gap-1">
                                            ${Array(5).fill().map((_, i) => `
                                                <i data-lucide="star" class="w-4 h-4 ${i < Math.floor(professional.rating) ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}"></i>
                                            `).join('')}
                                        </div>
                                        <span class="text-lg font-medium text-black">${professional.rating}</span>
                                        <span class="text-gray-600">(${professional.reviews} avaliações)</span>
                                    </div>
                                    <div class="flex items-center gap-1 text-gray-600">
                                        <i data-lucide="map-pin" class="w-4 h-4"></i>
                                        <span>${professional.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Booking Form -->
                        <div class="border border-gray-300 rounded-lg p-6">
                            <h3 class="text-xl font-medium text-black mb-4">Agendar Serviço</h3>
                            
                            <form id="booking-form" onsubmit="confirmBooking(event)">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-black mb-2">Data</label>
                                        <input type="date" id="booking-date" required
                                               class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-black mb-2">Horário</label>
                                        <select id="booking-time" required
                                                class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                                            <option value="">Selecione um horário</option>
                                            <option value="09:00">09:00</option>
                                            <option value="10:00">10:00</option>
                                            <option value="11:00">11:00</option>
                                            <option value="14:00">14:00</option>
                                            <option value="15:00">15:00</option>
                                            <option value="16:00">16:00</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-black mb-2">Serviço</label>
                                    <select id="booking-service" required
                                            class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0">
                                        <option value="">Selecione um serviço</option>
                                        <option value="Corte Masculino">Corte Masculino - 1.800 MT</option>
                                        <option value="Barba">Barba - 1.000 MT</option>
                                        <option value="Corte + Barba">Corte + Barba - 2.400 MT</option>
                                    </select>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-black mb-2">Observações (opcional)</label>
                                    <textarea id="booking-notes" rows="3"
                                              class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                              placeholder="Alguma observação especial..."></textarea>
                                </div>
                                
                                <button type="submit" 
                                        class="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg wecut-button-hover">
                                    Confirmar Agendamento
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Right Column - Summary -->
                    <div class="space-y-6">
                        <!-- Booking Summary -->
                        <div class="border border-gray-300 rounded-lg wecut-shadow p-6 sticky top-6">
                            <h3 class="text-xl font-medium text-black mb-4">Resumo do Agendamento</h3>
                            
                            <div class="space-y-3 mb-4">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Profissional:</span>
                                    <span class="text-black">${professional.name}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Serviço:</span>
                                    <span class="text-black" id="summary-service">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Data:</span>
                                    <span class="text-black" id="summary-date">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Horário:</span>
                                    <span class="text-black" id="summary-time">-</span>
                                </div>
                            </div>
                            
                            <div class="border-t border-gray-300 pt-4">
                                <div class="flex justify-between text-lg font-medium">
                                    <span class="text-black">Total:</span>
                                    <span class="text-black" id="summary-price">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function confirmBooking(event) {
    event.preventDefault();
    
    const service = document.getElementById('booking-service').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const notes = document.getElementById('booking-notes').value;
    
    if (!service || !date || !time) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Criar agendamento com status PENDENTE
    const newAppointment = {
        professionalId: stateManager.state.bookingProfessionalId || 1,
        clientName: stateManager.state.currentUser ? stateManager.state.currentUser.name : 'Cliente',
        service: service,
        date: new Date(date).toISOString(),
        time: time,
        price: getServicePrice(service),
        status: 'pending', // AGORA COMEÇA COMO PENDENTE
        notes: notes,
        location: 'Maputo',
        phone: '+258 84 123 4567',
        address: 'Av. Julius Nyerere, 123 - Polana, Maputo',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    };
    
    stateManager.addAppointment(newAppointment);
    
    alert(`📅 Agendamento solicitado! Código: ${newAppointment.code}\n\nO profissional será notificado e você receberá uma confirmação em breve.`);
    renderView('appointments-page');
}

function getServicePrice(service) {
    const prices = {
        'Corte Masculino': '1.800 MT',
        'Barba': '1.000 MT',
        'Corte + Barba': '2.400 MT'
    };
    return prices[service] || 'A combinar';
}

export function initBookingListeners() {
    // Atualizar resumo em tempo real
    document.addEventListener('input', function(e) {
        if (e.target.id === 'booking-service' || e.target.id === 'booking-date' || e.target.id === 'booking-time') {
            updateBookingSummary();
        }
    });
}

function updateBookingSummary() {
    const service = document.getElementById('booking-service').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;

    document.getElementById('summary-service').textContent = service || '-';
    document.getElementById('summary-date').textContent = date ? new Date(date).toLocaleDateString('pt-BR') : '-';
    document.getElementById('summary-time').textContent = time || '-';
    document.getElementById('summary-price').textContent = service ? getServicePrice(service) : '-';
}

// Adicionar funções ao escopo global
window.confirmBooking = confirmBooking;