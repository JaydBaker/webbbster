import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DownloadIcon from '@mui/icons-material/Download';
import apiService from '../services/api'; // Import the updated API service

function VideoCreator() {
  const [activeTab, setActiveTab] = useState(0);
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [voiceOptions, setVoiceOptions] = useState([]);
  const [backgroundOptions, setBackgroundOptions] = useState([]);
  const [musicOptions, setMusicOptions] = useState([]);

  // Fetch options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch Voices
        const engines = await apiService.getTtsEngines();
        const voiceOpts = [];
        for (const engineKey in engines) {
          engines[engineKey].voices.forEach(v => {
            voiceOpts.push({ 
              id: v.id, 
              name: `${v.name} (${engines[engineKey].name})`, 
              engine: engineKey 
            });
          });
        }
        setVoiceOptions(voiceOpts);

        // Fetch Backgrounds
        const backgrounds = await apiService.getBackgrounds();
        setBackgroundOptions(backgrounds);

        // Fetch Music
        const music = await apiService.getMusicOptions();
        setMusicOptions([{ id: 'none', name: 'No Music', category: 'none' }, ...music]); // Add 'No Music' option

      } catch (err) {
        setError('Failed to load options. Please try again later.');
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGenerate = async () => {
    setError(null);
    setVideoUrl(null);
    setIsGenerating(true);

    try {
      const data = {
        script,
        voice: selectedVoice,
        background: selectedBackground,
        music: selectedMusic === 'none' ? null : selectedMusic,
      };
      const result = await apiService.generateVideo(data);

      if (result.success && result.file) {
        // In a real deployment, result.file would be a URL to the generated video
        // For simulation/local, we might need to adjust this based on how files are served
        // For Netlify Functions, the file path might not be directly accessible.
        // We'll simulate success for now.
        setVideoUrl(`/placeholder-video.mp4`); // Placeholder URL
        alert(`Simulated Success! Video would be available at: ${result.file}`);
      } else {
        setError(result.error || 'Failed to generate video.');
      }
    } catch (err) {
      setError('An error occurred during generation. Please check the console.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      // In a real app, this would trigger a download of the actual file
      alert(`Download requested for: ${videoUrl}`);
      // const link = document.createElement('a');
      // link.href = videoUrl;
      // link.setAttribute('download', `video_${Date.now()}.mp4`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AI Video Creator
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Create viral AI-narrated videos with custom backgrounds and voiceovers
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper elevation={3} sx={{ mt: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<TextFieldsIcon />} label="Script" />
            <Tab icon={<MovieIcon />} label="Background" />
            <Tab icon={<MusicNoteIcon />} label="Audio" />
            <Tab icon={<VideoLibraryIcon />} label="Generate" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Write Your Script
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="Type or paste your script here..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    onClick={() => setActiveTab(1)}
                    disabled={!script}
                  >
                    Next: Choose Background
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Background Video
                </Typography>
                {backgroundOptions.length === 0 && <Typography>Loading backgrounds...</Typography>}
                <Grid container spacing={2}>
                  {backgroundOptions.map((bg) => (
                    <Grid item xs={12} sm={6} md={3} key={bg.id}>
                      <Paper 
                        elevation={selectedBackground === bg.id ? 8 : 2}
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          border: selectedBackground === bg.id ? '2px solid #ff5722' : 'none',
                          height: '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: selectedBackground === bg.id ? 'rgba(255, 87, 34, 0.1)' : 'background.paper'
                        }}
                        onClick={() => setSelectedBackground(bg.id)}
                      >
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: '100px', 
                            backgroundColor: 'grey.800',
                            mb: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <MovieIcon fontSize="large" />
                        </Box>
                        <Typography variant="body2">{bg.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {bg.category}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setActiveTab(0)}
                  >
                    Back: Script
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => setActiveTab(2)}
                    disabled={!selectedBackground}
                  >
                    Next: Choose Audio
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Voice and Music
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Select Voice</InputLabel>
                      <Select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        label="Select Voice"
                        disabled={voiceOptions.length === 0}
                      >
                        {voiceOptions.length === 0 && <MenuItem disabled>Loading voices...</MenuItem>}
                        {voiceOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Background Music</InputLabel>
                      <Select
                        value={selectedMusic}
                        onChange={(e) => setSelectedMusic(e.target.value)}
                        label="Background Music"
                        disabled={musicOptions.length === 0}
                      >
                        {musicOptions.length === 0 && <MenuItem disabled>Loading music...</MenuItem>}
                        {musicOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setActiveTab(1)}
                  >
                    Back: Background
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => setActiveTab(3)}
                    disabled={!selectedVoice}
                  >
                    Next: Generate Video
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Generate Your Video
                </Typography>
                
                <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Script Length:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{script.length} characters</Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Background:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {backgroundOptions.find(bg => bg.id === selectedBackground)?.name || 'None selected'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Voice:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {voiceOptions.find(v => v.id === selectedVoice)?.name || 'None selected'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Music:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {musicOptions.find(m => m.id === selectedMusic)?.name || 'None selected'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={isGenerating ? <CircularProgress size={24} color="inherit" /> : <MovieIcon />}
                    onClick={handleGenerate}
                    disabled={!script || !selectedBackground || !selectedVoice || isGenerating}
                    sx={{ minWidth: 200 }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Video'}
                  </Button>
                </Box>
                
                {videoUrl && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Your Video
                    </Typography>
                    <Box sx={{ 
                      width: '100%', 
                      height: '300px', 
                      backgroundColor: 'grey.800',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      {/* Replace with a functional video player if possible */}
                      <video controls width="100%" height="300" src={videoUrl}>
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                      >
                        Download Video
                      </Button>
                    </Box>
                  </Box>
                )}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setActiveTab(2)}
                  >
                    Back: Audio
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default VideoCreator;

