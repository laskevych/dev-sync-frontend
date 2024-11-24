import React from 'react';
import { logout } from './store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Button, Avatar, IconButton, Container, Box, Drawer, MenuItem, Divider, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import WebhookIcon from '@mui/icons-material/Webhook';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostAddIcon from "@mui/icons-material/PostAdd";

function Header() {
    const { authToken, user } = useSelector((state) => state.user);
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                mt: 'calc(var(--template-frame-height, 0px) + 30px)',
                backgroundImage: 'none',
                bgcolor: 'transparent'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar variant="dense" disableGutters sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backdropFilter: 'blur(50px)',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                    border: '1px solid',
                    padding: '10px 10px'
                }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <WebhookIcon color="success" fontSize="large"/>
                        <Box sx={{ display: { xs: 'none', md: 'flex', gap: 10} }}>
                            <Button variant="text" color="success" size="small" sx={{textTransform: 'none'}} component={RouterLink} to={`/`}>
                                DevSync
                            </Button>
                            {authToken && user && (
                                <Box>
                                    <Button size="small" fullWidth variant="contained" color="success" startIcon={<PostAddIcon />} component={RouterLink} to="/posts/create">
                                        Add post
                                    </Button>
                                </Box>
                            )}
                            {authToken && user?.role === 'admin' && (
                                <Box>
                                    <Button variant="text" color="primary" target="_blank" size="small" href="http://localhost:8080/admin" startIcon={<ManageAccountsIcon fontSize="large" color="primary"/>}>
                                        Admin Panel
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 3,
                            alignItems: 'center',
                        }}
                    >
                    {authToken && user ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                <IconButton component={RouterLink} to={`/users/${user.id}`} sx={{ p: 0 }}>
                                    <Avatar alt={user.login} src={`http://localhost:8080/profile-pictures/${user.profilePicture}`} />
                                </IconButton>
                                <Typography variant="body2" sx={{ml: 1, color: "white"}}>
                                    {user.fullName || user.login}
                                </Typography>
                                <IconButton onClick={handleLogout} color="success">
                                    <LogoutIcon />
                                </IconButton>
                            </Box>
                        </>
                        ) : (
                        <>
                            <Button color="success" variant="text" size="small" component={RouterLink} to={`/log-in/`}>
                                Log in
                            </Button>
                            <Button color="success" variant="contained" size="small" component={RouterLink} to={`/join/`}>
                                Join
                            </Button>
                        </>
                        )}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: 'var(--template-frame-height, 0px)',
                                },
                            }}
                        >
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                    </IconButton>
                                </Box>

                                <MenuItem component={RouterLink} to={`/`}>Posts</MenuItem>
                                {authToken && user && (
                                    <MenuItem component={RouterLink} to="/posts/create"><PostAddIcon /> Add post</MenuItem>
                                )}
                                {authToken && user?.role === 'admin' && (
                                    <MenuItem href="http://localhost:8080/admin" target="_blank">Admin Panel</MenuItem>
                                )}
                                <Divider sx={{ my: 3 }} />
                                {authToken && user ? (
                                    <>
                                        <MenuItem component={RouterLink} to={`/users/${user.id}`} onClick={toggleDrawer(false)} sx={{color: "black"}}>
                                            <Avatar alt={user.login} src={`http://localhost:8080/profile-pictures/${user.profilePicture}`} sx={{ mr: 1 }} />
                                            {user.fullName || user.login}
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout} sx={{color: "black"}}>
                                            <LogoutIcon sx={{ mr: 1 }} />
                                            Logout
                                        </MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem>
                                            <Button color="success" variant="contained" fullWidth component={RouterLink} to="/join" onClick={toggleDrawer(false)}>
                                                Join
                                            </Button>
                                        </MenuItem>
                                        <MenuItem>
                                            <Button color="success" variant="outlined" fullWidth component={RouterLink} to="/log-in" onClick={toggleDrawer(false)}>
                                                Log in
                                            </Button>
                                        </MenuItem>
                                    </>
                                )}
                            </Box>
                        </Drawer>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;