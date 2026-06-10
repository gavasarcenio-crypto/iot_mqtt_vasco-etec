import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function HistoryList({ history }) {
  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Leituras</Text>
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
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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