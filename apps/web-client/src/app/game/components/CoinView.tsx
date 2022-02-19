import { Box, SxProps } from '@mui/material';

type CoinViewProps = {
  sx?: SxProps;
  type: 'gold' | 'bronze';
};

const coinTypeToColorsMap = {
  bronze: {
    borderColor: '#bb714b',
    backgroundColor: '#7d4835',
    color: 'white',
  },
  gold: {
    borderColor: '#dd9e1b',
    backgroundColor: '#eecc4e',
    color: 'black',
  },
} as const;

export const CoinView: React.FC<CoinViewProps> = (props) => {
  const colors = coinTypeToColorsMap[props.type];

  return (
    <Box
      sx={{
        minWidth: 32,
        width: 32,
        minHeight: 32,
        height: 32,
        borderWidth: 4,
        borderStyle: 'solid',
        borderRadius: 1e5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'lithos',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
        ...colors,
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
};
