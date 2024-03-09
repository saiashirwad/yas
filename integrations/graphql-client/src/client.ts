import type { TadaDocumentNode } from "gql.tada";
import { Client, fetchExchange } from "urql";
import type { GraphQLServerHeaders } from "@yas/graphql-server";

export type GraphQLDocumentNode<Data, Variables> = TadaDocumentNode<
  Data,
  Variables
>;

export type GraphQLClient = ReturnType<typeof createGraphQLClient>;

export function createGraphQLClient({
  url,
  headers,
}: {
  url: string;
  headers: () => GraphQLServerHeaders;
}) {
  return new Client({
    url,
    exchanges: [fetchExchange],
    fetchOptions: () => {
      return {
        method: "POST",
        headers: headers() as unknown as HeadersInit,
        mode: "cors",
      };
    },
  });
}