import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { db } from '../firebase'



const chatListScreen = (props) => {
    
    console.log(props.route.params.uid);
    const [chatRooms,setChatRooms] = useState([]);
    useEffect(()=>{
        db
        .collection("user_Chatroom")
        .doc(props.route.params.uid)
        .get()
        .then((querySnapshot)=> {
            const chatInfo = querySnapshot.data();
            //console.log(chatrooms.Rooms[0].get());
            const tempInfo = [];
            for(let i = 0;i<chatInfo.Rooms.length;i++)
            {
                chatInfo.Rooms[i].get().then((querySnapshot)=>{
                    console.log(querySnapshot.data());
                    tempInfo.push(querySnapshot.data());
                });
            }
            console.log(tempInfo);
            setChatRooms(tempInfo);
        })
    }, [])
    console.log(chatRooms);
    
    return (
        <View>
            {
            chatRooms.map((room)=>{
                console.log(room);
                return <Text>{room.RoomName}</Text>

            })
        }
        <Text>{chatRooms[0]?.RoomName}</Text>
        </View>
        
    )
}

export default chatListScreen
