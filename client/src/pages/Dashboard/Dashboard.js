import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  MonitorHeart,
  TrendingUp,
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { workoutsAPI, nutritionAPI, healthMetricsAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </Box>
        <Box sx={{ color: color }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [workoutStats, setWorkoutStats] = useState(null);
  const [nutritionStats, setNutritionStats] = useState(null);
  const [healthTrends, setHealthTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [workoutsRes, nutritionRes, healthRes] = await Promise.all([
        workoutsAPI.getStats(),
        nutritionAPI.getStats(),
        healthMetricsAPI.getTrends({ days: 7 }),
      ]);

      setWorkoutStats(workoutsRes.data);
      setNutritionStats(nutritionRes.data);
      setHealthTrends(healthRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const weightChartData = {
    labels: healthTrends?.weightTrends?.map(item => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: healthTrends?.weightTrends?.map(item => item.weight) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const nutritionChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          nutritionStats?.summary?.totalProtein || 0,
          nutritionStats?.summary?.totalCarbs || 0,
          nutritionStats?.summary?.totalFat || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Workouts"
            value={workoutStats?.summary?.totalWorkouts || 0}
            subtitle="This month"
            icon={<FitnessCenter sx={{ fontSize: 40 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Calories Burned"
            value={workoutStats?.summary?.totalCaloriesBurned || 0}
            subtitle="Total"
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Nutrition Entries"
            value={nutritionStats?.summary?.totalEntries || 0}
            subtitle="This week"
            icon={<Restaurant sx={{ fontSize: 40 }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg BMI"
            value={healthTrends?.latestMetrics?.bmi?.toFixed(1) || 'N/A'}
            subtitle="Current"
            icon={<MonitorHeart sx={{ fontSize: 40 }} />}
            color="#d32f2f"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weight Trend (Last 7 days)
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

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Macronutrient Distribution
            </Typography>
            <Doughnut 
              data={nutritionChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
