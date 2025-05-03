import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MovieIcon from '@mui/icons-material/Movie';
import MicIcon from '@mui/icons-material/Mic';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - would be populated from API
  const recentProjects = [
    { id: 1, type: 'video', title: 'Product Explainer', date: '2025-04-10', thumbnail: null },
    { id: 2, type: 'audio', title: 'Podcast Intro', date: '2025-04-09', thumbnail: null },
    { id: 3, type: 'video', title: 'Tutorial Video', date: '2025-04-08', thumbnail: null },
  ];

  const savedVoices = [
    { id: 1, name: 'Professional Male', engine: 'coqui', favorite: true },
    { id: 2, name: 'Narrator Female', engine: 'bark', favorite: true },
    { id: 3, name: 'Casual Conversational', engine: 'tortoise', favorite: false },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                backgroundColor: 'primary.dark',
                color: 'white'
              }}
            >
              <Typography variant="h5" gutterBottom>
                Create New Video
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={Link}
                to="/video"
                sx={{ mt: 2 }}
              >
                Start Creating
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                backgroundColor: 'secondary.dark',
                color: 'white'
              }}
            >
              <Typography variant="h5" gutterBottom>
                Generate Voiceover
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={Link}
                to="/tts"
                sx={{ mt: 2 }}
              >
                Create Voice
              </Button>
            </Paper>
          </Grid>
        </Grid>
        
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<HistoryIcon />} label="Recent Projects" />
            <Tab icon={<FavoriteIcon />} label="Saved Voices" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Recent Projects
                </Typography>
                
                {recentProjects.length > 0 ? (
                  <Grid container spacing={3}>
                    {recentProjects.map((project) => (
                      <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardMedia
                            component="div"
                            sx={{
                              height: 140,
                              backgroundColor: 'grey.800',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {project.type === 'video' ? (
                              <MovieIcon fontSize="large" />
                            ) : (
                              <MicIcon fontSize="large" />
                            )}
                          </CardMedia>
                          <CardContent>
                            <Typography variant="h6" component="div">
                              {project.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Created: {project.date}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                              <Button size="small" startIcon={<DownloadIcon />}>
                                Download
                              </Button>
                              <Button size="small" color="primary">
                                Edit
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      You haven't created any projects yet.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/video"
                      sx={{ mt: 2 }}
                    >
                      Create Your First Project
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Saved Voices
                </Typography>
                
                {savedVoices.length > 0 ? (
                  <List>
                    {savedVoices.map((voice, index) => (
                      <React.Fragment key={voice.id}>
                        <ListItem>
                          <ListItemIcon>
                            <MicIcon color={voice.favorite ? "secondary" : "inherit"} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={voice.name} 
                            secondary={`Engine: ${voice.engine}`} 
                          />
                          <Button size="small" startIcon={<FavoriteIcon />}>
                            {voice.favorite ? 'Favorited' : 'Add to Favorites'}
                          </Button>
                          <Button size="small" color="primary" sx={{ ml: 1 }}>
                            Use
                          </Button>
                        </ListItem>
                        {index < savedVoices.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      You haven't saved any voices yet.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/tts"
                      sx={{ mt: 2 }}
                    >
                      Create Your First Voice
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Usage Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">
                  Unlimited
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Video Generation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">
                  Unlimited
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Voice Generation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">
                  100%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Free Forever
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default Dashboard;

