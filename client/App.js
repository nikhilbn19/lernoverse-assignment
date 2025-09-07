import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoListScreen from "./screens/VideoListScreen";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen
          name="List"
          component={VideoListScreen}
          options={{ title: "Videos" }}
        />
        <Stack.Screen
          name="Player"
          component={VideoPlayerScreen}
          options={{ title: "Player" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
