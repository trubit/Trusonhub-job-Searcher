import React, { useState } from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';

export interface AppInputProps extends Omit<TextFieldProps, 'variant'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'phone' | 'textarea';
}

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ type = 'text', multiline, rows, InputProps, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const isSearch = type === 'search';
    const isTextarea = type === 'textarea';

    const finalType = isPassword ? (showPassword ? 'text' : 'password') : isSearch ? 'search' : type;

    return (
      <TextField
        inputRef={ref}
        type={isTextarea ? undefined : finalType}
        multiline={isTextarea || multiline}
        rows={isTextarea ? (rows || 4) : rows}
        fullWidth
        variant="outlined"
        InputProps={{
          ...InputProps,
          startAdornment: isSearch ? (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ) : (
            InputProps?.startAdornment
          ),
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : (
            InputProps?.endAdornment
          ),
        }}
        {...props}
      />
    );
  }
);

AppInput.displayName = 'AppInput';
