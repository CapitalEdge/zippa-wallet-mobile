import { DocumentNode, OperationVariables, TypedDocumentNode, useQuery } from "@apollo/client";

/**
 * Custom hook to fetch data using Apollo Client's useQuery hook.
 *
 * @param query - The GraphQL query document.
 * @param variables - The variables to be passed to the query.
 * @returns The data, loading, and error states.
 */
const useFetchQuery = (query: DocumentNode | TypedDocumentNode<any, OperationVariables>, variables: OperationVariables | undefined) => {
    const { data, loading, error, refetch } = useQuery(query, {
        variables,
        pollInterval: 500
    });

    return { data, loading, error, refetch };
}

export default useFetchQuery;
