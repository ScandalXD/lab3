import { Text, View, StyleSheet } from 'react-native';
import React, { Component } from 'react';

export default class TipOfTheDay extends Component {
  myDate: Date;
  tips: string[];

  constructor(props: any) {
    super(props);
    this.myDate = new Date();
    this.tips = [
      'Zapisuj ważne pomysły od razu.',
      'Rób krótkie przerwy podczas nauki.',
      'Zacznij dzień od najważniejszego zadania.',
    ];
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        width: '80%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
      },
      title: {
        color: '#222222',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
      },
      text: {
        color: '#333333',
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
      },
    });

    const selected: number = Math.floor(Math.random() * this.tips.length);
    const datePart = this.myDate.toLocaleDateString();
    const timePart = this.myDate.toLocaleTimeString();

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Porada dnia</Text>
        <Text style={styles.text}>
          Data i czas uruchomienia: {datePart} {timePart}
        </Text>
        <Text style={styles.text}>Tip: {this.tips[selected]}</Text>
      </View>
    );
  }
}
