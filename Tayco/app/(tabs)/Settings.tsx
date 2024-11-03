import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';


const Settings: React.FC = () => {
  const [dbUrl, setDbUrl] = useState('https://mob-scan-backend.vercel.app/');

  // Function to copy the database URL to clipboard
  const copyDbUrlToClipboard = () => {
    Clipboard.setString(dbUrl);
    Alert.alert('Copied!', 'Backend URL copied to clipboard.');
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Database URL Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Backend URL</Text>
        <TextInput
          style={styles.input}
          value={dbUrl}
          onChangeText={setDbUrl}
          placeholder="Enter your Backend URL"
          editable={false}
          
        />
        <TouchableOpacity style={styles.copyButton} onPress={copyDbUrlToClipboard}>
          <Text style={styles.buttonText}>Copy URL</Text>
        </TouchableOpacity>
      </View>

      

      
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: 'gray',
  },
  copyButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pdfButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

