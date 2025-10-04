// js/state/appState.js
export const appState = {
    currentUser: null,
    userType: 'client',
    activeView: 'home-page',
    adminTab: 'pending-salons',
    professionalTab: 'today',

    users: [
        { 
            id: 1, 
            name: 'Cliente Teste', 
            email: 'client@example.com', 
            password: '123', 
            type: 'client', 
            createdAt: new Date().toISOString() 
        },
        { 
            id: 2, 
            name: 'Profissional Teste', 
            email: 'pro@example.com', 
            password: '123', 
            type: 'professional', 
            salonId: 1, 
            createdAt: new Date().toISOString() 
        },
        { 
            id: 3, 
            name: 'Admin Teste', 
            email: 'admin@example.com', 
            password: '123', 
            type: 'admin', 
            createdAt: new Date().toISOString() 
        }
    ],
    
    professionals: [
        { 
            id: 1, 
            userId: 2, 
            salonId: 1, 
            name: 'João Silva', 
            specialty: 'Cabelereiro', 
            description: 'Especialista em cortes masculinos e barbas.', 
            services: ['Corte Masculino', 'Barba'], 
            rating: 4.9, 
            reviews: 128, 
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
            price: '45,00 MT',
            status: 'approved'
        }
    ],
    
    salons: [
        { 
            id: 1, 
            name: 'Salão do João', 
            location: 'Maputo', 
            address: 'Av. Julius Nyerere, 123', 
            phone: '+258 84 123 4567', 
            services: ['Corte Masculino', 'Barba'], 
            openingHours: { 
                opening: '09:00', 
                closing: '18:00' 
            }, 
            photos: [], 
            status: 'approved', 
            submittedAt: new Date().toISOString(), 
            approvedAt: new Date().toISOString() 
        }
    ],
    
    appointments: [
        { 
            id: 1, 
            professionalId: 1, 
            clientName: 'Cliente Teste', 
            service: 'Corte Masculino', 
            date: new Date().toISOString(), 
            time: '14:00', 
            price: '45,00 MT', 
            status: 'confirmed', 
            code: 'WC001', 
            location: 'Maputo', 
            phone: '+258 84 123 4567', 
            address: 'Av. Julius Nyerere, 123', 
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' 
        }
    ],

    pendingRegistrations: []
};