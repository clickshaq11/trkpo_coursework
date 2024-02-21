import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { routes } from '@/config/routes';

const createWrapper = () => {
  const queryClient = new QueryClient();
  const router = createMemoryRouter(routes, {
    initialEntries: ['/me'],
  });

  return {
    wrapper: (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    ),
    router,
  };
};

export { createWrapper };
