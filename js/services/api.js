// js/services/api.js
import { appState } from '../state/appState.js';

// Funções simuladas de API
export async function convexAuth(email, password) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = appState.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        return {
            success: true,
            user: user
        };
    } else {
        return {
            success: false,
            error: 'E-mail ou senha incorretos'
        };
    }
}

export async function convexRegister(userData) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar se o email já existe
    const existingUser = appState.users.find(u => u.email === userData.email);
    if (existingUser) {
        return {
            success: false,
            error: 'Este e-mail já está cadastrado'
        };
    }
    
    // Criar novo usuário
    const newUser = {
        id: appState.users.length + 1,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        type: userData.type,
        createdAt: new Date().toISOString()
    };
    
    if (userData.type === 'professional') {
        // Criar salão
        const newSalon = {
            id: appState.salons.length + 1,
            name: userData.salonData.name,
            location: userData.salonData.location,
            phone: userData.salonData.phone,
            address: userData.salonData.address,
            services: userData.salonData.services,
            openingHours: userData.salonData.openingHours,
            photos: userData.salonData.photos,
            status: 'pending',
            submittedAt: userData.salonData.submittedAt
        };
        
        appState.salons.push(newSalon);
        newUser.salonId = newSalon.id;
        
        // Criar profissional associado
        const newProfessional = {
            id: appState.professionals.length + 1,
            userId: newUser.id,
            salonId: newSalon.id,
            name: userData.name,
            specialty: 'Profissional de Beleza',
            description: 'Novo profissional cadastrado',
            services: userData.salonData.services,
            rating: 0,
            reviews: 0,
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
            price: '45,00 MT',
            status: 'pending'
        };
        
        appState.professionals.push(newProfessional);
        
        // Adicionar aos registros pendentes
        appState.pendingRegistrations.push({
            id: appState.pendingRegistrations.length + 1,
            professionalId: newProfessional.id,
            name: userData.name,
            email: userData.email,
            phone: userData.salonData.phone,
            salonName: userData.salonData.name,
            location: userData.salonData.location,
            address: userData.salonData.address,
            specialty: 'Profissional de Beleza',
            services: userData.salonData.services,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        });
    }
    
    appState.users.push(newUser);
    
    return {
        success: true,
        user: newUser
    };
}

export async function convexApproveSalon(professionalId) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const professional = appState.professionals.find(p => p.id === professionalId);
    const salon = appState.salons.find(s => s.id === professional.salonId);
    const registration = appState.pendingRegistrations.find(reg => reg.professionalId === professionalId);
    
    if (professional && salon && registration) {
        professional.status = 'approved';
        salon.status = 'approved';
        salon.approvedAt = new Date().toISOString();
        registration.status = 'approved';
        
        return { success: true };
    }
    
    return { success: false, error: 'Profissional não encontrado' };
}

export async function convexUpdateAppointmentStatus(appointmentId, status) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const appointment = appState.appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = status;
        return { success: true };
    }
    
    return { success: false, error: 'Agendamento não encontrado' };
}

// Funções auxiliares para acesso global
window.convexAuth = convexAuth;
window.convexRegister = convexRegister;
window.convexApproveSalon = convexApproveSalon;
window.convexUpdateAppointmentStatus = convexUpdateAppointmentStatus;