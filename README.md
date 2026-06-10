# IoT MQTT - Smart Home Dashboard

Aplicativo mobile desenvolvido em React Native com Expo para monitoramento e controle de dispositivos IoT via protocolo MQTT.

## Sobre o Projeto

Este projeto foi desenvolvido como atividade prática da disciplina de **Desenvolvimento Mobile** na ETEC Bento Quirino. O objetivo é criar um dashboard que se comunica em tempo real com um broker MQTT na nuvem (HiveMQ Cloud), exibindo dados de sensores e permitindo o controle remoto de dispositivos.

## Funcionalidades

- Conexão em tempo real com broker MQTT via WebSocket seguro (WSS)
- Monitoramento de temperatura e umidade com medidores circulares
- Controle remoto de LED (ligar/desligar)
- **Persistência local do histórico de leituras com AsyncStorage**
- Feedback visual de status de conexão
- Modal de erro com opção de reconexão

## Tecnologias Utilizadas

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [react_native_mqtt](https://www.npmjs.com/package/react_native_mqtt) — comunicação MQTT via Paho
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) — persistência local
- [react-native-circular-progress-indicator](https://www.npmjs.com/package/react-native-circular-progress-indicator) — gauges circulares
- [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/) — broker MQTT na nuvem

## Estrutura de Arquivos

```
MyIoTProject/
├── src/
│   ├── services/
│   │   └── mqttService.js       # Lógica de conexão MQTT
│   └── components/
│       ├── Gauges.js            # Medidores de temperatura e umidade
│       ├── HistoryList.js       # Histórico persistido de leituras
│       ├── LightControl.js      # Controle do LED
│       └── StatusModal.js       # Modal de erro de conexão
├── .env                         # Credenciais reais (NÃO enviar ao GitHub)
├── .env.example                 # Modelo de variáveis de ambiente
├── .gitignore
└── App.js                       # Tela principal e lógica de estado
```

## Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado
- Expo CLI (`npm install -g expo-cli`)
- App **Expo Go** no celular

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do HiveMQ
```

### Configurar o `.env`

```
MQTT_HOST=seu_cluster.s1.eu.hivemq.cloud
MQTT_PORT=8884
MQTT_USER=seu_usuario
MQTT_PASS=sua_senha
MQTT_PATH=/mqtt
```

### Executar

```bash
npx expo start
```

Escaneie o QR code com o app Expo Go no celular.

## Tópicos MQTT Utilizados

| Tópico | Direção | Descrição |
|---|---|---|
| `casa/temp` | Subscribe | Leitura de temperatura (°C) |
| `casa/umid` | Subscribe | Leitura de umidade (%) |
| `casa/luz` | Publish | Controle do LED (`1` = ligar, `0` = desligar) |

## Solução de Persistência

Os dados recebidos via MQTT são salvos localmente no dispositivo usando **AsyncStorage**. A cada nova mensagem recebida, uma entrada é adicionada ao histórico com tópico, valor e horário. O histórico mantém as últimas 20 leituras e persiste mesmo após fechar o aplicativo. O usuário pode limpar o histórico a qualquer momento pelo botão "Limpar" na interface.

## Variáveis de Ambiente

O projeto utiliza `react-native-dotenv` para proteger as credenciais do broker. O arquivo `.env` está listado no `.gitignore` e **nunca deve ser enviado ao repositório**. Use o `.env.example` como referência.
