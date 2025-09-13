import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking
} from 'react-native';
import { router } from 'expo-router';

export default function AboutPage() {
  const handleGoBack = () => {
    router.back();
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.appTitle}>AI-Powered Pokemon Chatbot</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is this app?</Text>
          <Text style={styles.description}>
            This is an intelligent chatbot application that combines the power of AI with comprehensive Pokemon knowledge. 
            Chat with our AI assistant to get detailed information about Pokemon, analyze teams, search for specific types, 
            and discover random Pokemon facts!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>🔍 Pokemon Lookup - Get detailed info about any Pokemon</Text>
            <Text style={styles.feature}>🔎 Smart Search - Find Pokemon by partial name matches</Text>
            <Text style={styles.feature}>⚡ Type-based Search - Discover Pokemon by their types</Text>
            <Text style={styles.feature}>🎲 Random Discovery - Explore random Pokemon</Text>
            <Text style={styles.feature}>📊 Team Analysis - Analyze your Pokemon team composition</Text>
            <Text style={styles.feature}>💬 Natural Conversation - Chat naturally with AI</Text>
            <Text style={styles.feature}>💾 Message History - Your conversations are saved</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <View style={styles.techList}>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>AI Model:</Text>
              <Text style={styles.techValue}>Claude 3.5 Sonnet by Anthropic</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Pokemon Data:</Text>
              <Text style={styles.techValue}>PokeAPI v2</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Framework:</Text>
              <Text style={styles.techValue}>React Native with Expo</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Language:</Text>
              <Text style={styles.techValue}>TypeScript</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <Text style={styles.description}>
            Simply start typing your questions about Pokemon! You can ask things like:
          </Text>
          <View style={styles.exampleList}>
            <Text style={styles.example}>• "Tell me about Pikachu"</Text>
            <Text style={styles.example}>• "Show me fire-type Pokemon"</Text>
            <Text style={styles.example}>• "Analyze my team: Charizard, Blastoise, Venusaur"</Text>
            <Text style={styles.example}>• "Find a random Pokemon"</Text>
            <Text style={styles.example}>• "Search for Pokemon with 'pika' in the name"</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sources</Text>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => handleOpenLink('https://pokeapi.co/')}
          >
            <Text style={styles.linkText}>PokeAPI - The RESTful Pokemon API</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => handleOpenLink('https://www.anthropic.com/')}
          >
            <Text style={styles.linkText}>Anthropic - AI Safety Company</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          <Text style={styles.description}>
            Your chat messages are stored locally on your device for convenience. 
            No personal data is shared with external services beyond what's necessary 
            for AI responses and Pokemon data retrieval.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for Pokemon trainers everywhere
          </Text>
          <Text style={styles.copyright}>
            © 2024 AI Pokemon Chatbot. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  backButton: {
    marginRight: 15
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  content: {
    padding: 20
  },
  section: {
    marginBottom: 25
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5
  },
  version: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24
  },
  featureList: {
    marginTop: 5
  },
  feature: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22
  },
  techList: {
    marginTop: 5
  },
  techItem: {
    flexDirection: 'row',
    marginBottom: 8
  },
  techLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 120
  },
  techValue: {
    fontSize: 16,
    color: '#555',
    flex: 1
  },
  exampleList: {
    marginTop: 10,
    paddingLeft: 10
  },
  example: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
    fontStyle: 'italic'
  },
  linkButton: {
    marginBottom: 10
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline'
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5
  },
  copyright: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  }
});