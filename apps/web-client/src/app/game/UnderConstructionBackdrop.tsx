import { Box } from '@mui/material';

import { UrlUtils } from '../utils/url.utils';

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
      src={UrlUtils.getStaticImage('under-construction')}
    />
  </Box>
);
