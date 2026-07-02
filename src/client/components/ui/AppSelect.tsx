import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  FormHelperText,
  OutlinedInput,
  Chip,
  Box,
} from '@mui/material';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface AppSelectProps extends Omit<SelectProps, 'multiple'> {
  options: SelectOption[];
  multiple?: boolean;
  helperText?: string;
  error?: boolean;
}

export function AppSelect({
  label,
  options,
  multiple = false,
  value,
  onChange,
  helperText,
  error = false,
  ...props
}: AppSelectProps) {
  const labelId = label ? `${String(label).toLowerCase().replace(/\s+/g, '-')}-label` : undefined;

  return (
    <FormControl fullWidth error={error} size={props.size || 'medium'}>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        labelId={labelId}
        label={label}
        multiple={multiple}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={
          multiple
            ? (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as (string | number)[]).map((val) => {
                    const opt = options.find((o) => o.value === val);
                    return <Chip key={val} label={opt ? opt.label : val} size="small" />;
                  })}
                </Box>
              )
            : undefined
        }
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
