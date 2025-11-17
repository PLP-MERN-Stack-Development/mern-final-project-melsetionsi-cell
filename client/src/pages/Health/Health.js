import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Delete as DeleteIcon,
  MonitorHeart as HealthIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { healthMetricsAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HealthMetricsForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    heartRate: '',
    bloodPressure: { systolic: '', diastolic: '' },
    sleepDuration: '',
    steps: '',
    waterIntake: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string values to numbers
    const processedData = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
      sleepDuration: formData.sleepDuration ? parseFloat(formData.sleepDuration) : undefined,
      steps: formData.steps ? parseInt(formData.steps) : undefined,
      waterIntake: formData.waterIntake ? parseFloat(formData.waterIntake) : undefined,
    };

    onSubmit(processedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Health Metrics</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Weight (kg)"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                inputProps={{ step: "0.1" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Height (cm)"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Heart Rate (bpm)"
                value={formData.heartRate}
                onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Sleep Duration (hours)"
                value={formData.sleepDuration}
                onChange={(e) => setFormData({ ...formData, sleepDuration: e.target.value })}
                inputProps={{ step: "0.1", min: "0", max: "24" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Steps"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Water Intake (liters)"
                value={formData.waterIntake}
                onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                inputProps={{ step: "0.1" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Blood Pressure (Systolic)"
                value={formData.bloodPressure.systolic}
                onChange={(e) => setFormData({
                  ...formData,
                  bloodPressure: { ...formData.bloodPressure, systolic: e.target.value }
                })}
                placeholder="120"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Blood Pressure (Diastolic)"
                value={formData.bloodPressure.diastolic}
                onChange={(e) => setFormData({
                  ...formData,
                  bloodPressure: { ...formData.bloodPressure, diastolic: e.target.value }
                })}
                placeholder="80"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save Metrics
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Health = () => {
  const [metrics, setMetrics] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const [metricsRes, trendsRes] = await Promise.all([
        healthMetricsAPI.getAll({ limit: 10 }),
        healthMetricsAPI.getTrends({ days: 30 }),
      ]);

      setMetrics(metricsRes.data.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (metricsData) => {
    try {
      await healthMetricsAPI.create(metricsData);
      await fetchHealthData();
      setFormOpen(false);
    } catch (error) {
      console.error('Error saving health metrics:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete these metrics?')) {
      try {
        await healthMetricsAPI.delete(id);
        await fetchHealthData();
      } catch (error) {
        console.error('Error deleting health metrics:', error);
      }
    }
  };

  const weightChartData = {
    labels: trends?.weightTrends?.map(item => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: trends?.weightTrends?.map(item => item.weight) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const bmiChartData = {
    labels: trends?.bmiTrends?.map(item => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'BMI',
        data: trends?.bmiTrends?.map(item => item.bmi) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <Typography>Loading health metrics...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Health Metrics</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Add Metrics
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weight Trend
            </Typography>
            <Line 
              data={weightChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              BMI Trend
            </Typography>
            <Line 
              data={bmiChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Recent Metrics Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Metrics
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Weight (kg)</TableCell>
                    <TableCell align="right">Height (cm)</TableCell>
                    <TableCell align="right">BMI</TableCell>
                    <TableCell align="right">Heart Rate</TableCell>
                    <TableCell align="right">Sleep (hrs)</TableCell>
                    <TableCell align="right">Steps</TableCell>
                    <TableCell align="right">Water (L)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric._id}>
                      <TableCell>
                        {new Date(metric.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">{metric.weight || '-'}</TableCell>
                      <TableCell align="right">{metric.height || '-'}</TableCell>
                      <TableCell align="right">{metric.bmi || '-'}</TableCell>
                      <TableCell align="right">{metric.heartRate || '-'}</TableCell>
                      <TableCell align="right">{metric.sleepDuration || '-'}</TableCell>
                      <TableCell align="right">{metric.steps || '-'}</TableCell>
                      <TableCell align="right">{metric.waterIntake || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(metric._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {metrics.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <HealthIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No health metrics yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Start tracking your health metrics to see trends and insights.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Your First Metrics
          </Button>
        </Box>
      )}

      <HealthMetricsForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Health;
