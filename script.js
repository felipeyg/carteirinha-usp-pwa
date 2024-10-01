// Função para alternar a exibição do menu suspenso
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// Função para gerar a carteirinha
function generateCard() {
    // ... (código existente para gerar a carteirinha)
}

// Função para carregar os dados salvos
function loadSavedData() {
    // ... (código existente para carregar os dados salvos)
}

// Função para resetar a carteirinha e começar de novo
function resetCard() {
    // Limpar os dados salvos no Local Storage
    localStorage.removeItem('studentName');
    localStorage.removeItem('cardNumber');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('studentImage');

    // Redefinir os campos da carteirinha
    document.getElementById('studentName').innerText = '';
    document.getElementById('studentNumber').innerText = '';
    document.getElementById('expiryText').innerText = '';
    document.getElementById('studentImage').src = 'photo-placeholder.png';
    document.getElementById('qrcode').innerHTML = '';

    // Ocultar a carteirinha e exibir o formulário novamente
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('card').style.display = 'none';
    
    // Fechar o menu
    document.getElementById('dropdownMenu').style.display = 'none';
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('ServiceWorker registrado com sucesso: ', registration);
        }).catch(function(error) {
            console.log('Falha ao registrar o ServiceWorker: ', error);
        });

        // Carregar dados salvos do Local Storage
        loadSavedData();
    });
}
