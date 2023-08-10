import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, SafeAreaView, Alert, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import loadingGif from "./assets/foodloader.gif";

const API_URL = `https://expiration-date-ai.vercel.app/api`; // Using Vercel leveraged API
// const API_URL = "http://localhost:3000/api"; // If developing locally and api is in project pushed to localhost URL 

export default function App() {
  const [foodItem, setItem] = useState('');
  const [location, setLocation] = useState('Refrigerator');
  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  // const [locations, setLocation] = useState([
  //   {label: 'Refrigerator', value: 'refrigerator'},
  //   {label: 'Freezer', value: 'freezer'},
  //   {label: 'Pantry', value: 'pantry'}
  // ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const onsubmit = async() => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/generate-dates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ foodItem, location }),
        });
        const data = await response.json();
        setResult(data.result);
      } catch(e){
        Alert.alert('Failed to generate recommendations, something may be wrong with your API Key.')
      } finally {
        setLoading(false);
      }
  };
  console.log(result);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Researching...</Text>
        <Image
          source={loadingGif}
          style={styles.loading}
          resizeMode="contain"
        />
      </View>
    );
  }

  const onTryAgain = () => {
    setResult("");
  };

  if (result) {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Here are the results!
          </Text>
          <Text style={styles.result}>{result}</Text>
          <Pressable onPress={onTryAgain} style={styles.button}>
            <Text style={styles.buttonText}>Try another food item</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
    <View style={styles.container}>
      {/* Form Inputs */}
      <Text style={styles.title}>Expiration Date Generator ⏰</Text>
      <Text style={styles.label} >Food Item</Text>
      <TextInput 
        placeholder='Enter the food item you would like to store' 
        keyboardType='numeric' 
        style={styles.input}
        value={foodItem} 
        onChangeText={(text) => setItem(text || ' ')}
        />
      
      
      {/* <DropDownPicker
      open={open}
      value={value}
      items={locations}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setLocation}
    /> */}
    
    <Text style={styles.label} >Where will it be stored?</Text>
    <View style={styles.selectorContainer}>
        <Text onPress={() => setLocation("pantry")}
        style={[
          styles.selector,
          location === "pantry" && { backgroundColor: "#10a37f" }, ]}>
        Pantry </Text>
      <Text onPress={() => setLocation("refrigerator")}
        style={[
          styles.selector,
          location === "refrigerator" && { backgroundColor: "#10a37f" }, ]}>
        Refrigerator </Text>
      <Text onPress={() => setLocation("freezer")}
        style={[
          styles.selector,
          location === "freezer" && { backgroundColor: "#10a37f" }, ]}>
        Freezer </Text>
    </View>
    {/* Submit Button */}
    <Pressable onPress={onsubmit} style={styles.button}>
      <Text style={styles.buttonText}>Generate Recommendations...</Text>
    </Pressable>

      <StatusBar style="auto" />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
  },
  selectorContainer: {
    flexDirection: "row",
  },
  selector: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "gainsboro",
    margin: 5,
    padding: 16,
    borderRadius: 5,
    overflow: "hidden",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 6,
  },
  input: {
    fontSize: 16,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    
  },
  label:{
    fontSize: 16,
    color: "gray",
    marginBottom: 6,
  },
  button: {
    marginTop: "auto",
    backgroundColor: "#10a37f",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 10,
  },
  loading: {
    width: "100%",
  },
  result: {
    marginTop: -30,
  },
});
