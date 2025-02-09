import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// const bull = (
//   <Box
//     component="span"
//     sx={{
//       display: 'inline-block',
//       mx: '2px',
//       transform: 'scale(0.8)',
//       color: '#fff'
//     }}
//   >
//     •
//   </Box>
// );

const card1 = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
        What is OpenAI?
      </Typography>
      <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
        OpenAI is a private research laboratory ... 
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" sx={{ color: '#81d4fa' }}>
        techtarget
      </Button>
    </CardActions>
  </React.Fragment>
);

const card2 = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
        Only 4 of OpenAI’s 11...
      </Typography>
      <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
        The release of OpenAI’s ChatGPT sparked ... 
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" sx={{ color: '#81d4fa' }}>
        observer
      </Button>
    </CardActions>
  </React.Fragment>
);

const card3 = (
  <React.Fragment>
    <CardContent>
      <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
        OpenAI
      </Typography>
      <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
        OpenAI is a private research laboratory ... 
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" sx={{ color: '#81d4fa' }}>
        en.wikipedia
      </Button>
    </CardActions>
  </React.Fragment>
);

export default function Sources() {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // adds spacing between the cards
        p: 2
      }}
    >
      <Card
        variant="outlined"
        sx={{
          backgroundColor: '#424242',
          color: '#fff',
          borderColor: '#616161',
        }}
      >
        {card1}
      </Card>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: '#424242',
          color: '#fff',
          borderColor: '#616161',
        }}
      >
        {card2}
      </Card>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: '#424242',
          color: '#fff',
          borderColor: '#616161',
        }}
      >
        {card3}
      </Card>
    </Box>
  );
}
