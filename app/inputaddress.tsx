import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Building2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "../state/stores/userStore";
import { setFoodbankAddress } from "../utils/db/auth";
import { GOOGLE_MAPS_API_KEY } from "@env";
import Geocoder from "react-native-geocoding";

const FoodbankAddressForm = () => {
  Geocoder.init(`${GOOGLE_MAPS_API_KEY}`);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [formData, setFormData] = useState({
    organizationName: "",
    streetAddress: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    organizationName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
      isValid = false;
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Valid ZIP code is required";
      isValid = false;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Valid phone number is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatAddress = () => {
    const {
      organizationName,
      streetAddress,
      unit,
      city,
      state,
      zipCode,
      phone,
    } = formData;

    const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    const addressParts = [
      organizationName,
      streetAddress,
      unit && `Unit ${unit}`,
      `${city}, ${state} ${zipCode}`,
      formattedPhone,
    ].filter(Boolean);

    return addressParts.join("\n");
  };

  const handleSubmit = async () => {
    if (!user || !user.id) return;
    const coords = await Geocoder.from(formatAddress());
    if (validateForm()) {
      try {
        const lat = coords.results[0].geometry.location.lat;
        const lng = coords.results[0].geometry.location.lng;
        await setFoodbankAddress(user.id, lat, lng, formData.organizationName);
        router.navigate("/home");
      } catch (error) {
        console.error("Error saving lat lng:", error);
      }
    }
  };

  const isFormFilled = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-10">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-purple-100 p-4 rounded-full mb-4">
            <Building2 size={32} color="#8B5CF6" />
          </View>
          <Text className="text-3xl font-bold text-gray-800 text-center">
            Food Bank Details
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Enter your organization's information
          </Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-6">
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
              Organization Name
              <Text className="text-red-500"> *</Text>
            </Text>
            <TextInput
              value={formData.organizationName}
              onChangeText={(text) =>
                setFormData({ ...formData, organizationName: text })
              }
              placeholder="Enter organization name"
              className="border-2 border-gray-200 rounded-xl p-3.5 text-gray-800"
            />
            {errors.organizationName && (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                {errors.organizationName}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
              Street Address
              <Text className="text-red-500"> *</Text>
            </Text>
            <TextInput
              value={formData.streetAddress}
              onChangeText={(text) =>
                setFormData({ ...formData, streetAddress: text })
              }
              placeholder="Enter street address"
              className="border-2 border-gray-200 rounded-xl p-3.5 text-gray-800"
            />
            {errors.streetAddress && (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                {errors.streetAddress}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
              Unit/Suite/Floor (Optional)
            </Text>
            <TextInput
              value={formData.unit}
              onChangeText={(text) => setFormData({ ...formData, unit: text })}
              placeholder="Enter unit number"
              className="border-2 border-gray-200 rounded-xl p-3.5 text-gray-800"
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                City
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                placeholder="City"
                className="border-2 border-gray-200 rounded-xl p-3.5 text-gray-800"
              />
              {errors.city && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.city}
                </Text>
              )}
            </View>

            <View className="w-24">
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                State
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                value={formData.state}
                onChangeText={(text) =>
                  setFormData({ ...formData, state: text })
                }
                placeholder="State"
                maxLength={2}
                autoCapitalize="characters"
                className="border-2 border-gray-200 rounded-xl p-3.5 text-gray-800"
              />
              {errors.state && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.state}
                </Text>
              )}
            </View>
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
              ZIP Code
              <Text className="text-red-500"> *</Text>
            </Text>
            <TextInput
              value={formData.zipCode}
              onChangeText={(text) =>
                setFormData({ ...formData, zipCode: text })
              }
              placeholder="Enter ZIP code"
              keyboardType="numeric"
              maxLength={5}
              className="border-2 border-gray-200 rounded-xl p-3.5 text-gray-800"
            />
            {errors.zipCode && (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                {errors.zipCode}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
              Phone Number
              <Text className="text-red-500"> *</Text>
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              className="border-2 border-gray-200 rounded-xl p-3.5 text-gray-800"
            />
            {errors.phone && (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                {errors.phone}
              </Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View className="mt-8">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormFilled}
            className={`
              py-4 rounded-xl
              ${isFormFilled ? "bg-purple-500" : "bg-gray-200"}
            `}
          >
            <Text
              className={`
                text-center font-semibold text-base
                ${isFormFilled ? "text-white" : "text-gray-400"}
              `}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default FoodbankAddressForm;
