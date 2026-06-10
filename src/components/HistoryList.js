import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function HistoryList({ history, onClear }) {
  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Leituras</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearBtn}>Limpar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={[...history].reverse()}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.topic}>{item.topic}</Text>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearBtn: {
    color: '#E74C3C',
    fontSize: 14,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  topic: { color: '#AAA', fontSize: 13, flex: 1 },
  value: { color: '#FFF', fontSize: 13, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  time: { color: '#555', fontSize: 12, flex: 1, textAlign: 'right' },
});