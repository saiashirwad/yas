import { z } from "zod";
import { InputAdornment, Stack } from "@mui/material";
import { BaseForm } from "../BaseForm";
import { ExampleContent } from "../ExampleContent";
import { SingleSelectField, valueOptions } from "../fields/SingleSelectField";
import { NumberField } from "../fields/NumberField";

const kindType = z.enum(["foo", "bar"]);
const paymentType = z.enum(["card", "paypal"]);

function createDiscriminatingSchema() {
  const fooSchema = z.object({
    kind: z.literal("foo"),
    foo: z.string(),
  });

  const barSchema = z.object({
    kind: z.literal("bar"),
    bar: z.string(),
  });

  const cardSchema = z.object({
    type: z.literal("card"),
    number: z.string(),
    expiry: z.string(),
  });

  const paypalSchema = z.object({
    type: z.literal("paypal"),
    email: z.string(),
  });

  return z
    .object({ owner: z.string() })
    .and(z.discriminatedUnion("type", [cardSchema, paypalSchema]))
    .and(z.discriminatedUnion("kind", [fooSchema, barSchema]));
}

const DiscriminatedForm = BaseForm.extend((options) =>
  options
    .schema(createDiscriminatingSchema())
    .type(paymentType, SingleSelectField, {
      options: valueOptions(paymentType.options),
    })
    .type(kindType, SingleSelectField, {
      options: valueOptions(kindType.options),
    }),
);

const ConditionsForm = BaseForm.extend((options) =>
  options
    .schema(
      z.object({
        type: kindType,
        foo: z.string(),
        bar: z.number(),
      }),
    )
    .conditions((data) => ({
      foo: data.type === "foo",
      bar: data.type === "bar",
    }))
    .type(kindType, SingleSelectField, {
      options: valueOptions(kindType.options),
    }),
);

const currencyType = z.enum(["USD", "EUR", "SEK"]);
const RelatedForm = BaseForm.extend((options) =>
  options
    .schema(
      z.object({
        currency: currencyType,
        amount: z.number(),
      }),
    )
    .type(currencyType, SingleSelectField, {
      options: valueOptions(currencyType.options),
    })
    .field("amount", ({ fieldValues, ...props }) => (
      <NumberField
        {...props}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {fieldValues?.currency}
            </InputAdornment>
          ),
        }}
      />
    )),
);

export function ConditionalExample() {
  return (
    <ExampleContent>
      {(props) => (
        <Stack direction="column" gap={4}>
          <DiscriminatedForm title="Discriminated" {...props} />

          <ConditionsForm title="Conditions" {...props} />

          <RelatedForm title="Related" {...props} />
        </Stack>
      )}
    </ExampleContent>
  );
}