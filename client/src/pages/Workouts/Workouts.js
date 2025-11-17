import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as ExerciseIcon,
} from '@mui/icons-material';
import { workoutsAPI } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';

const WorkoutForm = ({ open, onClose, workout, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    duration: 30,
    exercises: [],
    notes: '',
    ...workout
  });

  const [exercise, setExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 0,
    caloriesBurned: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addExercise = () => {
    if (exercise.name) {
      setFormData({
        ...formData,
        exercises: [...formData.exercises, exercise]
      });
      setExercise({
        name: '',
        sets: 3,
        reps: 10,
        weight: 0,
        duration: 0,
        caloriesBurned: 0
      });
    }
  };

  const removeExercise = (index) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: newExercises });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {workout ? 'Edit Workout' : 'Create New Workout'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Workout Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="strength">Strength</MenuItem>
                  <MenuItem value="cardio">Cardio</MenuItem>
                  <MenuItem value="hiit">HIIT</MenuItem>
                  <MenuItem value="flexibility">Flexibility</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Exercises
              </Typography>
              
              {/* Add Exercise Form */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Exercise Name"
                      value={exercise.name}
                      onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Sets"
                      value={exercise.sets}
                      onChange={(e) => setExercise({ ...exercise, sets: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Reps"
                      value={exercise.reps}
                      onChange={(e) => setExercise({ ...exercise, reps: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Weight (kg)"
                      value={exercise.weight}
                      onChange={(e) => setExercise({ ...exercise, weight: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Button onClick={addExercise} variant="outlined">
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Exercises List */}
              {formData.exercises.map((ex, index) => (
                <Card key={index} sx={{ mb: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6">{ex.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {ex.sets} sets × {ex.reps} reps {ex.weight > 0 && `× ${ex.weight}kg`}
                        </Typography>
                      </Box>
                      <IconButton onClick={() => removeExercise(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {workout ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const { emit } = useSocket();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutsAPI.getAll();
      setWorkouts(response.data.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async (workoutData) => {
    try {
      await workoutsAPI.create(workoutData);
      await fetchWorkouts();
      setFormOpen(false);
      
      // Emit real-time event
      emit('workout_completed', {
        workoutName: workoutData.name,
        duration: workoutData.duration,
        exercises: workoutData.exercises.length
      });
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutsAPI.delete(id);
        await fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      strength: 'primary',
      cardio: 'secondary',
      hiit: 'error',
      flexibility: 'success',
      sports: 'warning'
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return <Typography>Loading workouts...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Workouts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          New Workout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workouts.map((workout) => (
          <Grid item xs={12} md={6} key={workout._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {workout.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingWorkout(workout);
                        setFormOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteWorkout(workout._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Chip
                  label={workout.type}
                  color={getTypeColor(workout.type)}
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Duration: {workout.duration} minutes
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Calories: {workout.caloriesBurned}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Exercises: {workout.exercises.length}
                </Typography>
                
                {workout.notes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {workout.notes}
                  </Typography>
                )}
                
                <Typography variant="caption" color="textSecondary">
                  {new Date(workout.date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {workouts.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <ExerciseIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No workouts yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Start tracking your workouts to see them here.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Create Your First Workout
          </Button>
        </Box>
      )}

      <WorkoutForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingWorkout(null);
        }}
        workout={editingWorkout}
        onSubmit={handleCreateWorkout}
      />
    </Box>
  );
};

export default Workouts;
