import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";

// Use your laptop's LAN IP (the same you saw in the Expo QR code)
// Do NOT use localhost when testing on your phone
const SERVER_URL = "http://192.168.31.163:4000";

export default function VideoListScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      setLoading(true);
      const resp = await axios.get(`${SERVER_URL}/videos`);
      setVideos(resp.data.videos || []);
    } catch (err) {
      console.error("Fetch videos error:", err.message || err);
      alert("Error fetching videos. Check server URL.");
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => {
    const thumb =
      (item.thumbnails &&
        (item.thumbnails.medium ||
          item.thumbnails.default ||
          item.thumbnails.high)) ||
      null;

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          navigation.navigate("Player", {
            videoId: item.videoId,
            title: item.title,
          })
        }
      >
        {thumb ? (
          <Image source={{ uri: thumb.url }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.noThumb]}>
            <Text>No image</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text numberOfLines={2} style={styles.title}>
            {item.title || "Unknown title"}
          </Text>
          <Text style={styles.channel}>
            {item.channelTitle || "Unknown channel"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(i) => i.videoId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  row: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
  thumb: { width: 120, height: 68, borderRadius: 6, backgroundColor: "#ddd" },
  noThumb: { justifyContent: "center", alignItems: "center" },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: "600" },
  channel: { fontSize: 13, color: "#666", marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
