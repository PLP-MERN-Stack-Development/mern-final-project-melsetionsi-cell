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
  Restaurant as FoodIcon,
} from '@mui/icons-material';
import { nutritionAPI } from '../../services/api';

const NutritionForm = ({ open, onClose, nutrition, onSubmit }) => {
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    foodItems: [],
    date: new Date().toISOString().split('T')[0],
    notes: '',
    ...nutrition
  });

  const [foodItem, setFoodItem] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    quantity: 1,
    unit: 'serving'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addFoodItem = () => {
    if (foodItem.name) {
      setFormData({
        ...formData,
        foodItems: [...formData.foodItems, foodItem]
      });
      setFoodItem({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        quantity: 1,
        unit: 'serving'
      });
    }
  };

  const removeFoodItem = (index) => {
    const newFoodItems = formData.foodItems.filter((_, i) => i !== index);
    setFormData({ ...formData, foodItems: newFoodItems });
  };

  const calculateTotals = () => {
    return formData.foodItems.reduce((totals, item) => ({
      calories: totals.calories + (item.calories * item.quantity),
      protein: totals.protein + (item.protein * item.quantity),
      carbs: totals.carbs + (item.carbs * item.quantity),
      fat: totals.fat + (item.fat * item.quantity),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {nutrition ? 'Edit Nutrition Entry' : 'Add Nutrition Entry'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={formData.mealType}
                  label="Meal Type"
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                >
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                  <MenuItem value="snack">Snack</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Food Items
              </Typography>
              
              {/* Add Food Item Form */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Food Name"
                      value={foodItem.name}
                      onChange={(e) => setFoodItem({ ...foodItem, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Calories"
                      value={foodItem.calories}
                      onChange={(e) => setFoodItem({ ...foodItem, calories: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Protein"
                      value={foodItem.protein}
                      onChange={(e) => setFoodItem({ ...foodItem, protein: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Carbs"
                      value={foodItem.carbs}
                      onChange={(e) => setFoodItem({ ...foodItem, carbs: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Fat"
                      value={foodItem.fat}
                      onChange={(e) => setFoodItem({ ...foodItem, fat: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      value={foodItem.quantity}
                      onChange={(e) => setFoodItem({ ...foodItem, quantity: parseInt(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Button onClick={addFoodItem} variant="outlined">
                      Add Food
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Food Items List */}
              {formData.foodItems.length > 0 && (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Food</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Protein</TableCell>
                        <TableCell align="right">Carbs</TableCell>
                        <TableCell align="right">Fat</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.foodItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.calories * item.quantity}</TableCell>
                          <TableCell align="right">{item.protein * item.quantity}g</TableCell>
                          <TableCell align="right">{item.carbs * item.quantity}g</TableCell>
                          <TableCell align="right">{item.fat * item.quantity}g</TableCell>
                          <TableCell align="right">{item.quantity} {item.unit}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeFoodItem(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>{totals.calories}</strong></TableCell>
                        <TableCell align="right"><strong>{totals.protein}g</strong></TableCell>
                        <TableCell align="right"><strong>{totals.carbs}g</strong></TableCell>
                        <TableCell align="right"><strong>{totals.fat}g</strong></TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
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
            {nutrition ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Nutrition = () => {
  const [nutritionEntries, setNutritionEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    fetchNutritionEntries();
  }, []);

  const fetchNutritionEntries = async () => {
    try {
      const response = await nutritionAPI.getAll();
      setNutritionEntries(response.data.data);
    } catch (error) {
      console.error('Error fetching nutrition entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (nutritionData) => {
    try {
      if (editingEntry) {
        await nutritionAPI.update(editingEntry._id, nutritionData);
      } else {
        await nutritionAPI.create(nutritionData);
      }
      await fetchNutritionEntries();
      setFormOpen(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving nutrition entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await nutritionAPI.delete(id);
        await fetchNutritionEntries();
      } catch (error) {
        console.error('Error deleting nutrition entry:', error);
      }
    }
  };

  const getMealTypeColor = (type) => {
    const colors = {
      breakfast: 'primary',
      lunch: 'secondary',
      dinner: 'error',
      snack: 'warning'
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return <Typography>Loading nutrition entries...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Nutrition</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Add Entry
        </Button>
      </Box>

      <Grid container spacing={3}>
        {nutritionEntries.map((entry) => (
          <Grid item xs={12} md={6} key={entry._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                    </Typography>
                    <Chip
                      label={entry.mealType}
                      color={getMealTypeColor(entry.mealType)}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingEntry(entry);
                        setFormOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(entry._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Total Calories: {entry.totalCalories}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Protein: {entry.totalProtein}g | Carbs: {entry.totalCarbs}g | Fat: {entry.totalFat}g
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Items: {entry.foodItems.length}
                </Typography>

                {entry.notes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {entry.notes}
                  </Typography>
                )}

                <Typography variant="caption" color="textSecondary">
                  {new Date(entry.date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {nutritionEntries.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <FoodIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No nutrition entries yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Start tracking your meals to see them here.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Your First Entry
          </Button>
        </Box>
      )}

      <NutritionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEntry(null);
        }}
        nutrition={editingEntry}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Nutrition;
