# Credencial Estudantil (Demonstração)

PWA de demonstração que gera uma credencial estudantil fictícia a partir de um
formulário (nome, matrícula, curso e foto), com QR Code e funcionamento offline.

> ⚠️ **Projeto educacional.** A instituição ("Instituto Modelo") é fictícia.
> A credencial gerada **não tem validade oficial** e não representa nenhuma
> instituição real.

## Funcionalidades

- Formulário → credencial com foto e QR Code.
- Foto redimensionada/comprimida no cliente antes de salvar (evita estourar o `localStorage`).
- Dados persistidos localmente no navegador (`localStorage`).
- Instalável como PWA, com cache offline via Service Worker.

## Como rodar localmente

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.

## Estrutura

- `index.html` — interface (formulário + cartão)
- `styles.css` — estilos
- `script.js` — lógica (geração, persistência, QR, reset)
- `service-worker.js` — cache offline
- `manifest.json` — metadados do PWA
- `icons/`, `img/` — ícones e placeholder
