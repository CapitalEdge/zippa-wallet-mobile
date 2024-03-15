import { theme } from "../constants/Colors";
import styled from "styled-components/native";
import { NairaSign, Text } from "./Themed";


export default function ReferralBanner() {
    return (
        <BannerCard>
            <BannerContent>
                <ReferralText> 
                    <Text fontFamily="zippa-semibold">Invite friends and family</Text>
                    <Text fontSize={12}>Refer us to your friends and family and earn big in reward money</Text>
                </ReferralText>
                <ReferralImage>
                    <ReferralImageItem source={require('../assets/images/mockupResized.png')} style={{ width: 100, height: 100 }} />
                </ReferralImage>
            </BannerContent>
        </BannerCard>
    )
}


const BannerCard = styled.View`
  flex: 1;
  width: 90%;
  margin: 20px auto; 
  height: 100px;
  max-height: 100px;
  background-color: ${theme.colors.zippaSubtle};
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  `

const BannerContent = styled.View`
    flex: 1;
    flex-direction: row;
    width: 100%;
    height: 100%;
    gap: 10px;
    padding: 10px;
`;

const ReferralText = styled.View`
    justify-content: center;
    width: 70%;
`;

const ReferralImage = styled.View`
    justify-content: center;
    width: 30%;
`;

const ReferralImageItem = styled.Image`
    width: 100px;
    height: 100px;
`;