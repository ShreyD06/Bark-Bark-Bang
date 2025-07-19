import React, { useEffect, useState } from "react";
import { databases } from './lib/appwrite';
import { useUser } from './hooks/useUser';
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";


const UserJobs = () => {

    const DATABASE_ID = 'bbbapp';
    const COLLECTION_ID = 'user_jobs';
    const [jobs, setJobs] = useState([]);

    const { user } = useUser();


    const getUserJobs = async () => {
        const jbs = [];
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        response.documents.forEach((job) => {
            if (job['UserId'] == user.$id) {
                jbs.push(job);
            }
        });

        setJobs(jbs);
    }

    useEffect(() => {
        getUserJobs();
    })

    const handleAccept = async (job) => {
        //  implement a machine learning model to detect whether the inputted image is a dog or not
        const response = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, job.$id);
        getUserJobs();
        
    }

    const renderCard = ({ item }) => (
          <View style={styles.card}>

            {Object.keys(item).slice(0, 5).map((header, index) => (
              <View key={index} style={styles.cardRow}>
                <Text style={styles.cardLabel}>{header}:</Text>
                <Text style={styles.cardValue}>{item[header]}</Text>
              </View>
            ))}
    
            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => handleAccept(item)}
              >
                <Text style={styles.acceptButtonText}>Completed</Text>
              </TouchableOpacity>
            </View>
    
          </View>
    );
    

    return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
    
            <Text style={styles.headerTitle}>Your Walks</Text>
            <Text style={styles.headerSubtitle}>Here are the walks you have accepted.</Text>
        
        <FlatList
            data={jobs}
            renderItem={renderCard}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    header: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#6c757d',
    },
    listContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: '#e9ecef',
    },
    cardRow: {
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'flex-start',
    },
    cardLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#495057',
      minWidth: 80,
      marginRight: 12,
    },
    cardValue: {
      fontSize: 14,
      color: '#212529',
      flex: 1,
      lineHeight: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#6c757d',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: 64,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#495057',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: '#6c757d',
      textAlign: 'center',
      lineHeight: 20,
    },
    cardActions: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#e9ecef',
      alignItems: 'flex-end',
    },
    acceptButton: {
      backgroundColor: '#28a745',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    logoutButton: {
      backgroundColor: '#FF0000',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    acceptButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingVertical: 12,
      gap: 12,
    },
    authButton: {
      backgroundColor: '#007bff',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 6,
      marginHorizontal: 6,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    logoutButton: {
      backgroundColor: '#dc3545',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 6,
      marginHorizontal: 6,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    authButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    }
  });

export default UserJobs;