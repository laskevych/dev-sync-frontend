import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Box, Container, CssBaseline} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './AuthContext';
import GuestRoute from "./GuestRoute";
import ProtectedRoute from './ProtectedRoute';
import AuthorRoute from './AuthorRoute';
import UserOwnerRoute from './UserOwnerRoute';
import Header from "./Header";
import LogInPage from './LogInPage';
import JoinPage from './JoinPage';
import ConfirmEmailPage from './ConfirmEmailPage';
import PasswordResetRequestPage from "./PasswordResetRequestPage";
import PasswordResetConfirmPage from "./PasswordResetConfirmPage";
import MainPage from './MainPage';
import PostPage from "./PostPage";
import PostEditPage from "./PostEditPage";
import PostCreatePage from "./PostCreatePage";
import CategoryPage from "./CategoryPage";
import UserPage from "./UserPage";
import UserEditPage from "./UserEditPage";
import NotFoundPage from './NotFoundPage';
import Footer from "./Footer";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                        <Header />
                        <Container maxWidth="md" component="main" sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}>
                            <Routes>
                                <Route path="/log-in"
                                    element={
                                        <GuestRoute>
                                            <LogInPage />
                                        </GuestRoute>
                                    }
                                />
                                <Route path="/join"
                                    element={
                                        <GuestRoute>
                                            <JoinPage />
                                        </GuestRoute>
                                    }
                                />
                                <Route path="/password-reset"
                                       element={
                                           <GuestRoute>
                                               <PasswordResetRequestPage />
                                           </GuestRoute>
                                       }
                                />
                                <Route path="/password-reset/:confirm_token"
                                       element={
                                           <GuestRoute>
                                               <PasswordResetConfirmPage />
                                           </GuestRoute>
                                       }
                                />
                                <Route path="/confirm-email/:confirm_token"
                                    element={
                                        <GuestRoute>
                                            <ConfirmEmailPage />
                                        </GuestRoute>
                                    }
                                />

                                <Route path="/" element={<MainPage />} />
                                <Route path="/posts/:id" element={<PostPage />} />
                                <Route path="/categories/:id/posts" element={<CategoryPage />} />
                                <Route path="/users/:id" element={<UserPage />} />
                                <Route path="/posts/create/"
                                    element={
                                        <ProtectedRoute>
                                            <PostCreatePage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route path="/posts/:id/edit"
                                    element={
                                        <ProtectedRoute>
                                            <AuthorRoute>
                                                <PostEditPage />
                                            </AuthorRoute>
                                        </ProtectedRoute>
                                    }
                                />

                                <Route path="/users/:id/edit"
                                    element={
                                        <ProtectedRoute>
                                            <UserOwnerRoute>
                                                <UserEditPage />
                                            </UserOwnerRoute>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Container>
                        <Footer />
                    </Box>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;