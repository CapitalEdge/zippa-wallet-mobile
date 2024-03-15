import React from 'react'
import styled from 'styled-components/native';
import { Text } from '../components/Themed';

export default function BlockTitle({text, color}: {text: string, color?: string}) {
  return (
      <TitleHolder>
          <Text fontSize={14} fontFamily='zippa-semibold' color={color} style={{ textAlign: 'left' }}>
              {text}
          </Text>
      </TitleHolder>
  )
}

const TitleHolder = styled.View`
    width: 100%;
    margin-bottom: 15px;
    padding: 0 5%;
`;