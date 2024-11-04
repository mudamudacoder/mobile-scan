import React, { useState, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput } from 'react-native';
import * as Print from 'expo-print';
import axios from 'axios'; // Ensure axios is installed

export default function BarcodeScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [orderNr, setOrderNr] = useState<string>('');
  const [itemNr, setItemNr] = useState<string>('');
  const [productData, setProductData] = useState<any[]>([]);
  const [foundFlag, setFoundFlag] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string>('');

  // Request camera permission
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Fetch product data from the API
  const fetchProductData = async (barcode: string) => {
    try {
      const response = await axios.get(`https://mob-scan-backend1.vercel.app/api/orders/${barcode}`);
      if (response.data) {
        setProductData([response.data]); // Store the fetched product in an array
        setModalVisible(true); // Open the modal to show the product data
        setFoundFlag(false);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      if (!foundFlag){
      alert('Product not found or an error occurred.');
      setFoundFlag(true);
      }
    }
  };

  // Handle scanned barcode data
  const handleBarCodeScanned = (data: string) => {
    if (data !== scannedData) {
    setScannedData(data);
    setFoundFlag(false);
    fetchProductData(data); // Fetch product by the scanned barcode
    }
  };

  // Handle manual barcode input
  const handleManualBarcodeSearch = () => {
    if (orderNr && itemNr) {
      const combinedBarcode = `${orderNr}|${itemNr}`;
      fetchProductData(combinedBarcode); // Fetch product by the manually entered barcode
    } else {
      alert("Please enter both Order Number and Item number.");
    }
  };

  // Function to print the table data
  const printTableData = async () => {
    const htmlLabel = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              text-align: left;
            }
            .container {
              border: 2px solid #333;
              padding: 15px;
              width: 300px;
              margin: 0 auto;
            }
            .order-number {
              font-size: 20px;
              font-weight: bold;
              color: red;
            }
            .item-number {
              font-size: 16px;
              font-weight: bold;
              color: navy;
              margin-top: 8px;
            }
            .description {
              font-size: 14px;
              color: #555;
              margin: 10px 0;
            }
            .small-text {
              font-size: 12px;
              color: gray;
              font-style: italic;
            }
            .pick-area {
              font-size: 12px;
              color: teal;
              font-weight: bold;
            }
            .quantity {
              font-size: 24px;
              font-weight: bold;
              color: green;
              text-align: center;
            }
            .plant-date {
              font-size: 12px;
              color: gray;
            }
            .barcode {
              margin-top: 15px;
              text-align: center;
            }
            .barcode img {
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${productData.map(
              (product) => `
              <div class="order-number">ORDER # ${product.orderNr || "000000"}</div>
              <div class="item-number">ITEM # ${product.itemNumber || "X-ABCD-000000X"}</div>
              <div class="description">${product.itemDescription || "Description not available"}</div>
              <div class="small-text">${product.smallText || "Small text here"}</div>
              <div class="pick-area">Pick Area: ${product.pickAreaName || "N/A"}</div>
              <div class="plant-date">Plant Date: ${product.plantDate || "Unknown"}</div>
              <div class="quantity">${product.quantity || "0"} QTY</div>
              <div class="barcode">
                <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${product.orderNr || "000000"}|${product.itemNumber || "000000"}&scale=2&includetext" alt="Barcode">
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  
    await Print.printAsync({
      html: htmlLabel,
    });
  };

  
  

  if (!permission) {
    return <View />; // Optional: Show a loading view or something else here
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Button to open manual input modal */}
      

      {/* Camera for scanning */}
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={({ data }) => handleBarCodeScanned(data)}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'codabar', 'ean8', 'qr', 'code128', 'code39', 'pdf417'],
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <TouchableOpacity
        style={styles.manualEntryButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.manualEntryText}>Manual Lookup</Text>
      </TouchableOpacity>

      {/* Modal for manual barcode input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter Order Number and Item Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Order Number"
            value={orderNr}
            onChangeText={setOrderNr}
          />
          <TextInput
            style={styles.input}
            placeholder="Item Number"
            value={itemNr}
            onChangeText={setItemNr}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleManualBarcodeSearch}
          >
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          <FlatList
            data={productData}
            keyExtractor={(item) => item.orderNr} // Assuming productCode is unique
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text>Order Number: {item.orderNr}</Text>
                <Text>Plant Date: {item.plantDate}</Text>
                <Text>Item Number: {item.itemNumber}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Description: {item.itemDescription}</Text>
                <Text>Small Text: {item.smallText}</Text>
                <Text>Pick Area: {item.pickAreaName}</Text>
              </View>
            )}
          />

          <TouchableOpacity style={styles.printButton} onPress={printTableData}>
            <Text style={styles.closeText}>Print Table</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // White background
  },
  manualEntryButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FFA500', // Orange background for buttons
    borderRadius: 5,
    alignSelf: 'center',
  },
  manualEntryText: {
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#808080', // Gray text for messages
  },
  input: {
    borderWidth: 1,
    borderColor: '#808080', // Gray border
    padding: 8,
    marginBottom: 16,
    width: '100%',
    backgroundColor: '#FFFFFF', // White background for input
    color: '#808080', // Gray text
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFFFF', // White modal background
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#808080', // Gray shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#808080', // Gray text
  },
  searchButton: {
    backgroundColor: '#FFA500', // Orange button background
    padding: 10,
    borderRadius: 5,
  },
  searchText: {
    color: '#FFFFFF', // White text
    textAlign: 'center',
  },
  tableRow: {
    marginVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0', // Light gray background for table rows
  },
  printButton: {
    backgroundColor: '#FFA500', // Orange button background
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#808080', // Gray button background for close button
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  closeText: {
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

