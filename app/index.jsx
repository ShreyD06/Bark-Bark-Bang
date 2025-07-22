import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { UserProvider } from './contexts/UserContext';
import { databases } from './lib/appwrite';
import { useUser } from './hooks/useUser';
import { ID } from 'react-native-appwrite';
import UserOnly from './UserOnly';
import { router } from 'expo-router';


// import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-async-storage/async-storage';

// const data = fetch('https://sheets-backend-9odyd67uw-shrey-desais-projects-d8dd13e0.vercel.app/api/sheet-data').then((response) => response.json());

// async function registerForPushNotificationsAsync() {
//     console.log("called")
//     let token;

//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//         console.log(finalStatus);
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//         alert('Failed to get push token for push notification!');
//         return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);

//     return token;
// }

// registerForPushNotificationsAsync();


// const configureNotifications = () => {
//     PushNotification.configure({
//       // Called when Token is generated (iOS and Android)
//       onRegister: function (token) {
//         console.log('TOKEN:', token);
//       },
  
//       // Called when a remote or local notification is opened or received
//       onNotification: function (notification) {
//         console.log('NOTIFICATION:', notification);
//         // Required on iOS only
//         notification.finish(PushNotificationIOS.FetchResult.NoData);
//       },
  
//       // iOS only
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//       },
  
//       // Should the initial notification be popped automatically
//       popInitialNotification: true,
//       requestPermissions: Platform.OS === 'ios',
//     });
//   };
  
  // Function to send notification with array data
// const sendNotificationWithArrayData = (dataArray) => {
//     // Check if we have data
//     if (!dataArray || dataArray.length === 0) {
//       console.log('No data to send in notification');
//       return;
//     }
  
//     const notificationBody = data

//     // Send local notification
//     PushNotification.localNotification({
//       title: 'Data Update',
//       message: notificationBody,
//       playSound: true,
//       soundName: 'default',
//       badge: 1,
//       userInfo: {
//         // Include the full array data in userInfo for handling when notification is tapped
//         arrayData: dataArray,
//         dataCount: dataArray.length
//       },
//       // iOS specific
//       category: 'DATA_CATEGORY',
//       // Android specific (but won't hurt iOS)
//       channelId: 'default-channel-id',
//       importance: 'high',
//       vibrate: true,
//     });
//   };

//   const requestNotificationPermission = async () => {
//     if (Platform.OS === 'ios') {
//       const settings = await PushNotificationIOS.requestPermissions({
//         alert: true,
//         badge: true,
//         sound: true,
//       });
//       console.log('Notification permissions:', settings);
//       return settings;
//     }
//     return true;
//   };
  
// configureNotifications();
// sendNotificationWithArrayData(data);

console.log("Im here")


