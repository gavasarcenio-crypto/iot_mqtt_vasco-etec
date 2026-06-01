"# iot_mqtt_vasco-etec" 

mqtthost: 535db41766ec4956b6c9f3f1389296ae.s1.eu.hivemq.cloud


mqtt porta: 8883


nome: vasco-etec


senha: Trabalhomenbosta123123


dicas do chatgpt: Consegui sim — e agora vou te explicar exatamente o que fazer a partir do 3.10, sem enrolação.


---

🚀 3.10 – O que acontece daqui pra frente

Depois do 3.8 (Gauges), o PDF entra na parte onde tudo é integrado no App principal.

👉 Ou seja: até agora você criou peças separadas
Agora você vai juntar tudo e fazer funcionar de verdade


---

🧠 IDEIA DO 3.10

O App.js vira o “cérebro” do sistema:

Ele vai:

conectar no MQTT

ouvir mensagens (temperatura/umidade)

enviar comando da luz

controlar estados da interface



---

📱 O QUE VOCÊ PRECISA FAZER (PASSO A PASSO)

✅ 1. Criar estados (useState)

Você vai controlar:

temperatura

umidade

estado da luz

status de conexão


Exemplo do que você precisa ter:

const [temp, setTemp] = useState(0);
const [hum, setHum] = useState(0);
const [isLightOn, setIsLightOn] = useState(false);
const [connected, setConnected] = useState(false);
const [errorVisible, setErrorVisible] = useState(false);


---

✅ 2. Instanciar o MQTTService

const mqtt = new MQTTService();


---

✅ 3. Conectar no broker (useEffect)

Quando o app inicia:

useEffect(() => {
  mqtt.connect(
    config,
    onMessage,
    onConnect,
    onFailure
  );
}, []);


---

✅ 4. Criar função onConnect

Quando conectar:

const onConnect = () => {
  setConnected(true);

  mqtt.subscribe("casa/temperatura");
  mqtt.subscribe("casa/umidade");
};


---

✅ 5. Criar função onMessage

Aqui entra o MAIS IMPORTANTE:

const onMessage = (topic, message) => {
  if (topic === "casa/temperatura") {
    setTemp(parseFloat(message));
  }

  if (topic === "casa/umidade") {
    setHum(parseFloat(message));
  }
};


---

✅ 6. Criar função de erro

const onFailure = () => {
  setErrorVisible(true);
};


---

✅ 7. Controle da luz

Quando clicar no botão:

const toggleLight = () => {
  const newState = !isLightOn;
  setIsLightOn(newState);

  mqtt.publish("casa/luz", newState ? "1" : "0");
};


---

✅ 8. Montar a interface (render)

Você vai usar os componentes que já criou:

<LightControl 
  isLightOn={isLightOn} 
  onToggle={toggleLight} 
/>

<Gauges 
  temp={temp} 
  hum={hum} 
/>

<StatusModal 
  visible={errorVisible}
  onRetry={() => mqtt.connect(config, onMessage, onConnect, onFailure)}
  onLater={() => setErrorVisible(false)}
/>


---

🔥 RESUMO DO 3.10 (bem direto)

👉 Você conecta tudo:

MQTTService → comunicação

LightControl → envia comando

Gauges → recebe dados

StatusModal → trata erro


📌 Resultado:

> App controla LED + mostra temperatura/umidade em tempo real via MQTT




---

⚠️ SE DER ERRO (muito comum)

Fica esperto nesses pontos:

❌ não conectou → problema no host/porta/user/pass

❌ não recebe dados → tópico errado

❌ app conecta mas não responde → ESP32 não está publicando
