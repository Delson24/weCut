// js/views/confirmationPending.js
export function getConfirmationPendingContent() {
    return `
        <div class="min-h-screen bg-white flex items-center justify-center px-4 py-8">
            <div class="w-full max-w-md text-center">
                <div class="mb-8">
                    <i data-lucide="clock" class="w-16 h-16 text-yellow-500 mx-auto mb-4"></i>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Cadastro em Análise</h1>
                    <p class="text-gray-600">Seu cadastro como profissional está sendo revisado pela nossa equipe.</p>
                    <p class="text-gray-600 mt-2">Você receberá uma notificação por e-mail assim que for aprovado.</p>
                </div>
                
                <button onclick="renderView('home-page')" 
                        class="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg wecut-button-hover">
                    Voltar para o Início
                </button>
            </div>
        </div>
    `;
}