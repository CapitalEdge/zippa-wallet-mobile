import { View, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Text, theme } from './Themed'
import styled from 'styled-components/native'

const RadioButton = ({ options, selectedOption, onSelect }: {options: any, selectedOption: any, onSelect: any}) => {
    return (
        <RadioButtonContainer>
            {options?.map((item: any) => {
                return (
                    <ButtonContainer key={item?.node?.id}>
                        <ButtonItem
                            onPress={() => {
                                onSelect(item);
                            }}>
                            <Text fontSize={14}>{item?.node?.name}</Text>
                            {selectedOption?.node?.key === item?.node?.key && (
                                <ActiveBorder />
                            )} 
                        </ButtonItem>
                    </ButtonContainer>
                );
            })}
        </RadioButtonContainer>
    );
}


export default RadioButton



const RadioButtonContainer = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
`;


const ButtonContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const ButtonItem = styled.Pressable`
    height: 40px;
    min-width: 48%;
    border-radius: 5px;
    background-color: ${ theme.colors.zippaLight };
    align-items: center;
    justify-content: center;
    position: relative;
`;

const ActiveBorder = styled.View`
    width: 100%;
    height: 40px;
    position: absolute;
    border-radius: 5px;
    background-color: transparent;
    border-color: ${ theme.colors.zippaLightBlue };
    border-width: 2px;
`;
