import { Box } from '@mui/material';
import { Pawn } from '../../../../components/Figure/figures/Pawn';

export const CheckPawn = ({ color }: { color: string }) => {
  if (color === 'white') {
    return (

      <Box style={{ width: '48px' }}>
        <Pawn fill='white' />
      </Box>

    );
  } else if (color === 'black') {
    return (

      <Box style={{ width: '48px' }}>
        <Pawn fill='#333333' />
      </Box>

    );
  } else return null;
};
