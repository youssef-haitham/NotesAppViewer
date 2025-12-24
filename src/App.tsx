import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setUser, setLoading, clearUser } from './store/slices/authSlice';
import { getCurrentUser } from './services/authService';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { ROUTES } from './utils/constants';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        dispatch(setUser(user));
      } catch (error) {
        // User not authenticated, clear any existing auth state
        dispatch(clearUser());
        dispatch(setLoading(false));
      }
      // Note: setUser already sets isLoading to false, so we only need to set it in catch
    };

    checkAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            ) : isAuthenticated ? (
              <Navigate to={ROUTES.NOTES} replace />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route
          path={ROUTES.NOTES}
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.NOTE_DETAIL(':id')}
          element={
            <ProtectedRoute>
              <NoteDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={`${ROUTES.NOTE_DETAIL(':id')}/edit`}
          element={
            <ProtectedRoute>
              <NoteDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
