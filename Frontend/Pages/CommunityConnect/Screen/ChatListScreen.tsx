import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const chatData = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '10:30 AM',
    avatar: 'https://i.pravatar.cc/100?img=1',
    unread: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'The meeting is scheduled for 3 PM',
    time: 'Yesterday',
    avatar: 'https://i.pravatar.cc/100?img=2',
    unread: 0,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    lastMessage: 'Can you send me the report?',
    time: 'Wed',
    avatar: 'https://i.pravatar.cc/100?img=3',
    unread: 1,
  },
  {
    id: '4',
    name: 'Alice Williams',
    lastMessage: 'Great job on the presentation!',
    time: 'Tue',
    avatar: 'https://i.pravatar.cc/100?img=4',
    unread: 0,
  },
  {
    id: '5',
    name: 'Charlie Brown',
    lastMessage: 'Let\'s catch up soon',
    time: 'Mon',
    avatar: 'https://i.pravatar.cc/100?img=5',
    unread: 3,
  },
];

const ChatItem = ({ item }) => (
  <View style={styles.chatItem}>
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <View style={styles.chatInfo}>
      <View style={styles.nameTimeContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </View>
);

export default function ChatListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Ionicons name="search" size={24} color="#FFFFFF" />
      </View>
      <FlatList
        data={chatData}
        renderItem={({ item }) => <ChatItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContainer: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  time: {
    fontSize: 12,
    color: '#888888',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#BBBBBB',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});