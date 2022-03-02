import { Box } from '@mui/material';

// TODO: replace this one with something else
import underConstructionSrc from './images/under-construction.png';

export const UnderConstructionBackdrop: React.FC = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <img
      alt="card"
      style={{
        objectFit: 'contain',
        maxWidth: '70%',
        width: '70%',
        minWidth: '70%',
      }}
      src={underConstructionSrc}
    />
  </Box>
);
