import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import MicIcon from '@mui/icons-material/Mic';
import DashboardIcon from '@mui/icons-material/Dashboard';

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Free WAVA AI Alternative
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Create stunning AI-narrated videos and voiceovers without limitations.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={Link} 
            to="/video"
            sx={{ mr: 2 }}
            startIcon={<MovieIcon />}
          >
            Create Video
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large" 
            component={Link} 
            to="/tts"
            startIcon={<MicIcon />}
          >
            Generate Voice
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ my: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <MovieIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>Text Story Videos</Typography>
            <Typography variant="body2" color="text.secondary">
              Turn your scripts into engaging videos with dynamic backgrounds and AI narration.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <MicIcon color="secondary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>Custom AI Voiceovers</Typography>
            <Typography variant="body2" color="text.secondary">
              Access a wide range of high-quality AI voices or clone your own for unique projects.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <DashboardIcon color="action" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>Unlimited & Free</Typography>
            <Typography variant="body2" color="text.secondary">
              Enjoy all features without restrictions or subscription fees. 100% free forever.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">1. Write</Typography>
            <Typography color="text.secondary">Input your script or text for narration.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">2. Create</Typography>
            <Typography color="text.secondary">Choose voices, backgrounds, and music.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">3. Export</Typography>
            <Typography color="text.secondary">Generate and download your final video or audio.</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;

