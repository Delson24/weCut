function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function openEditProfileModal() {
    openModal('edit-profile-modal');
}

function closeEditProfileModal() {
    closeModal('edit-profile-modal');
}

function openRejectModal(registrationId) {
    document.getElementById('reject-registration-id').value = registrationId;
    openModal('reject-modal');
}

function closeRejectModal() {
    closeModal('reject-modal');
    document.getElementById('reject-reason').value = '';
}