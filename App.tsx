import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, View, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as tensoflow from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";

import * as FileSystem from "expo-file-system";

import { Button } from "./components/Button";
import { styles } from "./style";
import {
  Classification,
  ClassificationProps,
} from "./components/Classification";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(
    "https://github.com/rodrigorgtic.png"
  );
  const [results, setResults] = useState<ClassificationProps[]>([]);

  async function handleSelectImage() {
    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];
        setSelectedImageUri(uri);
        await imageDectectObjection(uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function imageDectectObjection(imageUri: string) {
    setResults([]);
    await tensoflow.ready();
    const model = await mobilenet.load();

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imgBuffer = tensoflow.util.encodeString(imageBase64, "base64").buffer;
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = decodeJpeg(raw);

    const objectDetectionResult = await model.classify(imageTensor);

    setResults(objectDetectionResult);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Image
        source={{
          uri: selectedImageUri
            ? selectedImageUri
            : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
        }}
        style={styles.image}
      />

      <View style={styles.results}>
        {results.map((result) => (
          <Classification key={result.className} data={result} />
        ))}
      </View>
      {isLoading ? (
        <ActivityIndicator color="#5F1BBF" />
      ) : (
        <Button title="Select images" onPress={handleSelectImage} />
      )}
    </View>
  );
}
