// js/views/search.js
import { stateManager } from '../state/stateManager.js';
import { renderView } from '../main.js';

export function getSearchPageContent() {
    const professionals = stateManager.state.professionals.filter(p => p.status === 'approved');
    
    return `
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <!-- Search Header -->
                <div class="bg-white rounded-lg p-6 mb-8 border border-gray-300">
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1 relative">
                            <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"></i>
                            <input 
                                type="text"
                                placeholder="Buscar por localização, serviço ou profissional..."
                                class="w-full pl-10 h-12 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                id="search-input"
                            />
                        </div>
                        <button class="border border-gray-300 h-12 px-6 rounded-lg hover:bg-gray-50 wecut-button-hover" onclick="showFilters()">
                            <i data-lucide="filter" class="w-4 h-4 inline mr-2"></i>
                            Filtros
                        </button>
                        <button class="bg-black text-white hover:bg-gray-800 h-12 px-8 rounded-lg wecut-button-hover" onclick="performSearch()">
                            Buscar
                        </button>
                    </div>
                </div>

                <!-- Results Header -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl text-black" id="results-count">${professionals.length} profissionais encontrados</h2>
                    <select class="w-48 border border-gray-300 rounded-lg p-2 focus:border-black focus:ring-0" id="sort-select">
                        <option>Ordenar por relevância</option>
                        <option>Melhor avaliado</option>
                        <option>Mais próximo</option>
                        <option>Menor preço</option>
                        <option>Maior preço</option>
                    </select>
                </div>

                <!-- Results Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="search-results">
                    ${professionals.map(professional => `
                        <div class="border border-gray-300 cursor-pointer transition-all hover:shadow-lg rounded-lg overflow-hidden">
                            <div class="flex">
                                <div class="w-32 h-32 relative flex-shrink-0">
                                    <img 
                                        src="${professional.image}" 
                                        alt="${professional.name}"
                                        class="w-full h-full object-cover"
                                    />
                                    <div class="absolute top-2 left-2">
                                        <span class="bg-green-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                                    </div>
                                </div>
                                
                                <div class="flex-1 p-4">
                                    <div class="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 class="text-lg text-black">${professional.name}</h3>
                                            <p class="text-gray-600 text-sm">${professional.specialty}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-lg text-black">${professional.price}</p>
                                            <p class="text-xs text-gray-500">por serviço</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center gap-4 mb-3 text-sm text-gray-600">
                                        <div class="flex items-center gap-1">
                                            <i data-lucide="star" class="w-4 h-4 fill-yellow-400 stroke-yellow-400"></i>
                                            <span>${professional.rating}</span>
                                            <span>(${professional.reviews})</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <i data-lucide="map-pin" class="w-4 h-4"></i>
                                            <span>${professional.location}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <i data-lucide="clock" class="w-4 h-4"></i>
                                            <span>Hoje, 14:30</span>
                                        </div>
                                    </div>

                                    <div class="flex gap-2">
                                        <button 
                                            class="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded wecut-button-hover"
                                            onclick="viewProfessional(${professional.id})"
                                        >
                                            Ver Perfil
                                        </button>
                                        <button 
                                            class="flex-1 bg-black text-white hover:bg-gray-800 py-2 rounded wecut-button-hover"
                                            onclick="startBooking(${professional.id})"
                                        >
                                            Agendar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

export function performSearch() {
    const searchTerm = document.getElementById('search-input').value;
    alert(`Buscando por: ${searchTerm}`);
}

export function showFilters() {
    alert('Mostrar filtros de busca');
}

export function initSearchListeners() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('[onclick="performSearch()"]');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Adicionar funções ao escopo global
window.performSearch = performSearch;
window.showFilters = showFilters;