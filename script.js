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
    const name = document.getElementById('name').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const fileInput = document.getElementById('fileInput').files[0];

    if (!name || !cardNumber || !fileInput) {
        alert('Por favor, preencha todos os campos e selecione uma imagem.');
        return;
    }

    const today = new Date();
    const expiryDate = today.toISOString().split('T')[0];

    localStorage.setItem('studentName', name);
    localStorage.setItem('cardNumber', cardNumber);
    localStorage.setItem('expiryDate', expiryDate);

    const reader = new FileReader();
    reader.onload = function (e) {
        localStorage.setItem('studentImage', e.target.result);
        document.getElementById('studentImage').src = e.target.result;
    };
    reader.readAsDataURL(fileInput);

    document.getElementById('studentName').innerText = name;
    document.getElementById('studentNumber').innerText = cardNumber;
    document.getElementById('expiryText').innerText = `Código QR expira em ${expiryDate} 23:59`;

    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';
    new QRCode(qrcodeContainer, {
        text: `https://meu-link-para-credencial.com/${cardNumber}`,
        width: 80,
        height: 80,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('card').style.display = 'block';
}

// Função para carregar os dados salvos
function loadSavedData() {
    const name = localStorage.getItem('studentName');
    const cardNumber = localStorage.getItem('cardNumber');
    const expiryDate = localStorage.getItem('expiryDate');
    const studentImage = localStorage.getItem('studentImage');

    if (name && cardNumber && expiryDate && studentImage) {
        document.getElementById('studentName').innerText = name;
        document.getElementById('studentNumber').innerText = cardNumber;
        document.getElementById('expiryText').innerText = `Código QR expira em ${expiryDate} 23:59`;
        document.getElementById('studentImage').src = studentImage;

        const qrcodeContainer = document.getElementById('qrcode');
        qrcodeContainer.innerHTML = '';
        new QRCode(qrcodeContainer, {
            text: `https://meu-link-para-credencial.com/${cardNumber}`,
            width: 80,
            height: 80,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('card').style.display = 'block';
    }
}

// Função para resetar a carteirinha e começar de novo
function resetCard() {
    localStorage.removeItem('studentName');
    localStorage.removeItem('cardNumber');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('studentImage');

    document.getElementById('studentName').innerText = '';
    document.getElementById('studentNumber').innerText = '';
    document.getElementById('expiryText').innerText = '';
    document.getElementById('studentImage').src = 'photo-placeholder.png';
    document.getElementById('qrcode').innerHTML = '';

    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('card').style.display = 'none';

    document.getElementById('dropdownMenu').style.display = 'none';
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js').then(function (registration) {
            console.log('ServiceWorker registrado com sucesso: ', registration);
        }).catch(function (error) {
            console.log('Falha ao registrar o ServiceWorker: ', error);
        });

        loadSavedData();
    });
}
