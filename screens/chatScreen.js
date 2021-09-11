import React, { useLayoutEffect } from 'react'
import { ViewBase,Text} from 'react-native'
import {auth} from '../firebase'
//import {AntDesign} from '@expo/vector-icons';
const chatScreen = ({navigation}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight:() => (
                <AntDesign name="logout" size={24} color = "black"/>
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
        <View>
            <Text>Chat Screen</Text>
        </View>
    )
}

export default chatScreen