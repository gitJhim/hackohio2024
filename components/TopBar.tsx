import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';

export default function TopBar({ showButtons = true, isDriver = false }) {
  const bgColor = isDriver ? 'bg-[#17A773]' : 'bg-[#8A2BE2]';
  const buttonBgColor = isDriver ? 'bg-[#B1ECC8]' : 'bg-[#E6E6FA]';

  return (
    <View className={`flex-column items-center h-36 ${bgColor} justify-evenly`}>
      <View className="flex-row items-center mb-2 w-11/12 mt-10">
        <View className="flex-row items-center p-2">
          <Image
            source={require("../assets/dummyProfile.png")}
            alt="profile"
            width={40}
            height={40}
          />
        </View>
        <View className={`flex-initial max-w-32 h-12 items-center p-2 rounded-sm ${buttonBgColor}`}>
          <Text>User Name</Text>
        </View>
      </View>
      
      {showButtons && (
        <View className="flex-row w-11/12 justify-evenly pb-4">
          <Pressable className={`${buttonBgColor} items-center w-20 px-4 py-2 rounded-sm`}>
            <Text>Car</Text>
          </Pressable>
          <Pressable className={`${buttonBgColor} items-center w-20 px-4 py-2 rounded-sm`}>
            <Text>Cycle</Text>
          </Pressable>
          <Pressable className={`${buttonBgColor} items-center w-20 px-4 py-2 rounded-sm`}>
            <Text>Walk</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}