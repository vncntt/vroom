import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text } from 'react-native'
import { auth, db } from '../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
const chatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
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

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('createdAt','desc')
        .onSnapsnot(snapshot=>setMessages(
            snapshot.docs.map(doc => ({
                _id : doc.data()._id,
                createdAt: docs.data().createdAt.toDate(),
                text: docs.data().text,
                user: docs.data().user
            })) 
        ))
        return unsubscribe;

    },[])
    

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
                name: auth?.currentUser?.email
            }}
        />
    )

}

export default chatScreen