# FordRetain Mobile (Expo)

App mobile React Native + Expo integrado com a API Flask do projeto.

## Executar
```bash
cd mobile
npm install
npm run start
```

Para informar a URL da API via variável de ambiente Expo:

```bash
EXPO_PUBLIC_API_BASE_URL=http://SEU_HOST:5000 npm run start
```

## Integração com API
A URL base está em `src/constants/config.js`, lendo `EXPO_PUBLIC_API_BASE_URL` com fallback para URL local de desenvolvimento.

- Android Emulator: `http://10.0.2.2:5000`
- iOS Simulator: `http://localhost:5000`
- Dispositivo físico: `http://SEU_IP_LOCAL:5000`

## Telas
- Dashboard (VIN Share + pipeline)
- Leads priorizados
- Predição de cliente (formulário integrado ao `POST /predict`)
