import {
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Skeleton,
} from "@mui/material";
import type { ReactNode } from "react";
import { useId, useMemo } from "react";
import type { FieldProps } from "../rcf";

export interface RadioGroupOption<Value> {
  value: Value;
  label: ReactNode;
}

export interface RadioGroupFieldProps<Value> extends FieldProps<Value> {
  options: RadioGroupOption<Value>[];
  isLoading?: boolean;
}

export function RadioGroupField<Value>({
  options,
  name,
  value,
  errors = [],
  onChange,
  isLoading,
  sx,
  size,
  ...rest
}: RadioGroupFieldProps<Value>) {
  const id = useId();
  const valueAsOptionIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [value, options],
  );
  return (
    <FormControl fullWidth error={errors.length > 0} sx={sx}>
      <FormLabel id={id}>{name}</FormLabel>
      {isLoading ? (
        <Skeleton
          variant="rounded"
          height={100}
          sx={{ p: 2, alignItems: "center", display: "flex" }}
        >
          Loading options...
        </Skeleton>
      ) : (
        <>
          <RadioGroup
            value={valueAsOptionIndex !== -1 ? valueAsOptionIndex : ""}
            onChange={(e) =>
              onChange?.(options[e.target.value as unknown as number]?.value)
            }
            aria-labelledby={id}
            name={name}
            {...rest}
          >
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={<Radio size={size} disabled={isLoading} />}
                label={option.label}
                componentsProps={
                  size && {
                    typography: { variant: sizeFontVariants[size] },
                  }
                }
                value={index}
              />
            ))}
          </RadioGroup>
          {errors.length > 0 && (
            <FormHelperText error>{errors.join(", ")}</FormHelperText>
          )}
        </>
      )}
    </FormControl>
  );
}

const sizeFontVariants = {
  small: "body2",
  medium: "body1",
} as const;
