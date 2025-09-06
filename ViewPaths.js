import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';

export default function ViewPaths({ route, navigation }) {
  const { path, onSave } = route.params;
  const [editablePath, setEditablePath] = useState(path);

  // Remove a bar from the path
  const removeBar = (index) => {
    setEditablePath((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View>
      <Text>Edit Path:</Text>

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
          onSave(editablePath); // 
          navigation.goBack();
        }}
      />
    </View>
  );
}
