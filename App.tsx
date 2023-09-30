import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, View, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Button } from "./components/Button";
import { styles } from "./style";

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState(
    "https://github.com/rodrigorgtic.png"
  );

  const [isLoading, setIsLoading] = useState(false);

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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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

      <View style={styles.results}></View>
      {isLoading ? (
        <ActivityIndicator color="#5F1BBF" />
      ) : (
        <Button title="Select images" onPress={handleSelectImage} />
      )}
    </View>
  );
}
