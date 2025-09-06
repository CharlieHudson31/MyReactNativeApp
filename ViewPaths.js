import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { savePath } from './paths_db';

export default function ViewPaths({ route, navigation }) {
  const { path, onSave } = route.params;
  const [editablePath, setEditablePath] = useState(path);

  // Remove a bar from the path
  const removeBar = (index) => {
    setEditablePath((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublishPath = async () => {
    if (!editablePath || editablePath.length === 0) {
      Alert.alert("Cannot publish", "Path is empty!");
      return;
    }

    const notes = "Default Notes"; // Replace with user input if you add a notes field

    try {
      console.log("Attempting to save path...");
      await savePath(editablePath, notes);
      console.log("Path saved successfully!");
      Alert.alert("Success", "Path published successfully!");
    } catch (error) {
      console.error("Error saving path:", error);
      Alert.alert("Error", "Failed to save path.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 10 }}>Edit Path:</Text>

      <FlatList
        data={editablePath}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              borderBottomWidth: 1,
              borderColor: '#ccc',
            }}
          >
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => removeBar(index)}>
              <Text style={{ color: 'red' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button
        title="Save Changes"
        onPress={() => {
          onSave(editablePath);
          navigation.goBack();
        }}
      />

      <View style={{ position: 'absolute', top: 20, left: 10, right: 100, alignItems: 'center' }}>
        <Button
          title="Publish Path"
          onPress={handlePublishPath}
        />
      </View>
    </View>
  );
}
