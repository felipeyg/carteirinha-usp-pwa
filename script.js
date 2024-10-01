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
    // Capturar valores dos campos do formulário
    const name = document.getElementById('name').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const fileInput = document.getElementById('fileInput').files[0];

    // Verificar se todos os campos estão preenchidos
    if (!name || !cardNumber || !fileInput) {
        alert('Por favor, preencha todos os campos e selecione uma imagem.');
        return;
    }

    // Definir a data de expiração para o final do dia de hoje
    const today = new Date();
    const expiryDate = today.toISOString().split('T')[0]; // Data em formato YYYY-MM-DD

    // Salvar os dados no Local Storage
    localStorage.setItem('studentName', name);
    localStorage.setItem('cardNumber', cardNumber);
    localStorage.setItem('expiryDate', expiryDate);

    // Salvar a imagem no Local Storage (conversão para base64)
    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem('studentImage', e.target.result);
        document.getElementById('studentImage').src = e.target.result;
    };
    reader.readAsDataURL(fileInput);

    // Configurar os valores na carteirinha
    document.getElementById('studentName').innerText = name;
    document.getElementById('studentNumber').innerText = cardNumber;
    document.getElementById('expiryText').innerText = `Código QR expira em ${expiryDate} 23:59`;

    // Gerar o QR Code
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = ''; // Limpar QR Code anterior
    new QRCode(qrcodeContainer, {
        text: `https://meu-link-para-credencial.com/${cardNumber}`,
        width: 80,  // Largura do QR Code
        height: 80, // Altura do QR Code
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Ocultar formulário e exibir carteirinha
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('card').style.display = 'block';
}

// Função para carregar os dados salvos
function loadSavedData() {
    const name = localStorage.getItem('studentName');
    const cardNumber = localStorage.getItem('cardNumber');
    const expiryDate = localStorage.getItem('expiryDate');
    const studentImage = localStorage.getItem('studentImage');

    // Se os dados existirem, gerar automaticamente a carteirinha
    if (name && cardNumber && expiryDate && studentImage) {
        document.getElementById('studentName').innerText = name;
        document.getElementById('studentNumber').innerText = cardNumber;
        document.getElementById('expiryText').innerText = `Código QR expira em ${expiryDate} 23:59`;
        document.getElementById('studentImage').src = studentImage;

        // Gerar o QR Code
        const qrcodeContainer = document.getElementById('qrcode');
        qrcodeContainer.innerHTML = ''; // Limpar QR Code anterior
        new QRCode(qrcodeContainer, {
            text: `https://meu-link-para-credencial.com/${cardNumber}`,
            width: 80,
            height: 80,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Ocultar formulário e exibir carteirinha
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('card').style.display = 'block';
    }
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
