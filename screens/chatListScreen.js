import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { db } from '../firebase'



const chatListScreen = (props) => {

    console.log(props.route.params.uid);
    const [chatRooms, setChatRooms] = useState([]);
    console.log(chatRooms);
    useEffect(()=>{
        db
        .collection('user_Chatroom')
        .add({
            Rooms: []
        })
    })
    /*
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

        const subscriber = db
        .collection('user_Chatroom')
        .doc(props.route.params.uid)
        .onSnapshot(async (documentSnapshot) => {
            const chatInfoDoc = documentSnapshot.data();
                //console.log(chatrooms.Rooms[0].get());

                const tempInfo = [];
                console.log("asdfasdf", chatInfoDoc);
                for (let i = 0; i < chatInfoDoc.Rooms.length; i++) {
                    await chatInfoDoc.Rooms[i].get().then((documentSnapshot) => {
                        console.log(documentSnapshot.data());
                        const obj = { RoomName: documentSnapshot.data().RoomName, id: documentSnapshot.id };
                        console.log(obj);
                        tempInfo.push(obj);
                    });
                }
                console.log(tempInfo);
                setChatRooms(tempInfo);
        });
        return ()=>subscriber();
    }, [])
    console.log(chatRooms);
    const uid = props.route.params.uid;
    const createNewChatsDocument = () => {
        db
            .collection('newChats')
            .add({
                RoomName: props.route.params.username,
            })
            .then((data1) => {
                console.log(data1.id);
                db
                    .collection('newChats')
                    .doc(data1.id)
                    .collection('Room')
                    .add({

                    })
                    .then((data) => {
                        let tempArr;
                        db
                            .collection("user_Chatroom")
                            .doc(props.route.params.uid)
                            .get()
                            .then((querySnapshot) => {
                                tempArr = querySnapshot.data().Rooms
                                console.log(querySnapshot.data());
                                console.log();
                                tempArr.push(data1);
                                db
                                    .collection('user_Chatroom')
                                    .doc(uid)
                                    .set({
                                        Rooms: tempArr
                                    })
                            })

                    })
            })


    }
    const createNewDocumentInUser = () => {
        db
            .collection('user_Chatroom')
            .doc(uid)
            .get()
            .then((data) => {
                const tempRoom = Rooms;
                tempRoom.push("test");
            })
            .set({
                Rooms: tempRoom
            })

    }
    */

    return (

        <View>
            {
                chatRooms.map((room, index) => {
                    console.log(room);
                    return <TouchableOpacity key={index} onPress={() => { props.navigation.navigate("Chat", { uid, roomId: room.id }) }}>
                        <Text style={{ padding: 20, margin: 20, textAlign: 'center' }}>{room.RoomName}</Text>
                    </TouchableOpacity>
                })
            }
            <TouchableOpacity onPress={() => { createNewChatsDocument() }}>
                <Text>Create New Chatroom</Text>
            </TouchableOpacity>
        </View>

    )
}

export default chatListScreen
