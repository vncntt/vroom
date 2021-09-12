import React, { useLayoutEffect } from 'react'
import { View ,Text} from 'react-native'
import {auth} from '../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {AntDesign} from '@expo/vector-icons';
const chatScreen = ({navigation}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight:() => (
                <TouchableOpacity style={{
                    marginRight: 30
                    
                }}onPress={signOut}>
                <AntDesign name="logout" size={24} color = "black"/>
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
        <View>
            <Text>Chat Screen</Text>
        </View>
    )
}

export default chatScreen