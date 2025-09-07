import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function VideoPlayerScreen({ route }) {
  const { videoId, title } = route.params || {};
  const { width } = Dimensions.get("window");
  const height = Math.round(width * (9 / 16));

  return (
    <View style={styles.container}>
      <View style={{ width, height }}>
        <YoutubePlayer
          height={height}
          play={true}
          videoId={videoId}
          webViewProps={{ allowsInlineMediaPlayback: true }}
        />
      </View>
      <View style={styles.meta}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.id}>ID: {videoId}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  meta: { padding: 12 },
  title: { fontSize: 18, fontWeight: "600" },
  id: { fontSize: 12, color: "#666", marginTop: 6 },
});
