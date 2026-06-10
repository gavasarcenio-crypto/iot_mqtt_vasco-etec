import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Gauges from './src/components/Gauges';
import LightControl from './src/components/LightControl';
import StatusModal from './src/components/StatusModal';
import HistoryList from './src/components/HistoryList';
import MQTTService from './src/services/mqttService';

const HISTORY_KEY = 'mqtt_history';
const MAX_HISTORY = 20;

const config = {
  host: '535db41766ec4956b6c9f3f1389296ae.s1.eu.hivemq.cloud',
  port: 8884,
  path: '/mqtt',
  user: 'vasco-etec',
  pass: 'Trabalhomenbosta123123',
  clientId: `react_native_${Math.floor(Math.random() * 1000000)}`,
};

export default function App() {
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const [isLightOn, setIsLightOn] = useState(false);
  const [connected, setConnected] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const mqtt = useRef(new MQTTService()).current;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(HISTORY_KEY);
        if (saved) setHistory(JSON.parse(saved));
      } catch (e) {
        console.log('Erro ao carregar histórico:', e);
      }
    };
    loadHistory();
  }, []);

  const saveToHistory = async (topic, value) => {
    const newEntry = {
      id: Date.now().toString(),
      topic,
      value,
      time: new Date().toLocaleTimeString('pt-BR'),
    };
    setHistory((prev) => {
      const updated = [...prev, newEntry].slice(-MAX_HISTORY);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const onConnect = () => {
    setConnected(true);
    setErrorVisible(false);
    mqtt.subscribe('casa/temp');
    mqtt.subscribe('casa/umid');
  };

  const onFailure = () => {
    setConnected(false);
    setErrorVisible(true);
  };

  const onMessageRef = useRef(null);
  onMessageRef.current = (topic, message) => {
    if (topic === 'casa/temp') {
      const value = parseFloat(message);
      if (!Number.isNaN(value)) {
        setTemp(value);
        saveToHistory('Temperatura', `${value} °C`);
      }
    }
    if (topic === 'casa/umid') {
      const value = parseFloat(message);
      if (!Number.isNaN(value)) {
        setHum(value);
        saveToHistory('Umidade', `${value} %`);
      }
    }
  };

  const connectMqtt = () => {
    mqtt.connect(config, (topic, message) => onMessageRef.current(topic, message), onConnect, onFailure);
  };

  const toggleLight = () => {
    const newState = !isLightOn;
    setIsLightOn(newState);
    mqtt.publish('casa/luz', newState ? '1' : '0');
  };

  useEffect(() => {
    connectMqtt();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>IoT MQTT - Vasco ETEC</Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[styles.statusValue, connected ? styles.online : styles.offline]}>
            {connected ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>

        <LightControl isLightOn={isLightOn} onToggle={toggleLight} />
        <Gauges temp={temp} hum={hum} />
        <HistoryList history={history} onClear={clearHistory} />
      </ScrollView>

      <StatusModal
        visible={errorVisible}
        onRetry={() => connectMqtt()}
        onLater={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  statusBox: {
    width: '100%',
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#1E1E1E',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: { color: '#AAA', fontSize: 16 },
  statusValue: { fontSize: 16, fontWeight: 'bold' },
  online: { color: '#2ECC71' },
  offline: { color: '#E74C3C' },
});