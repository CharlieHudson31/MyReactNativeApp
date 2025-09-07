import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { savePath } from './paths_db';
import { auth } from './firebaseConfig';

export default function ViewPaths({ route, navigation }) {
  const { path, onSave } = route.params;
  const [editablePath, setEditablePath] = useState(path);
  const [notes, setNotes] = useState(""); // <-- state for notes

  console.log("Current user:", auth.currentUser);

  // Remove a bar from the path
  const removeBar = (index) => {
    setEditablePath((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublishPath = async () => {
    if (!editablePath || editablePath.length === 0) {
      Alert.alert("Cannot publish", "Path is empty!");
      return;
    }

    try {
      console.log("Attempting to save path...");
      await savePath(editablePath, notes);
      console.log("Path saved successfully!");
      Alert.alert("Success", "Path published successfully!");
      setNotes(""); // clear after save
    } catch (error) {
      console.error("Error saving path:", error);
      Alert.alert("Error", "Failed to save path.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ marginBottom: 5 }}>Edit Path:</Text>

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

      {/* Notes input */}
      <Text style={{ marginTop: 15, marginBottom: 5 }}>Notes:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5,
          marginBottom: 15,
        }}
        placeholder="Enter notes for this path..."
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button
        title="Save Changes"
        onPress={() => {
          onSave(editablePath);
        }}
      />

      <View style={{ marginTop: 15 }}>
        <Button title="Publish Path" onPress={handlePublishPath} />
      </View>
    </View>
  );
}
