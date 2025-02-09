import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Sources({ sources, handleSourceClick }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {sources.map((source, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            backgroundColor: '#424242',
            color: '#fff',
            borderColor: '#616161',
            cursor: 'pointer'
          }}
          onClick={() => handleSourceClick(source)}
        >
        <React.Fragment>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
              {source.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
              {source.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" sx={{ color: '#81d4fa' }}>
              {source.buttonText || 'Visit'}
            </Button>
          </CardActions>

        </React.Fragment>
        </Card>
      ))}
    </Box>
  );
}
