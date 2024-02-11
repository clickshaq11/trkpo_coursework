import { createBrowserRouter } from 'react-router-dom';
import { Login, Register } from '@/pages';
import { AuthLayout } from '@/components/AuthLayout';
import { DefaultLayout } from '@/components/DefaultLayout';
import { NewsFeed } from '@/pages/NewsFeed';
import { PostPage } from '@/pages/Post';
import { ProfilePage } from '@/pages/OtherProfile';
import { MyProfile } from '@/pages/MyProfile';
import { NotFound } from '@/pages/NotFound';

const routes = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <NewsFeed />,
      },
      {
        path: 'me',
        element: <MyProfile />,
      },
      {
        path: 'posts/:id',
        element: <PostPage />,
      },
      {
        path: 'profiles/:id',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

export { router, routes };
