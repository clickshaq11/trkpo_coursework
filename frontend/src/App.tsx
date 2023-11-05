import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { router } from '@/config/routes';
import './App.scss';
import queryClient from '@/api/react-query';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
