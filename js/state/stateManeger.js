// js/state/stateManager.js
export const stateManager = {
    state: {
        currentUser: null,
        adminTab: 'professionals',
        professionalTab: 'pending',
        bookingProfessionalId: null,
        users: [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@example.com',
                type: 'admin'
            },
            {
                id: 2,
                name: 'Professional User',
                email: 'pro@example.com',
                type: 'professional'
            },
            {
                id: 3,
                name: 'Client User',
                email: 'client@example.com',
                type: 'client'
            }
        ],
        professionals: [
            {
                id: 1,
                userId: 2,
                salonId: 1,
                name: 'João Silva',
                specialty: 'Cabelereiro Profissional',
                description: 'Profissional apaixonado por criar looks únicos e modernos.',
                services: ['Corte Masculino', 'Barba', 'Corte + Barba'],
                rating: 4.9,
                reviews: 128,
                image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
                price: '45,00 MT',
                location: 'Maputo',
                status: 'approved'
            }
        ],
        salons: [
            {
                id: 1,
                userId: 2,
                name: 'Barbearia Clássica',
                location: 'Maputo',
                phone: '+258 84 123 4567',
                address: 'Av. Julius Nyerere, 123 - Polana, Maputo',
                openingHours: {
                    opening: '09:00',
                    closing: '18:00'
                },
                photos: [],
                submittedAt: new Date().toISOString(),
                status: 'approved'
            }
        ],
        appointments: [
            {
                id: 1,
                code: 'WC001',
                professionalId: 1,
                clientName: 'Cliente Teste',
                service: 'Corte Masculino',
                date: new Date().toISOString(),
                time: '14:00',
                price: '45,00 MT',
                status: 'confirmed',
                location: 'Maputo',
                phone: '+258 84 123 4567',
                address: 'Av. Julius Nyerere, 123 - Polana, Maputo',
                image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
            }
        ]
    },
    
    setCurrentUser(user) {
        this.state.currentUser = user;
        this.saveState();
    },
    
    setAdminTab(tab) {
        this.state.adminTab = tab;
        this.saveState();
    },
    
    setProfessionalTab(tab) {
        this.state.professionalTab = tab;
        this.saveState();
    },
    
    restoreState() {
        try {
            const saved = localStorage.getItem('wecut-state');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
            }
        } catch (error) {
            console.error('Erro ao restaurar estado:', error);
        }
    },
    
    saveState() {
        try {
            localStorage.setItem('wecut-state', JSON.stringify(this.state));
        } catch (error) {
            console.error('Erro ao salvar estado:', error);
        }
    },
    
    addUser(userData) {
        const newUser = {
            id: Date.now(),
            ...userData
        };
        this.state.users.push(newUser);
        this.saveState();
        return newUser;
    },
    
    addSalon(salonData) {
        const newSalon = {
            id: Date.now(),
            submittedAt: new Date().toISOString(),
            status: 'approved',
            ...salonData
        };
        this.state.salons.push(newSalon);
        this.saveState();
        return newSalon;
    },
    
    addProfessional(professionalData) {
        const newProfessional = {
            id: Date.now(),
            status: 'approved',
            ...professionalData
        };
        this.state.professionals.push(newProfessional);
        this.saveState();
        return newProfessional;
    },
    
    addAppointment(appointmentData) {
        const newAppointment = {
            id: Date.now(),
            code: 'WC' + Date.now().toString().slice(-6),
            ...appointmentData
        };
        this.state.appointments.push(newAppointment);
        this.saveState();
        return newAppointment;
    },
    
    updateAppointmentStatus(appointmentId, status) {
        const appointment = this.state.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = status;
            this.saveState();
            return true;
        }
        return false;
    },
    
    getApprovedProfessionals() {
        return this.state.professionals.filter(pro => pro.status === 'approved');
    },
    
    getProfessionalAppointments(professionalId) {
        return this.state.appointments.filter(apt => apt.professionalId === professionalId);
    },
    
    removeProfessional(professionalId) {
        const index = this.state.professionals.findIndex(pro => pro.id === professionalId);
        if (index !== -1) {
            this.state.professionals.splice(index, 1);
            this.saveState();
            return true;
        }
        return false;
    },
    
    approveProfessionalRegistration(registrationId) {
        // Implementar lógica de aprovação
        return true;
    }
};