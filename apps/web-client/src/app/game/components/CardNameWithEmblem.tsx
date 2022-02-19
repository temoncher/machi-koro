import { SxProps, Typography } from '@mui/material';

import { cardTypeToColorMap } from './cardTypeToColorMap';

type CardNameWithTagProps = {
  sx?: SxProps;
  emblemSx?: SxProps;
  color: typeof cardTypeToColorMap[keyof typeof cardTypeToColorMap];
  tagSrc?: string | undefined;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const emblemStyles = (tagSrc: string, emblemSx: SxProps | undefined): SxProps => ({
  '&::before': {
    mr: 1,
    display: 'inline-block',
    verticalAlign: 'middle',
    height: 24,
    width: 24,
    content: '""',
    backgroundSize: '100%',
    backgroundImage: `url('${tagSrc}')`,
    ...(emblemSx ?? {}),
  },
  // For some unknown reason it doesn't work without the cast
} as SxProps);

export const CardNameWithEmblem: React.FC<CardNameWithTagProps> = (props) => {
  const typographyStyles: SxProps = [
    { ...props.sx },
    !!props.tagSrc && emblemStyles(props.tagSrc, props.emblemSx),
    // For some unknown reason it doesn't work without the cast
  ] as SxProps;

  return (
    <Typography
      sx={typographyStyles}
      fontFamily="lithos"
      fontWeight="bold"
      color={(theme) => theme.palette[props.color].dark}
      textAlign="center"
      lineHeight={0.8}
    >
      {props.children}
    </Typography>
  );
};
