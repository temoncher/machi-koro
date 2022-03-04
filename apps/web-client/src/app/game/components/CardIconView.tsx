import { Box, SxProps } from '@mui/material';

type CardIconViewProps = {
  sx?: SxProps;
};

export const CardIconView: React.FC<CardIconViewProps> = (props) => (
  <Box
    sx={{
      width: 24,
      height: 32,
      textAlign: 'center',
      borderWidth: 4,
      borderRadius: 1,
      borderStyle: 'solid',
      borderColor: (theme) => theme.palette.grey[400],
      bgcolor: (theme) => theme.palette.grey[200],
      ...props.sx,
    }}
  >
    {props.children}
  </Box>
);
