import React, { useState, useEffect, useLayoutEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [itemClickCounts, setItemClickCounts] = useState<number[]>([]);
  const [scannedCounts, setScannedCounts] = useState<{ [key: string]: number }>({});



  // Request camera permission
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useLayoutEffect(() => {
    console.log("Current Quantity Updated:", currentQuantity);
  }, [currentQuantity]);

  // Fetch product data from the API
  const fetchProductData = async (barcode: string) => {
    try {
      const response = await axios.get(`https://mob-scan-backend1.vercel.app/api/orders/${barcode}`);
      if (response.data) {
        setProductData([response.data]);
        setFoundFlag(false);
        setOrderNr(barcode.split('|')[0]);
        const currentCount = scannedCounts[barcode] || 0;
        setTotalQuantity(response.data.quantity || 0);
        setCurrentQuantity(currentCount + 1);
        setModalVisible(true);  // Show modal to select product
        
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      if (!foundFlag) {
        alert(`Product not found or an error occurred: ${error}`);
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
  // Inside the component
// Adjust manual barcode input
const handleManualBarcodeSearch = async () => {
  if (orderNr) {
    try {
      const response = await axios.get(`https://mob-scan-backend1.vercel.app/api/order/${orderNr}`);
      if (response.data && response.data.items) {
        setProductData(response.data.items); // Store the list of items returned for the order
        setModalVisible(true); // Show modal with item options
      } else {
        alert('No items found for this order number.');
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      alert('Failed to fetch data. Please check the order number and try again.');
    }
  } else {
    alert("Please enter the Order Number.");
  }
};

const handleItemSelection = (item: any, index: number) => {
  const totalQuantity = item.quantity || 0;
    const currentCount = itemClickCounts[index] || 0;

    if (currentCount < totalQuantity) {
      // Increment click count for the selected item
      const updatedCounts = [...itemClickCounts];
      updatedCounts[index] = currentCount + 1;
      setItemClickCounts(updatedCounts);

      // Set the current item for printing
      setCurrentItemIndex(index);
        printTableData(item, currentCount + 1, totalQuantity); 
      
      // Pass updated count for printing
    } else {
      alert(`Item ${item.itemNumber} has already been scanned ${totalQuantity} times.`);
    }
};  
  // Function to print the table data
  const printTableData = async (product: any, currentQuantity: number, totalQuantity: number) => {
    const htmlLabel = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
              margin: 0;
              width: 5in;
              height: 3in;
            }
            .container {
              border: 2px solid #333;
              padding: 15px;
              width: 100%;
              box-sizing: border-box;
            }
            .order-number {
              font-size: 18px;
              font-weight: bold;
              color: red;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .order-number .barcode-img {
              width: 55%;
              margin-left: 10px;
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
            img {
              width: 100%;
              padding-top: 10px;
            }
            .quan {
              color: black;
            }
              .boxes{
                padding-left: 20px;
              }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="order-number">
              ORDER # ${orderNr || "000000"}
              <img class="barcode-img" src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${orderNr || "000000"}|${product.itemNumber || "000000"}&scale=2&includetext" alt="Barcode">
            </div>
            <div class="item-number">ITEM # ${product.itemNumber || "X-ABCD-000000X"}</div>
            <div class="description">${product.itemDescription || "Description not available"}</div>
            <div class="small-text">${product.smallText || "Small text here"} - <span class="pick-area">${product.pickAreaName || "N/A"}</span></div>
            <div class="plant-date">Plant Date: ${product.plantDate || "Unknown"}</div>
            <div class="quantity">${currentQuantity}<span class="quan">/</span>${totalQuantity} QTY <span class="boxes">_____ / _____ BOXES</span></div>
          </div>
        </body>
      </html>
    `;
  
    await Print.printAsync({
      html: htmlLabel,
    });
  };
  
  
  // const handlePrint = () => {
  //   incrementQuantity();
  // }

  
  

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
      <View style={styles.manualEntryContainer}>
  <TextInput
    style={styles.input}
    placeholder="Enter Order Number"
    placeholderTextColor="#A9A9A9" // Light gray placeholder text
    value={orderNr}
    onChangeText={(text) => setOrderNr(text)}
  />
  <TouchableOpacity
    style={styles.searchButton}
    onPress={handleManualBarcodeSearch}
  >
    <Text style={styles.searchText}>Search by Order Number</Text>
  </TouchableOpacity>
</View>

      {/* Modal for manual barcode input */}
      <Modal
  animationType="slide"
  transparent={false}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(!modalVisible)}
>
  <View style={styles.modalView}>
    <Text style={styles.modalText}>Select an Item:</Text>

    <FlatList
  data={productData}
  keyExtractor={(item, index) => `${item.itemNumber}_${index}`} // Ensure unique key by combining itemNumber with index
  renderItem={({ item, index }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => handleItemSelection(item, index)}
    >
      <Text>Item {index + 1}</Text>
      <Text>Item Number: {item.itemNumber}</Text>
      <Text>Description: {item.itemDescription}</Text>
      <Text>Quantity: {item.quantity}</Text>
    </TouchableOpacity>
  )}
/>


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
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#808080', // Gray border
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // White background
    color: '#000000', // Black text
  },
  manualEntryButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FFA500', // Orange background for buttons
    borderRadius: 5,
    alignSelf: 'center',
  },
  manualEntryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F8F8F8', // Light background for the manual entry section
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
  buttonText: {
    color: 'white',
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
  labelModalText: {
    color: '#000000',
  }
});

