// ===== Credencial Estudantil (demonstração) =====
// App genérico de credencial estudantil. Instituição fictícia, sem vínculo
// com nenhuma instituição real. Documento sem validade oficial.

const QR_SIZE = 90;
const PLACEHOLDER = 'img/photo-placeholder.png';

// Alterna o menu suspenso
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Redimensiona/comprime a foto antes de guardar, evitando estourar o
// limite do localStorage com imagens grandes em base64.
function resizeImage(file, maxDim = 480) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
        reader.onload = (e) => {
            const img = new Image();
            img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
            img.onload = () => {
                let { width, height } = img;
                if (width > height && width > maxDim) {
                    height = Math.round(height * maxDim / width);
                    width = maxDim;
                } else if (height > maxDim) {
                    width = Math.round(width * maxDim / height);
                    height = maxDim;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Desenha o QR Code (fonte única, sem duplicação).
// Tolerante a falha da biblioteca (ex.: CDN indisponível): não quebra o cartão.
function renderQrCode(cardNumber) {
    const container = document.getElementById('qrcode');
    container.innerHTML = '';
    if (typeof QRCode === 'undefined') {
        container.innerHTML = '<span style="font-size:11px;color:#333">QR indisponível</span>';
        return;
    }
    new QRCode(container, {
        text: `demo-credencial:${cardNumber}`,
        width: QR_SIZE,
        height: QR_SIZE,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Preenche a credencial e alterna a visualização
function renderCard({ name, cardNumber, course, expiryDate, image }) {
    document.getElementById('studentName').innerText = name;
    document.getElementById('studentNumber').innerText = `Matrícula: ${cardNumber}`;
    document.getElementById('studentCourse').innerText = course || '';
    document.getElementById('expiryText').innerText = `QR Code válido até ${expiryDate} 23:59`;
    document.getElementById('studentImage').src = image || PLACEHOLDER;
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('card').style.display = 'block';
    renderQrCode(cardNumber);
}

// Gera a credencial a partir do formulário
async function generateCard() {
    const name = document.getElementById('name').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const course = document.getElementById('course').value.trim();
    const file = document.getElementById('fileInput').files[0];

    if (!name || !cardNumber || !file) {
        alert('Preencha nome, matrícula e selecione uma foto.');
        return;
    }

    let image;
    try {
        image = await resizeImage(file);
    } catch (err) {
        alert(err.message);
        return;
    }

    // Validade: fim do dia atual (apenas ilustrativo)
    const expiryDate = new Date().toISOString().split('T')[0];

    try {
        localStorage.setItem('studentName', name);
        localStorage.setItem('cardNumber', cardNumber);
        localStorage.setItem('studentCourse', course);
        localStorage.setItem('expiryDate', expiryDate);
        localStorage.setItem('studentImage', image);
    } catch (err) {
        // QuotaExceededError etc. — segue exibindo mesmo sem persistir
        console.warn('Não foi possível salvar localmente:', err);
    }

    renderCard({ name, cardNumber, course, expiryDate, image });
}

// Carrega dados salvos (se houver)
function loadSavedData() {
    const name = localStorage.getItem('studentName');
    const cardNumber = localStorage.getItem('cardNumber');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!name || !cardNumber || !expiryDate) return;

    renderCard({
        name,
        cardNumber,
        course: localStorage.getItem('studentCourse'),
        expiryDate,
        image: localStorage.getItem('studentImage')
    });
}

// Limpa os dados e volta ao formulário
function resetCard() {
    ['studentName', 'cardNumber', 'studentCourse', 'expiryDate', 'studentImage']
        .forEach(k => localStorage.removeItem(k));

    document.getElementById('studentName').innerText = '';
    document.getElementById('studentNumber').innerText = '';
    document.getElementById('studentCourse').innerText = '';
    document.getElementById('expiryText').innerText = '';
    document.getElementById('studentImage').src = PLACEHOLDER;
    document.getElementById('qrcode').innerHTML = '';

    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('card').style.display = 'none';
    document.getElementById('dropdownMenu').style.display = 'none';
}

// Carrega os dados salvos assim que a página abre
window.addEventListener('load', loadSavedData);

// Registra o Service Worker (independente do carregamento dos dados)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('ServiceWorker registrado:', reg.scope))
            .catch(err => console.log('Falha ao registrar ServiceWorker:', err));
    });
}
