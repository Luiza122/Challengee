# FordRetain Mobile (Expo)

App mobile React Native + Expo integrado com a API Flask do projeto.

## Executar
```bash
cd mobile
npm install
npm run start
```

## Integração com API
A URL base está em `src/constants/config.js`.

- Android Emulator: `http://10.0.2.2:5000`
- iOS Simulator: `http://localhost:5000`
- Dispositivo físico: usar IP local da máquina (ex: `http://192.168.0.10:5000`)

## Telas
- Dashboard (VIN Share + pipeline)
- Leads priorizados
- Predição de cliente (formulário integrado ao `POST /predict`)