const Home = () => {
    const [data, setData] = useState([]);
    const [updatedata, setUpdatedata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [headers, setHeaders] = useState([]);
    
    const { user, logout } = useUser();
    console.log("PRINTING USER")
    console.log(user);
  
    // Configuration 
    const SHEET_ID = '1IckJxuTtY2_S3hhmmsVNTGOlC-vRdS_JudPfUkRqC7c';
    const SHEET_NAME = 'Form responses 1';
    const DATABASE_ID = 'bbbapp';
    const COLLECTION_ID = 'user_jobs';

    v_sheetswrite_url = 'https://v-sheetswrite-kd8i7a5h9-shrey-desais-projects-d8dd13e0.vercel.app/api/write-sheet'

    async function createJobDocument(item) {
      const content = {
        Address: item['Address'],
        Duration: item['Duration'],
        Name: item['Name'],
        NumDogs: item['NumDogs'],
        id: item['id'],
        Time: item['Time'],
        Taken: item['Taken']
      }
      try {
        const response = await databases.createDocument(
          DATABASE_ID,
          'all_jobs',
          ID.unique(), // Document ID (use 'unique()' for auto-generated)
          content
        );
        console.log('Document created:', response);
      } catch (error) {
        console.error('Error creating document:', error);
      }
    };

    const pushFromSheet = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${process.env.API_KEY}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.values && result.values.length > 0) {
          const [headerRow, ...dataRows] = result.values;
          setHeaders(headerRow);

          console.log('Header Row:');
          console.log(headerRow);

          console.log(dataRows);
          
          // Convert rows to objects with header keys
          const formattedData = dataRows.map((row, index) => {
            const rowObject = { id: index };
            headerRow.forEach((header, headerIndex) => {
              rowObject[header] = row[headerIndex] || '';
            });
            return rowObject;
          });

          const response = await databases.listDocuments(DATABASE_ID, 'all_jobs');
          const ids = response.documents.map(doc => doc["id"]);

          formattedData.forEach(async (row) => {
            if (!ids.includes(row['id'])) {
              //Add row to Appwrite database
              await createJobDocument(row);
            }
          })
        }
      } catch(error) {
        console.error('Error pushing data from sheet:', error);
        Alert.alert('Error', 'Failed to push data from Google Sheets');
      }
    }
  
    const fetchSheetData = async () => {
      try {
        // const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        
        // const response = await fetch(url);
        // const result = await response.json();
        
        // if (result.values && result.values.length > 0) {
        //   const [headerRow, ...dataRows] = result.values;
        //   setHeaders(headerRow);

        //   console.log(dataRows);
          
        //   // Convert rows to objects with header keys
        //   const formattedData = dataRows.map((row, index) => {
        //     const rowObject = { id: index };
        //     headerRow.forEach((header, headerIndex) => {
        //       rowObject[header] = row[headerIndex] || '';
        //     });
        //     return rowObject;
        //   });

        //   const response = await databases.listDocuments(DATABASE_ID, 'all_jobs');
        //   const ids = response.documents.map(doc => doc["id"]);

        //   formattedData.forEach((row) => {
        //     if (!ids.includes(row['id'])) {
        //       //Add row to Appwrite database
        //       createJobDocument(row);
        //     }
        //   })

          // only this part (below) needs to be kept
          // needs to get data from Appwrite database and then filter out the ones that have been taken

          let filteredData = [];

          const response = await databases.listDocuments(DATABASE_ID, 'all_jobs');
          response.documents.forEach((doc) => {
            if (doc['Taken'] != 'Yes') {
              filteredData.push(doc);
            }
          })  
          
          console.log('Filtered Data:');
          console.log(filteredData);

          setData(filteredData);
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load data from Google Sheets');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    const getUpdate = async() => {
      const inc = await fetch('https://sheets-backend-hocptaa66-shrey-desais-projects-d8dd13e0.vercel.app/api/sheet-data')
      const result = await inc.json();
      console.log(result['data'])
      if (result['data'].length != 0){
        // call createJobDocument

        const response = await databases.listDocuments(DATABASE_ID, 'all_jobs');
        const ids = response.documents.map(doc => doc["id"]);

        const data = {
          "Adress": result['data'][0],
          "Duration": result['data'][1],
          "Name": result['data'][2],
          "NumDogs": result['data'][3],
          "Time": result['data'][4],
          "id": ids.length + 1
        }
        createJobDocument(data);
        // send notification (last thing to do w/ development build)
      }

    }

  
    useEffect(() => {
      pushFromSheet();
      fetchSheetData();
    }, []);

    // useEffect(() => {
    //   const intervalId = setInterval(() => {
    //     getUpdate();
    //   }, 30000);
    // }
    // )
  
    //   return () => clearInterval(intervalId);
    // }, []);

  
    const onRefresh = () => {
      setRefreshing(true);
      fetchSheetData();
    };

    // async function updateValues(item) {
    
    //   const service = google.sheets({version: 'v4', auth});
    //   let values = [
    //     ["Yes"]
    //   ];
    //   const resource = {
    //     values,
    //   };

    //   const row = item['id'] + 2
    //   const range = `F${row}`
    //   console.log(range)

    //   try {
    //     const result = await service.spreadsheets.values.update({
    //       SHEET_ID,
    //       range,
    //       valueInputOption: 'RAW',
    //       resource,
    //     });
    //     console.log('%d cells updated.', result.data.updatedCells);
    //     return result;
    //   } catch (err) {
    //     // TODO (Developer) - Handle exception
    //     throw err;
    //   }
    // }

    async function sendReq(item) {
      console.log("SENDING");
      const response = await fetch(v_sheetswrite_url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
      });

      const rData = await response.json();
      console.log(rData);
      fetchSheetData();

    }

    async function createUserJob(item) {
      const content = {
        Address: item['Address'],
        Duration: item['Duration'],
        Name: item['Name'],
        NumDogs: item['NumDogs'],
        id: item['id'],
        Time: item['Time'],
        UserId: user["$id"]
        
      }
      try {
        console.log("BEING CALLED")
        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(), // Document ID (use 'unique()' for auto-generated)
          content
        );
        console.log('Document created:', response);

        // change the Taken value in the original document
        const updateContent = {
          Taken: 'Yes'
        }
        const updateResponse = await databases.updateDocument(
          DATABASE_ID,
          'all_jobs',
          item['$id'], // Use the id from the item to update the correct document
          updateContent

        );
        console.log('Document updated:', updateResponse);
      } catch (error) {
        console.error('Error creating document:', error);
      }
    };

    const handleAccept = (item) => {
      Alert.alert(
        'Accept Confirmation',
        `Do you want to accept this record?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Accept',
            onPress: () => {
              // Add your accept logic here
              console.log('Accepted item:', item);
              // sendReq(item);
              createUserJob(item);
              Alert.alert('Success', 'Record accepted successfully!');
              
            },
          },
        ]
      );
    };

  
    const renderCard = ({ item }) => (
      <View style={styles.card}>
        {headers.slice(1).map((header, index) => (
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
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  
    const renderEmptyState = () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No data found</Text>
        <Text style={styles.emptySubtext}>
          Make sure your Google Sheet is public and the configuration is correct
        </Text>
      </View>
    );
  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285f4" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
    
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome, {user ? user.email : 'Guest'}</Text>
          <Text style={styles.headerSubtitle}>{data.length} records</Text>
        </View>
    
        {/* Action Buttons Container */}
        <View style={styles.buttonRow}>
          {!user && (
            <>
              <TouchableOpacity style={styles.authButton} onPress={() => router.push('/login')}>
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.authButton} onPress={() => router.push('/register')}>
                <Text style={styles.authButtonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
          {user && (
            <>
              <TouchableOpacity style={styles.authButton} onPress={() => router.push('/UserJobs')}>
                <Text style={styles.authButtonText}>Show Jobs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.authButtonText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
    
        <FlatList
          data={data}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4285f4']}
              tintColor="#4285f4"
            />
          }
          ListEmptyComponent={renderEmptyState}
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

export default Home
