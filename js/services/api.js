// js/services/api.js
export async function convexRegister(userData) {
    // Simular chamada API com aprovação automática
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // SEMPRE retornar sucesso com aprovação automática
    return {
        success: true,
        user: {
            ...userData,
            id: Date.now(),
            createdAt: new Date().toISOString()
        }
    };
}

export async function convexAuth(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular autenticação
    return {
        success: true,
        user: {
            id: 1,
            name: "Usuário Teste",
            email: email,
            type: email.includes('admin') ? 'admin' : 'professional',
            createdAt: new Date().toISOString()
        }
    };
}

export async function convexUpdateSalonStatus(salonId, status) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

export async function convexRemoveSalon(salonId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

export async function convexUpdateAppointmentStatus(appointmentId, status) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}