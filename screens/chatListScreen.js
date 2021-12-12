import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { db } from '../firebase'



const chatListScreen = (props) => {
    console.log(props.route.params.uid);
    useEffect(()=>{
        db
        .collection("user_Chatroom")
        .doc(props.route.params.uid)
        .get()
        .then((querySnapshot)=> {
            const chatrooms = querySnapshot.data();
            //console.log(chatrooms.Rooms[0].get());
            chatrooms.Rooms[0].get().then((querySnapshot)=>{
                console.log(querySnapshot.data());
            });
        })
    })
    
    return (
        <View>
            <Text>hello world</Text>
        </View>
    )
}

export default chatListScreen
