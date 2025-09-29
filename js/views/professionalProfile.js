// js/views/professionalProfile.js
import { appState } from '../state/appState.js';
import { renderView } from '../main.js';

export function getProfessionalProfileContent() {
    const professional = appState.professionals[0]; // Para simplificar, pegamos o primeiro profissional
    
    return `
        <div class="min-h-screen bg-white">
            <div class="max-w-6xl mx-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-300">
                    <button 
                        class="text-black hover:bg-gray-50 p-2 rounded wecut-button-hover"
                        onclick="renderView('search-page')"
                    >
                        <i data-lucide="arrow-left" class="w-4 h-4 inline mr-2"></i>
                        Voltar
                    </button>
                    <div class="flex gap-2">
                        <button class="text-black hover:bg-gray-50 p-2 rounded wecut-button-hover">
                            <i data-lucide="heart" class="w-4 h-4"></i>
                        </button>
                        <button class="text-black hover:bg-gray-50 p-2 rounded wecut-button-hover">
                            <i data-lucide="share-2" class="w-4 h-4"></i>
                        </button>
                    </div>
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

                                <p class="text-gray-700 mb-4">Profissional apaixonado por criar looks únicos e modernos. Especializo-me em cortes masculinos clássicos e contemporâneos, sempre buscando a excelência no atendimento aos meus clientes em Maputo.</p>

                                <div class="flex items-center gap-4 text-sm text-gray-600">
                                    <div class="flex items-center gap-1">
                                        <i data-lucide="clock" class="w-4 h-4"></i>
                                        <span>8 anos de experiência</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <i data-lucide="phone" class="w-4 h-4"></i>
                                        <span>(+258) 84 123 4567</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <i data-lucide="instagram" class="w-4 h-4"></i>
                                        <span>@carlosmacamo_barber</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tabs Content -->
                        <div class="border border-gray-300 rounded-lg">
                            <div class="border-b border-gray-300">
                                <div class="flex">
                                    <button class="flex-1 py-4 text-center border-b-2 border-black text-black font-medium">Portfólio</button>
                                    <button class="flex-1 py-4 text-center text-gray-600 hover:text-black">Serviços</button>
                                    <button class="flex-1 py-4 text-center text-gray-600 hover:text-black">Avaliações</button>
                                </div>
                            </div>
                            
                            <div class="p-6">
                                <!-- Portfolio Content -->
                                <div class="space-y-6">
                                    <div class="aspect-[4/3] rounded-lg overflow-hidden">
                                        <img 
                                            src="${professional.image}" 
                                            alt="Portfolio image"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    <div class="grid grid-cols-4 gap-4">
                                        ${Array(4).fill().map((_, i) => `
                                            <div class="aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                                                <img 
                                                    src="${professional.image}" 
                                                    alt="Thumbnail ${i+1}"
                                                    class="w-full h-full object-cover"
                                                />
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Booking -->
                    <div class="space-y-6">
                        <!-- Quick Book Card -->
                        <div class="border border-gray-300 rounded-lg wecut-shadow p-6 sticky top-6">
                            <h3 class="text-xl font-medium text-black mb-4">Agendar Horário</h3>
                            
                            <div class="space-y-4 mb-6">
                                <div>
                                    <p class="text-sm font-medium text-black mb-2">Próximos horários</p>
                                    <div class="space-y-2">
                                        ${['Hoje, 14:30', 'Hoje, 15:00', 'Amanhã, 09:00'].map(slot => `
                                            <button class="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-black">${slot.split(', ')[0]}</span>
                                                    <span class="text-gray-600">${slot.split(', ')[1]}</span>
                                                </div>
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <button 
                                    class="w-full bg-black text-white hover:bg-gray-800 py-2 rounded wecut-button-hover"
                                    onclick="startBooking(${professional.id})"
                                >
                                    <i data-lucide="calendar" class="w-4 h-4 inline mr-2"></i>
                                    Agendar agora
                                </button>
                                
                                <button class="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded wecut-button-hover">
                                    <i data-lucide="phone" class="w-4 h-4 inline mr-2"></i>
                                    Ligar
                                </button>
                            </div>

                            <div class="mt-6 pt-6 border-t border-gray-300">
                                <div class="text-center text-sm text-gray-600">
                                    <p class="mb-1">📍 Av. Julius Nyerere, 123 - Polana, Maputo</p>
                                    <button class="text-black hover:text-gray-600">Ver no mapa</button>
                                </div>
                            </div>
                        </div>

                        <!-- Business Hours -->
                        <div class="border border-gray-300 rounded-lg p-6">
                            <h4 class="font-medium text-black mb-4">Horário de Funcionamento</h4>
                            <div class="space-y-2 text-sm">
                                ${[
                                    ['Segunda-feira', '09:00 - 18:00'],
                                    ['Terça-feira', '09:00 - 18:00'],
                                    ['Quarta-feira', '09:00 - 18:00'],
                                    ['Quinta-feira', '09:00 - 18:00'],
                                    ['Sexta-feira', '09:00 - 18:00'],
                                    ['Sábado', '08:00 - 17:00'],
                                    ['Domingo', 'Fechado']
                                ].map(([day, hours]) => `
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">${day}</span>
                                        <span class="${day === 'Domingo' ? 'text-red-600' : 'text-black'}">${hours}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function startBooking(professionalId) {
    appState.bookingProfessionalId = professionalId;
    renderView('booking-page');
}

// Adicionar funções ao escopo global
window.startBooking = startBooking;