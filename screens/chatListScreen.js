import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { db } from '../firebase'



const chatListScreen = (props) => {

    console.log(props.route.params.uid);
    const [chatRooms, setChatRooms] = useState([]);
    useEffect(() => {
        db
            .collection("user_Chatroom")
            .doc(props.route.params.uid)
            .get()
            .then(async (querySnapshot) => {
                const chatInfoDoc = querySnapshot.data();
                //console.log(chatrooms.Rooms[0].get());

                const tempInfo = [];
                console.log("asdfasdf", chatInfoDoc);
                for (let i = 0; i < chatInfoDoc.Rooms.length; i++) {
                    await chatInfoDoc.Rooms[i].get().then((querySnapshot) => {
                        console.log(querySnapshot.data());
                        const obj = { RoomName: querySnapshot.data().RoomName, id: querySnapshot.id };
                        console.log(obj);
                        tempInfo.push(obj);
                    });
                }
                console.log(tempInfo);
                setChatRooms(tempInfo);
            })
    }, [])
    console.log(chatRooms);
    const uid = props.route.params.uid;

    return (
        
        <View>
            {
                chatRooms.map((room) => {
                    console.log(room);
                    return <TouchableOpacity onPress={() => { props.navigation.navigate("Chat", { uid, roomId: room.id }) }}>
                        <Text style={{ padding : 20, margin:20,textAlign: 'center'}}>{room.RoomName}</Text>
                    </TouchableOpacity>
                })
            }
        </View>

    )
}

export default chatListScreen
