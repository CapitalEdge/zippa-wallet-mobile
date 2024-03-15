import React from 'react';
import { View, Modal, Pressable, Image } from 'react-native';
import { Text, theme } from './Themed';
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons';
import { useToggleStore } from '../stores/feature/toggle';
import ZippaButton from './Button';


const ZippaModal: React.FC = () => {
  const [modalVisible, toggleModalVisible] = useToggleStore(state => [state.modalVisible, state.toggleModalVisible]);

  const closeModal = () => {
    toggleModalVisible(!modalVisible);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
    >
      <Pressable style={{width: '100%', height: '100%', backgroundColor: theme.colors.zippaBlack, opacity: 0.9}} > 
        <ModalContent>
          <View style={{ position: 'relative', width: "100%", height: "100%" }}>
            <CloseIcon onPress={closeModal}>
              <Ionicons name="close-outline" size={30} color="black" />
            </CloseIcon>
          
            <View style={{ flexDirection: 'column', justifyContent: 'center', position: 'relative', marginTop: 25 }}>
              <Text fontFamily="zippa-medium" fontSize={16} style={{textAlign: 'center'}}>Customer support</Text>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text fontSize={14}>You can reach the zippa support team</Text>
                <Text fontSize={14}>09:00 AM - 05:00 PM</Text>
                <Text fontSize={14}>Monday - Friday</Text>
              </View>
              <View style={{alignItems: 'center', marginVertical: 10, backgroundColor: theme.colors.zippaWhite, borderRadius: 5, padding: 5}}>
                <Text fontFamily="zippa-medium"><Text fontFamily="zippa-light" style={{}}>write us</Text>: support@zippawallet.com</Text>
              </View>
              <View style={{alignItems: 'center', marginVertical: 10, backgroundColor: theme.colors.zippaWhite, borderRadius: 5, padding: 5}}>
                <Text fontFamily="zippa-medium"><Text fontFamily="zippa-light" style={{}}>whatsapp</Text>: +234 803 692 3643</Text>
              </View>
              <View style={{alignItems: 'center', marginVertical: 10, backgroundColor: theme.colors.zippaWhite, borderRadius: 5, padding: 5}}>
                <Text fontFamily="zippa-medium"><Text fontFamily="zippa-light" style={{}}>visit our website</Text>: zippawallet.com</Text>
              </View>
              <View style={{alignItems: 'center', marginVertical: 10}}>
                <Text fontSize={16} fontFamily="zippa-bold">Zippa Wallet</Text>
                <Text fontSize={14}> A product of <Text fontSize={14} fontFamily="zippa-medium">Capital Edge Group</Text></Text>
                <Image source={require('../assets/images/capitalEdgeLogo.png')} />
                <Text fontSize={14} style={{ textAlign: 'center'}}>House 1, 2nd Avenue, Gwarimpa, FCT Abuja. Nigeria</Text>
              </View>
            </View>
          </View>
        </ModalContent>
      </Pressable>
      
    </Modal>
  );
};

export default ZippaModal;


const ModalContent = styled.View`
    width: 90%;
    backgroundColor: ${theme.colors.zippaLight}; 
    minHeight: 550px;
    position: absolute;
    alignItems: center;
    justifyContent:  center;
    left: 5%;
    top: 20%;
    borderRadius: 10px;
    padding: 15px;
`;

const CloseIcon = styled.TouchableOpacity`
  position: absolute; 
  right: 0px; 
  top: -5px;
  z-index: 10;
`;
