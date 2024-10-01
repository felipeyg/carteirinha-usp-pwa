// Função para gerar a carteirinha
function generateCard() {
    // Capturar valores dos campos do formulário
    const name = document.getElementById('name').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const faculty = document.getElementById('faculty').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const fileInput = document.getElementById('fileInput').files[0];

    // Verificar se todos os campos estão preenchidos
    if (!name || !cardNumber || !faculty || !expiryDate || !fileInput) {
        alert('Por favor, preencha todos os campos e selecione uma imagem.');
        return;
    }

    // Configurar os valores na carteirinha
    document.getElementById('studentName').innerText = name;
    document.getElementById('studentNumber').innerText = cardNumber;
    document.getElementById('studentFaculty').innerText = faculty;
    document.getElementById('expiryText').innerText = `Código QR expira em ${expiryDate} 23:59`;

    // Exibir a imagem do aluno
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('studentImage').src = e.target.result;
    };
    reader.readAsDataURL(fileInput);

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

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('ServiceWorker registrado com sucesso: ', registration);
        }).catch(function(error) {
            console.log('Falha ao registrar o ServiceWorker: ', error);
        });
    });
}
