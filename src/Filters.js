import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, FormControl, InputLabel, Select, MenuItem, Button, TextField, Checkbox, ListItemText, OutlinedInput, Grid2 as Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function Filters() {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [status, setStatus] = useState('');
    const [createdAtFrom, setCreatedAtStartStart] = useState('');
    const [createdAtTo, setCreatedAtStartEnd] = useState('');
    const [sortBy, setSortBy] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/categories/');
                console.log(response.data.data);
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching.', error);
            }
        };

        fetchCategories();

        const queryParams = new URLSearchParams(location.search);
        setStatus(queryParams.get('status') || '');
        setCreatedAtStartStart(queryParams.get('createdAtFrom') || '');
        setCreatedAtStartEnd(queryParams.get('createdAtTo') || '');
        setSelectedCategories(queryParams.get('categories') ? queryParams.get('categories').split(',') : []);
        setSortBy(queryParams.get('sortBy') || '');
    }, [location]);

    const handleFilterApply = () => {
        const queryParams = new URLSearchParams();

        if (status) queryParams.set('status', status);
        if (selectedCategories.length > 0) queryParams.set('categories', selectedCategories.join(','));
        if (createdAtFrom) queryParams.set('createdAtFrom', createdAtFrom);
        if (createdAtTo) queryParams.set('createdAtTo', createdAtTo);
        if (sortBy) queryParams.set('sortBy', sortBy);

        navigate(`/?${queryParams.toString()}`);
    };

    const handleFilterReset = () => {
        setStatus('');
        setSelectedCategories([]);
        setCreatedAtStartStart('');
        setCreatedAtStartEnd('');
        setSortBy('');
        navigate('/');
    };

    return (
        <Grid size={{ xs: 12, md: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                            <FormControl size="large" fullWidth>
                                <InputLabel color="success">Status</InputLabel>
                                <Select
                                    value={status}
                                    label="Status"
                                    color="success"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem color="success" value="">All</MenuItem>
                                    <MenuItem color="success" value="active">Active</MenuItem>
                                    <MenuItem color="success" value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
                            <FormControl size="large" fullWidth>
                                <InputLabel color="success">Categories</InputLabel>
                                <Select color="success"
                                        multiple
                                        value={selectedCategories}
                                        onChange={(e) => setSelectedCategories(e.target.value)}
                                        input={<OutlinedInput label="Categories" />}
                                        renderValue={(selected) =>
                                            categories
                                                .filter((cat) => selected.includes(String(cat.id)))
                                                .map((cat) => cat.title)
                                                .join(', ')
                                        }
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={String(category.id)} color="success">
                                            <Checkbox checked={selectedCategories.includes(String(category.id))} color="success" />
                                            <ListItemText primary={category.title} color="success"/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                            <FormControl color="success" size="small" fullWidth>
                                <TextField
                                    color="success"
                                    label="Publish Date From"
                                    type="date"
                                    value={createdAtFrom}
                                    onChange={(e) => setCreatedAtStartStart(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl color="success" size="small" fullWidth>
                                <TextField
                                    label="Publish Date To"
                                    type="date"
                                    value={createdAtTo}
                                    color="success"
                                    onChange={(e) => setCreatedAtStartEnd(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <FormControl size="large" fullWidth>
                                <InputLabel color="success">Sorting</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    color="success"
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem color="success" value="">Empty</MenuItem>
                                    <MenuItem color="success" value="likes:asc">Likes - ASC</MenuItem>
                                    <MenuItem color="success" value="likes:desc">Likes - DESC</MenuItem>
                                    <MenuItem color="success" value="createdAt:asc">Publish Date - ASC</MenuItem>
                                    <MenuItem color="success" value="createdAt:desc">Publish Date - DESC</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button fullWidth variant="contained" color="success" onClick={handleFilterApply}>Apply</Button>
                    <Button fullWidth variant="outlined" color="success" onClick={handleFilterReset}>Reset</Button>
                </Box>
            </Box>
        </Grid>
    );
}

export default Filters;