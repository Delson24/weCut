// js/views/home.js
import { appState } from '../state/appState.js';
import { renderView } from '../main.js';

export function getHomePageContent() {
    return `
        <div class="min-h-screen bg-white">
            <!-- Hero Section -->
            <section class="bg-white py-20">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <style>
                        .typewriter h1 {
                            overflow: hidden;
                            border-right: .15em solid black;
                            white-space: nowrap;
                            margin: 0 auto;
                            letter-spacing: .15em;
                            animation: 
                                typing 3.5s steps(40, end),
                                blink-caret .75s step-end infinite;
                        }

                        @keyframes typing {
                            from { width: 0 }
                            to { width: 100% }
                        }

                        @keyframes blink-caret {
                            from, to { border-color: transparent }
                            50% { border-color: black; }
                        }
                    </style>
                    
                    <div class="typewriter mb-6">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-black inline-block">
                            Encontre o seu cabeleireiro ideal em Moçambique
                        </h1>
                    </div>
                    
                    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Descubra profissionais talentosos em Maputo, Beira, Nampula e outras cidades. 
                        Agende seu próximo corte com facilidade e segurança.
                    </p>
                    
                    <!-- Search Bar -->
                    <div class="max-w-4xl mx-auto mb-8">
                        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
                                    <select class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-black focus:ring-0">
                                        <option value="">Todos os serviços</option>
                                        <option value="corte-masculino">Corte Masculino</option>
                                        <option value="corte-feminino">Corte Feminino</option>
                                        <option value="barba">Barba</option>
                                        <option value="coloracao">Coloração</option>
                                        <option value="trancas">Tranças</option>
                                        <option value="manicure">Manicure</option>
                                        <option value="pedicure">Pedicure</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                                    <input type="text" 
                                           class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-black focus:ring-0" 
                                           placeholder="Cidade ou bairro">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Data</label>
                                    <input type="date" 
                                           class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-black focus:ring-0">
                                </div>
                                
                                <div class="flex items-end">
                                    <button onclick="renderView('search-page')" 
                                            class="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors wecut-button-hover font-medium">
                                        <i data-lucide="search" class="w-4 h-4 inline mr-2"></i>
                                        Buscar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex flex-wrap justify-center gap-3 mb-12">
                        <button class="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer transition-colors">
                            💇 Corte Masculino
                        </button>
                        <button class="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer transition-colors">
                            💇‍♀️ Corte Feminino
                        </button>
                        <button class="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer transition-colors">
                            🎨 Coloração
                        </button>
                        <button class="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer transition-colors">
                            🧔 Barba
                        </button>
                        <button class="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer transition-colors">
                            👑 Tranças
                        </button>
                    </div>
                </div>
            </section>

            <!-- Stats Section -->
            <section class="py-16 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div class="text-3xl font-bold text-black mb-2">500+</div>
                            <div class="text-gray-600">Profissionais</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold text-black mb-2">10.000+</div>
                            <div class="text-gray-600">Clientes Satisfeitos</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold text-black mb-2">15+</div>
                            <div class="text-gray-600">Cidades</div>
                        </div>
                        <div>
                            <div class="text-3xl font-bold text-black mb-2">4.8★</div>
                            <div class="text-gray-600">Avaliação Média</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Professionals -->
            <section class="py-16 bg-white">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-black mb-4">Profissionais em Destaque</h2>
                        <p class="text-gray-600 text-lg">Os melhores cabeleireiros avaliados em Moçambique</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${appState.professionals.filter(pro => pro.status === 'approved').slice(0, 3).map(professional => `
                            <div class="border border-gray-300 rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
                                <div class="aspect-[4/3] relative overflow-hidden">
                                    <img 
                                        src="${professional.image}" 
                                        alt="${professional.name}"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div class="absolute top-4 right-4">
                                        <span class="bg-white text-black border border-gray-300 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                            ${professional.price}
                                        </span>
                                    </div>
                                    <div class="absolute bottom-4 left-4">
                                        <span class="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                            Disponível
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="p-6">
                                    <h3 class="text-xl font-semibold text-black mb-2">${professional.name}</h3>
                                    <p class="text-gray-600 mb-3">${professional.specialty}</p>
                                    
                                    <div class="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                        <div class="flex items-center gap-1">
                                            <i data-lucide="star" class="w-4 h-4 fill-yellow-400 stroke-yellow-400"></i>
                                            <span class="font-medium text-black">${professional.rating}</span>
                                            <span>(${professional.reviews} avaliações)</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <i data-lucide="map-pin" class="w-4 h-4"></i>
                                            <span>${professional.location}</span>
                                        </div>
                                    </div>

                                    <div class="flex gap-2">
                                        <button 
                                            class="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg wecut-button-hover transition-colors"
                                            onclick="viewProfessional(${professional.id})"
                                        >
                                            Ver Perfil
                                        </button>
                                        <button 
                                            class="flex-1 bg-black text-white hover:bg-gray-800 py-2 rounded-lg wecut-button-hover transition-colors"
                                            onclick="startBooking(${professional.id})"
                                        >
                                            Agendar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="text-center mt-12">
                        <button onclick="renderView('search-page')" 
                                class="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors wecut-button-hover font-medium">
                            Ver Todos os Profissionais
                        </button>
                    </div>
                </div>
            </section>

            <!-- How it Works -->
            <section class="py-16 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-black mb-4">Como Funciona</h2>
                        <p class="text-gray-600 text-lg">Simples, rápido e seguro</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="text-center p-6">
                            <div class="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                                <i data-lucide="search" class="w-8 h-8 text-white"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-black mb-3">1. Busque</h3>
                            <p class="text-gray-600">Encontre cabeleireiros no seu bairro ou cidade usando nossos filtros inteligentes e avaliações reais</p>
                        </div>

                        <div class="text-center p-6">
                            <div class="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                                <i data-lucide="calendar" class="w-8 h-8 text-white"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-black mb-3">2. Agende</h3>
                            <p class="text-gray-600">Escolha o horário disponível que melhor se encaixa na sua agenda com apenas alguns cliques</p>
                        </div>

                        <div class="text-center p-6">
                            <div class="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                                <i data-lucide="scissors" class="w-8 h-8 text-white"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-black mb-3">3. Aproveite</h3>
                            <p class="text-gray-600">Tenha o corte perfeito sem preocupações e avalie sua experiência para ajudar outros clientes</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Cities Section -->
            <section class="py-16 bg-white">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-black mb-4">Disponível nas Principais Cidades</h2>
                        <p class="text-gray-600 text-lg">Encontre profissionais de qualidade em todo Moçambique</p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        ${['Maputo', 'Matola', 'Beira', 'Nampula', 'Quelimane', 'Tete', 'Xai-Xai', 'Inhambane', 'Lichinga', 'Pemba', 'Chimoio', 'Nacala'].map(city => `
                            <div class="text-center p-4 border border-gray-200 rounded-lg hover:border-black transition-colors cursor-pointer">
                                <i data-lucide="map-pin" class="w-6 h-6 text-red-500 mx-auto mb-2"></i>
                                <span class="text-black font-medium">${city}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="py-20 bg-black">
                <div class="max-w-4xl mx-auto px-4 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
                        Pronto para o seu próximo corte?
                    </h2>
                    <p class="text-gray-300 text-lg mb-8">
                        Junte-se a milhares de clientes satisfeitos e descubra os melhores profissionais de beleza perto de você.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="renderView('search-page')" 
                                class="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors wecut-button-hover font-medium">
                            Encontrar Profissionais
                        </button>
                        ${!appState.currentUser ? `
                            <button onclick="renderView('login-page')" 
                                    class="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-colors wecut-button-hover font-medium">
                                Criar Conta
                            </button>
                        ` : ''}
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function viewProfessional(professionalId) {
    appState.bookingProfessionalId = professionalId;
    renderView('professional-profile-page');
}

export function startBooking(professionalId) {
    if (!appState.currentUser) {
        alert('Por favor, faça login para agendar um serviço.');
        renderView('login-page');
        return;
    }
    appState.bookingProfessionalId = professionalId;
    renderView('booking-page');
}

// Adicionar funções ao escopo global
window.viewProfessional = viewProfessional;
window.startBooking = startBooking;