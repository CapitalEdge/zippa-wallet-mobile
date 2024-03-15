import Banner from '../../../components/Banner';
import BlockTitle from '../../../components/BlockTitle';
import ReferralBanner from '../../../components/ReferralBanner';
import { Container, ScrollScreen, theme } from '../../../components/Themed';
import BalanceCard from '../../../components/home/BalanceCard';
import HeaderComponent from '../../../components/home/Header';
import QuickItems from '../../../components/home/QuickItems';
import Transactions from '../../../components/Transactions';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalStore } from '../../../stores/store';
import { GET_TRANSACTIONS, USERDATA } from '../../../helpers/graphQL/queries';
import useFetchQuery from '../../../hooks/useFetchQuery';
import { MMKVStorage } from '../../../stores/mmkv-storage';
import { RefreshControl } from 'react-native';


export default function HomeScreen(): JSX.Element {
  const id = JSON.parse(MMKVStorage.getItem("@auth-session") as string)?.state?.data?.user?.id;
  const setAppState = useGlobalStore(state => state.setAppState);
  
  const { data: userData, loading: loadingUserData, refetch } = useFetchQuery(USERDATA, id);
  const { data: transactions, loading: loadingTransaction } = useFetchQuery(GET_TRANSACTIONS, id);

  useEffect(() => {
    (loadingTransaction || loadingUserData) ?
      setAppState("LOADING") :
      setAppState("LOADED");
  }, [loadingUserData, loadingTransaction]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  useEffect(() => {
    //refetch user data
    refetch();
  }, []);
  
  return (
    <>
      <Container>
        <ScrollScreen  refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.zippaGreen, theme.colors.zippaBlue, theme.colors.zippaGrey]} />
        }>
          <HeaderComponent data={userData?.usersCollection?.edges[0]?.node} />
          <BalanceCard />
          <Banner />
          <BlockTitle text="Quick options" />
          <QuickItems />
          <ReferralBanner />
          <BlockTitle text="Recent Transaction" />
          <Transactions data={transactions?.transactionsCollection?.edges?.slice(0, 4)} />
        </ScrollScreen>
      </Container>
    </>
  );
}