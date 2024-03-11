import {
  graphql,
  useGraphQLMutation,
  useGraphQLQuery,
} from "@yas/graphql-client";
import { useDebouncedValue } from "@yas/hooks";
import { LoadingButton, NumberField, TextField } from "@yas/ui";
import { useState } from "react";

export default function GraphQL() {
  const [shouldServerError, setShouldServerError] = useState(false);
  const [name, setName] = useState("");
  const debouncedName = useDebouncedValue(name, 300);
  const { data } = useGraphQLQuery({
    query: dataGQL,
    variables: { name: debouncedName },
  });
  const increase = useGraphQLMutation(increaseGQL);
  useGraphQLQuery({ query: errorGQL, enabled: shouldServerError });

  return (
    <>
      <TextField
        label="Enter your name"
        value={name}
        onChange={setName}
        required
      />
      <TextField label="Greeting from server" value={data?.greeting} readOnly />
      <NumberField label="Count from server" value={data?.count} readOnly />
      <LoadingButton
        isLoading={increase.isPending}
        onClick={() => increase.mutate({ amount: 1 })}
      >
        Increase count
      </LoadingButton>
      <LoadingButton
        onClick={() => setShouldServerError(true)}
        disabled={shouldServerError}
      >
        Enable server side error
      </LoadingButton>
    </>
  );
}

const dataGQL = graphql(`
  query GraphQLTester($name: String!) {
    greeting(name: $name)
    count
  }
`);

const errorGQL = graphql(`
  query ErrorQuery {
    error
  }
`);

const increaseGQL = graphql(`
  mutation IncreaseCount($amount: Int!) {
    increaseCount(amount: $amount)
  }
`);
