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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: '#000'
    
  },
  copyButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pdfButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
