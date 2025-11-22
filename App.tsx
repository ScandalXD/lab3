import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image, // ← добавили Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TipOfTheDay from './TipOfTheDay';

type ScreenName = 'Home' | 'Note' | 'Author';

const NOTE_STORAGE_KEY = '@note-app-text';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');
  const [note, setNote] = useState('');
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [inputHeight, setInputHeight] = useState(80);

  useEffect(() => {
    const loadNoteFromStorage = async () => {
      try {
        const savedNote = await AsyncStorage.getItem(NOTE_STORAGE_KEY);
        if (savedNote !== null) {
          setNote(savedNote);
        }
      } catch (error) {
        console.log('Błąd podczas wczytywania notatki:', error);
      } finally {
        setIsLoadingNote(false);
      }
    };

    loadNoteFromStorage();
  }, []);

  const handleSaveNote = async () => {
    try {
      await AsyncStorage.setItem(NOTE_STORAGE_KEY, note);
      Alert.alert('Sukces', 'Notatka została zapisana lokalnie.');
    } catch (error) {
      console.log('Błąd podczas zapisywania notatki:', error);
      Alert.alert('Błąd', 'Nie udało się zapisać notatki.');
    }
  };

  const handleSendEmail = () => {
    const email = 'artur.pilipenko2018@gmail.com';
    const subject = encodeURIComponent('Pytanie dotyczące aplikacji do notatek');
    const body = encodeURIComponent(
      'Cześć,\n\nPiszę w sprawie aplikacji do notatek.\n\nPozdrawiam,\n'
    );
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(url).catch((err: unknown) => {
      console.log('Błąd podczas otwierania e-maila:', err);
      Alert.alert('Błąd', 'Nie udało się otworzyć aplikacji e-mail.');
    });
  };

  const renderScreen = () => {
    if (currentScreen === 'Home') {
      return (
        <View style={styles.screenContainer}>
          <Text style={styles.appTitle}>Moje Notatki</Text>

          <View style={styles.imagePlaceholder}>
            <Image
              source={require('./assets/note.png')} 
              style={styles.image}
            />
          </View>

          <TipOfTheDay />
        </View>
      );
    }

    if (currentScreen === 'Note') {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Twoja notatka</Text>
            {isLoadingNote && (
              <Text style={styles.infoText}>Ładowanie zapisanej notatki...</Text>
            )}

            <TextInput
              style={[styles.textInput, { height: inputHeight }]}
              multiline
              placeholder="Wpisz tutaj swoją notatkę..."
              placeholderTextColor="#888"
              value={note}
              onChangeText={setNote}
              onContentSizeChange={(e) => {
                const newHeight = e.nativeEvent.contentSize.height;
                setInputHeight(Math.max(80, newHeight));
              }}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
              <Text style={styles.saveButtonText}>Zapisz notatkę</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return (
      <View style={styles.screenContainer}>
        <Text style={styles.screenTitle}>O autorze</Text>

        <Text style={styles.label}>Imię i nazwisko:</Text>
        <Text style={styles.value}>Artur Pylypenko</Text>

        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.value}>artur.pilipenko2018@gmail.com</Text>

        <Text style={styles.label}>Dane kontaktowe:</Text>
        <Text style={styles.value}>Student kierunku Informatyka</Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSendEmail}>
          <Text style={styles.saveButtonText}>Wyślij e-mail</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const NavButton = ({ label, screen }: { label: string; screen: ScreenName }) => (
    <TouchableOpacity
      style={[
        styles.navButton,
        currentScreen === screen && styles.navButtonActive,
      ]}
      onPress={() => setCurrentScreen(screen)}
    >
      <Text
        style={[
          styles.navButtonText,
          currentScreen === screen && styles.navButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>

      <View style={styles.navBar}>
        <NavButton label="Start" screen="Home" />
        <NavButton label="Notatka" screen="Note" />
        <NavButton label="O autorze" screen="Author" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#ffffff',
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
  },

  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 24,
  },

  imagePlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#ffffffff',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
  },
  imagePlaceholderText: {
    color: '#ffffffff',
    fontSize: 16,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  infoText: {
    color: '#666666',
    marginBottom: 8,
  },

  textInput: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },

  saveButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4e9af1',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  label: {
    color: '#666666',
    fontSize: 14,
    marginTop: 8,
  },
  value: {
    color: '#222222',
    fontSize: 16,
    padding: 10
  },

  navBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 35,
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navButtonActive: {
    backgroundColor: '#4e9af1',
  },
  navButtonText: {
    color: '#555555',
    fontSize: 14,
  },
  navButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
