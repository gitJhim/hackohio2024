import {View, Image, Text, TextInput, Pressable} from 'react-native';

export default function TopBar() {
    
    return(
        <View className="flex-row items-center h-36 bg-[#17A773] justify-evenly">
            <View className="flex-row items-center justify-evenly w-11/12 mt-10">
                <View className="flex-row items-center mx-auto">
                    <Image source={require("../assets/dummyProfile.png")} alt="profile" width={40} height={40}/>
                </View>
                <View className="flex-row w-40 max-w-40 h-12 items-center p-2 rounded-full bg-[#B1ECC8] ">
                    <Text> User Name </Text>
                </View>
                
                <View className="flex-row p-2 h-12 w-40 rounded-full items-center bg-[#B1ECC8]">
                    <Text className="font-bold items-center text-lg"> Level: null</Text>
                </View>
            </View>
        </View>
    )
};