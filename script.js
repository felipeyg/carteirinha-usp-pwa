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
        width: 128,
        height: 128,
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
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Ocultar formulário e exibir carteirinha
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('card').style.display = 'block';
    }
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
