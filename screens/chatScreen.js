import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
 const chatScreen = ({ navigation }) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        let subscriber;
        (async () => {
          await firebase
            .auth()
            .signInWithEmailAndPassword(TEST_ACCOUNT, TEST_PASSWORD)
            .catch(console.log);
    
          await firebase
            .firestore()
            .collection('chats')
            .orderBy('createdAt')
            .get()
            .then((querySnapshot) => {
              console.log('Total users: ', querySnapshot.size);
    
              const storedData = [];
    
              querySnapshot.forEach((documentSnapshot) => {
                storedData.push({
                  ...documentSnapshot.data(),
                  createdAt: documentSnapshot.data().createdAt.toDate(),
                });
              });
              setMessages(storedData);
              console.log(storedData);
            });
            
          
        })();
        subscriber = db
        .collection('chats')
        .orderBy('createdAt')
        .onSnapshot((querySnapshot) => {
          console.log('User size: ', querySnapshot.size);
          const storedData = [];

          querySnapshot.forEach((documentSnapshot) => {
            storedData.push({
              ...documentSnapshot.data(),
              createdAt: documentSnapshot.data().createdAt.toDate(),
            });
          });
          setMessages(storedData);
        });
        // Stop listening for updates when no longer required
        return () => subscriber();
      }, []);






        /*useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])*/
    
    /*useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('createdAt','desc').onSnapsnot(snapshot=>setMessages(
            snapshot.docs.map(doc => ({
                _id : doc.data()._id,
                createdAt: docs.data().createdAt.toDate(),
                text: docs.data().text,
                user: docs.data().user
            })) 
        ))
        return unsubscribe;

    },[])*/
    
    
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user
        }=messages[0]
        db.collection('chats').add({
            _id,
            createdAt,
            text,
            user
        })
    }, [])



    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 30
                }} onPress={signOut}>
                    <AntDesign name="logout" size={24} color="black" />
                </TouchableOpacity>
            )
        })
    })

    const signOut = () => {
        auth.signOut().then(() => {
            //Sign out successful
            navigation.replace('Login')
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.email,
                avatar: auth?.currentUser?.photoURL
            }}
        />
    )
}
export default chatScreen;
