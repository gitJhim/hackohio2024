import React, { useState } from 'react';
import { ScrollView, Text, View, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useUserStore } from '../state/stores/userStore';
import { Plus, Trash2, Edit2 } from 'lucide-react-native';

interface RequestedItem {
  id: string;
  name: string;
  current: number;
  required: number;
}

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const [newItemName, setNewItemName] = useState('');
  const [newItemRequired, setNewItemRequired] = useState('');
  const [requestedItems, setRequestedItems] = useState<RequestedItem[]>([
    { id: '1', name: 'Canned Soup', current: 50, required: 100 },
    { id: '2', name: 'Rice', current: 30, required: 50 },
    { id: '3', name: 'Beans', current: 25, required: 75 },
  ]);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const getHeaderColor = () => {
    switch (user?.type) {
      case 'driver':
        return '#17A773';
      case 'foodbank':
        return '#8B5CF6';
      case 'donor':
        return '#EF4444';
      default:
        return '#808080';
    }
  };

  const addItem = () => {
    if (newItemName.trim() && newItemRequired.trim()) {
      const newItem: RequestedItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        current: 0,
        required: parseInt(newItemRequired.trim(), 10),
      };
      setRequestedItems([...requestedItems, newItem]);
      setNewItemName('');
      setNewItemRequired('');
    }
  };

  const deleteItem = (id: string) => {
    setRequestedItems(requestedItems.filter(item => item.id !== id));
  };

  const startEditing = (id: string) => {
    setEditingItem(id);
  };

  const saveEdit = (id: string, current: string, required: string) => {
    setRequestedItems(requestedItems.map(item => 
      item.id === id ? { ...item, current: parseInt(current, 10), required: parseInt(required, 10) } : item
    ));
    setEditingItem(null);
  };

  const renderRequestedItem = ({ item }: { item: RequestedItem }) => (
    <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-bold text-purple-600">{item.name}</Text>
      {editingItem === item.id ? (
        <View className="flex-row items-center mt-2">
          <TextInput
            className="w-12 bg-gray-100 text-purple-800 p-1 mr-1 text-center rounded"
            defaultValue={item.current.toString()}
            keyboardType="numeric"
            onChangeText={(text) => item.current = parseInt(text, 10)}
          />
          <Text className="text-purple-800">/</Text>
          <TextInput
            className="w-12 bg-gray-100 text-purple-800 p-1 ml-1 mr-2 text-center rounded"
            defaultValue={item.required.toString()}
            keyboardType="numeric"
            onChangeText={(text) => item.required = parseInt(text, 10)}
          />
          <TouchableOpacity className="ml-auto m-3" onPress={() => saveEdit(item.id, item.current.toString(), item.required.toString())}>
            <Text className="text-purple-600 font-bold">Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-sm text-gray-700">Quantity: {item.current}/{item.required}</Text>
          <View className="flex-row">
            <TouchableOpacity onPress={() => startEditing(item.id)} className="mr-2">
              <Edit2 color="#8B5CF6" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Trash2 color="#8B5CF6" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View
          className="h-56 items-center justify-end"
          style={{ backgroundColor: getHeaderColor() }}
        />
        <View className="flex-1 bg-gray-100 px-4 pt-4">
          <View className="items-center mb-6">
            <Image
              source={{
                uri: user?.avatar_url || 'https://via.placeholder.com/120',
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: 'white',
                marginTop: -60,
              }}
              className="bg-white"
            />
            <Text className="text-xl font-bold mt-4 text-gray-800">
              @{user?.name || 'Username'}
            </Text>
            <Text className="text-lg mt-2 capitalize text-gray-600">
              {user?.type || 'User'}
            </Text>
          </View>

          {user?.type === 'foodbank' && (
            <View>
              <Text className="text-2xl font-bold mb-4 text-purple-700">
                Requested Items
              </Text>
              <FlatList
                data={requestedItems}
                renderItem={renderRequestedItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />

              <View className="mt-4 mb-4 p-4 bg-white rounded-lg shadow-md">
                <Text className="text-lg font-bold text-purple-600 mb-2">Add New Item</Text>
                <View className="flex-row mb-2">
                  <TextInput
                    className="flex-1 bg-gray-100 text-purple-800 p-2 rounded-l-md"
                    placeholder="Item name"
                    value={newItemName}
                    onChangeText={setNewItemName}
                  />
                  <TextInput
                    className="w-20 bg-gray-100 text-purple-800 p-2 text-center"
                    placeholder="Required"
                    value={newItemRequired}
                    onChangeText={setNewItemRequired}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    className="bg-purple-600 rounded-r-md p-2 justify-center items-center"
                    onPress={addItem}
                  >
                    <Plus color="white" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {user?.type === 'donor' && (
            <View className="mt-4">
              <Text className="text-2xl font-bold mb-4 text-red-700">Donor Dashboard</Text>
              {/* Add donor-specific content here */}
            </View>
          )}

          {user?.type === 'driver' && (
            <View className="mt-4">
              <Text className="text-2xl font-bold mb-4 text-green-700">Driver Dashboard</Text>
              {/* Add driver-specific content here */}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;