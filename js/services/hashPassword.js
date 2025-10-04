// js/services/hashPassword.js
// AVISO: Esta é apenas uma simulação para demonstração frontend
// Em produção, a autenticação deve ser feita no backend com salt + hash seguro

/**
 * Simula hash de senha usando Web Crypto API
 * AVISO: SHA-256 sozinho NÃO é seguro para senhas em produção
 * Em produção usar: bcrypt, Argon2 ou PBKDF2 com salt
 */
export async function hashPassword(password) {
    try {
        // Converter senha para ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        // Gerar hash SHA-256 (apenas para demonstração)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        // Converter para string hexadecimal
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    } catch (error) {
        console.error('Erro ao gerar hash:', error);
        // Fallback simples para navegadores sem crypto.subtle
        return 'fallback_hash_' + btoa(password).slice(0, 20);
    }
}

/**
 * Verifica se a senha corresponde ao hash
 * AVISO: Em produção, esta verificação deve ser feita no backend
 */
export async function verifyPassword(password, hash) {
    const newHash = await hashPassword(password);
    return newHash === hash;
}

// AVISO DE SEGURANÇA PARA DESENVOLVEDORES:
/*
⚠️  AVISOS IMPORTANTES DE SEGURANÇA:

1. NUNCA implemente autenticação real no frontend
2. NUNCA armazene senhas ou hashes no localStorage
3. NUNCA use SHA-256 sozinho para senhas em produção
4. SEMPRE use backend com:
   - Salt único por usuário
   - Funções de hash lentas (bcrypt, Argon2, PBKDF2)
   - Proteção contra timing attacks
   - Rate limiting
   - HTTPS obrigatório

Esta implementação é APENAS para demonstração frontend.
Em produção, substitua por chamadas API para backend seguro.
*/