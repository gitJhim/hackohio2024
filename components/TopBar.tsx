import {View, Image, Text, TextInput, Pressable} from 'react-native';

export default function TopBar({showButtons = true}) {
    
    return(
        <View className="flex-column items-center h-36 bg-[#17A773] justify-evenly">
            <View className="flex-row items-center mb-2 w-11/12 mt-10">
                <View className="flex-row items-center p-2">
                    <Image source={require("../assets/dummyProfile.png")} alt="profile" width={40} height={40}/>
                </View>
                <View className="flex-initial max-w-32 h-12 items-center p-2 rounded-sm bg-[#B1ECC8] ">
                    <Text> User Name </Text>
                </View>
            </View>

            {showButtons && (
                <View className="flex-row w-11/12 justify-evenly pb-4">
                <Pressable className="bg-[#B1ECC8] items-center w-20 px-4 py-2 rounded-sm">
                    <Text>Car</Text>
                </Pressable>
                <Pressable className="bg-[#B1ECC8] items-center w-20 px-4 py-2 rounded-sm">
                    <Text>Cycle</Text>
                </Pressable>
                <Pressable className="bg-[#B1ECC8] items-center w-20 px-4 py-2 rounded-sm">
                    <Text>Walk</Text>
                </Pressable>
                </View>
            )}

        </View>
    )
};