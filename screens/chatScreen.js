import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { View, Text, Alert, useParams } from 'react-native'
import { auth, db, storage } from '../firebase'
import { TouchableOpacity} from 'react-native-gesture-handler';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { Audio } from 'expo-av';
import { Actions, Bubble, GiftedChat, IMessage } from 'react-native-gifted-chat';


const chatScreen = (props, {navigation}) => {
  const roomId = props.route.params.roomId;
  const collectionName = 'newChats';
  const [messages, setMessages] = useState([]);
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const chatRoom = db
      .collection('newChats')
      .doc(roomId)
      .collection("Room")
      .orderBy('createdAt', 'desc');
      
    const HandleSnapshot = (querySnapshot) => {
      const storedData = [];
      querySnapshot.forEach((documentSnapshot) => {
        storedData.push({
          ...documentSnapshot.data(),
          createdAt: documentSnapshot.data().createdAt.toDate()
        });
      });
      setMessages(storedData);
    };
    const subscriber = chatRoom.onSnapshot(HandleSnapshot);
    (async () => {
      await chatRoom.get().then(HandleSnapshot);
    })();
    return () => subscriber();

  }, []);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const uploadAudio = async () => {
    const filename = uuidv4();
    const uri = recording.getURI();
    console.log(uri);
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log("error", error);
          }
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      if (blob != null) {
        await storage()
          .ref()
          .child(`${filename}.${fileType}`)
          .put(blob, {
            contentType: `audio/${fileType}`,
          })
          .then(() => {
            console.log("sent");
          })
          .catch((e) => console.log("error", "123123"));
      } else {
        console.log("blob error");
      }
    } catch (error) {
      console.log("error (try-level):", error);
    }
    return `${filename}.${fileType}`;
  };
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const auri = recording.getURI();
    const filename = await uploadAudio();
    const downloadURI = await storage().ref(filename).getDownloadURL();
    console.log(filename);
    
    const message = {
      _id: uuidv4(),
      createdAt: new Date(),
      user: {
        _id: props.route.params.uid
      },
      text: "",
      audio: downloadURI,
    };

    //console.log(message);

    await db
      .collection("newChats")
      .doc(roomId)
      .collection("Room")
      .add(message)
      .then(() => console.log("User added"))
      .catch(console.log);


    console.log("Recording stopped and stored at", uri);
  };

  const renderActions = () => {
    return (
      <Ionicons
        name={recording ? 'mic-off' : 'ios-mic'}
        size={35}
        onPress={recording ? stopRecording : startRecording}
      />
    );
  };

  const renderAudio = (props) => {
    console.log(props.currentMessage)
    return !props.currentMessage?.audio ? (
      <View>

      </View>
    ) : (
      <View>
        <Ionicons
          name="ios-play"
          size={35}
          color={active ? "green" : "red"}
          onPress={async () => {
            const downloadURI = await storage()
              .refFromURL(props.currentMessage.audio)
              .getDownloadURL();
            const soundObject = new Audio.Sound();
            const d = await soundObject
              .loadAsync({ uri: downloadURI })
              .catch(console.log);
            setSound(soundObject);
            soundObject.setOnPlaybackStatusUpdate((status) => {
              console.log(status)
              if (status.isPlaying === true) {
                setActive(true);
              } else {
                setActive(false);
              }
            });
            console.log("Playing Sound");
            const s = await soundObject.playAsync();
          }}

        />
      </View>
    );
  };

  const onSend = useCallback((messages = []) => {
    console.log(messages);
    messages.forEach((data) => {
      db
        .collection("newChats")
        .doc(roomId)
        .collection("Room")
        .add(data)
        .then(() => console.log("User added"));
    });
    
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);


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
      renderMessageAudio={renderAudio}
      renderCustomView={() => renderAudio(props)}
      renderUsernameOnMessage={true}
      renderBubble={(props) => {
        return (
          <View>
            <Bubble {...props}></Bubble>
          </View>
        );
      }}
      messages={messages}
      showAvatarForEveryMessage={true}
      renderActions={renderActions}
      onSend={messages => onSend(messages)}
      user={{
        _id: props.route.params.uid,
        name: auth?.currentUser?.email,
        avatar: auth?.currentUser?.photoURL
      }}
    />
  )
}
export default chatScreen;
