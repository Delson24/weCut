// js/components/calendar.js
import { appState } from '../state/appState.js';

export function getCalendarComponent(professionalId) {
    const professional = appState.professionals.find(p => p.id === professionalId);
    const salon = appState.salons.find(s => s.id === professional.salonId);
    
    if (!salon || !salon.openingHours) {
        return '<p class="text-gray-600">Horários não disponíveis</p>';
    }

    return generateCalendarHTML(professionalId);
}

function generateCalendarHTML(professionalId) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    let calendarHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-black mb-2">Selecione uma data</label>
                <input type="date" id="booking-date" 
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                       min="${today.toISOString().split('T')[0]}"
                       max="${nextWeek.toISOString().split('T')[0]}">
            </div>
            
            <div id="time-slots-container" class="hidden">
                <label class="block text-sm font-medium text-black mb-2">Horários Disponíveis</label>
                <div class="grid grid-cols-3 gap-2" id="time-slots">
                    <!-- Horários serão carregados dinamicamente -->
                </div>
            </div>
        </div>
    `;
    
    return calendarHTML;
}

export function initCalendarListeners(professionalId) {
    document.addEventListener('change', function(e) {
        if (e.target.id === 'booking-date') {
            loadAvailableTimeSlots(professionalId, e.target.value);
        }
    });
}

function loadAvailableTimeSlots(professionalId, date) {
    const professional = appState.professionals.find(p => p.id === professionalId);
    const salon = appState.salons.find(s => s.id === professional.salonId);
    
    if (!salon || !salon.openingHours) return;

    // Simular horários disponíveis
    const availableSlots = generateTimeSlotsForDate(date, professionalId);
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const timeSlotsElement = document.getElementById('time-slots');
    
    if (availableSlots.length > 0) {
        timeSlotsElement.innerHTML = availableSlots.map(slot => `
            <button type="button" class="p-2 border border-gray-300 rounded hover:border-black wecut-button-hover time-slot" 
                    data-time="${slot}">
                ${slot}
            </button>
        `).join('');
        
        timeSlotsContainer.classList.remove('hidden');
    } else {
        timeSlotsContainer.classList.add('hidden');
    }
}

function generateTimeSlotsForDate(date, professionalId) {
    // Simular disponibilidade baseada em agendamentos existentes
    const existingAppointments = appState.appointments.filter(apt => 
        apt.professionalId === professionalId && apt.date === date && apt.status !== 'cancelled'
    );
    
    const bookedTimes = existingAppointments.map(apt => apt.time);
    const allSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    return allSlots.filter(slot => !bookedTimes.includes(slot));
}