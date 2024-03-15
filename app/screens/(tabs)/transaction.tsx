import { Container } from '../../../components/Themed';
import Transactions from '../../../components/Transactions';
import { theme } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { useState } from 'react';
import { GET_TRANSACTIONS } from '../../../helpers/graphQL/queries';
import useFetchQuery from '../../../hooks/useFetchQuery';
import { MMKVStorage } from '../../../stores/mmkv-storage';

/**
 * Renders a screen that displays a list of transactions and allows the user to search for transactions.
 */
export default function TransactionsScreen() {
  const id = JSON.parse(MMKVStorage.getItem("@auth-session") as string)?.state?.data?.user?.id;
  // Get the list of transactions from the store
  const { data: transactions, loading: loadingTransaction } = useFetchQuery(GET_TRANSACTIONS, id);

  // Set up state for the search input and the filtered transactions
  const [searchInput, setSearchInput] = useState<string>();
  const [filteredTransactions, setFilteredTransactions] = useState(transactions?.transactionsCollection?.edges);

  /**
   * Handles the search input change and filters the transactions accordingly.
   * @param text - The search input text.
   */
  const handleSearch = (text: string) => {
    setSearchInput(text);
    const filtered = transactions?.transactionsCollection?.edges.filter((transaction: { node: { transaction_details: { savings_type: { name: string; }; }; }; }) => {
      const name = transaction.node?.transaction_details?.savings_type?.name.replace(/-/g, " ");
      return name.includes(text.toLowerCase());
    });
    setFilteredTransactions(filtered);
  }


  // Render the screen
  return (
    <Container>
      {/* Render the search bar */}
      <SearchTransactionContainer>
        <SearchTransaction>
          <Ionicons name="search" size={24} color={theme.colors.zippaBlack} style={{ marginVertical: 5 }} />
          <TextInput
            placeholder='Search transactions'
            cursorColor={theme.colors.zippaBlack}
            allowFontScaling
            onChangeText={handleSearch}
            value={searchInput}
          />
        </SearchTransaction>
      </SearchTransactionContainer>
      
      {/* Render the list of transactions */}
      <ScrollView showsVerticalScrollIndicator>
        <Transactions data={filteredTransactions} />
      </ScrollView>
    </Container>
  );
}

// Styles
const SearchTransactionContainer = styled.View`
  width: 90%;
  padding: 10px 5%;
  background-color: ${theme.colors.zippaWhite};
  border-radius: 15px;
  justify-content: center;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 10px;
`
const SearchTransaction = styled.View`
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: ${theme.colors.zippaWhite};
`;
