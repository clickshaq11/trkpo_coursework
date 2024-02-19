import { EditableContent, PostEntity, PostPageEntity } from '@/types/posts';
import { Notification } from '@/types/notifications';
import {
  EditProfileEntity,
  MyProfileEntity,
  ProfileEntity,
} from '@/types/profiles';
import { PaginationParams } from '@/types/pages';
import { Comment } from '@/types/comments';

const posts: PostEntity[] = [
  {
    id: 1,
    title: 'title',
    body: 'body',
    authorId: 1,
    authorLogin: '123',
    createdAt: 12312312321,
    likeCounter: 0,
    hitLike: true,
    firstComments: [],
  },
];

const notifications: Notification[] = [
  {
    id: 1,
    postId: 1,
  },
];

const profiles: ProfileEntity[] = [
  {
    id: 1,
    shortInfo: '',
    subscribed: false,
    login: 'login',
  },
];

const myProfile: MyProfileEntity = {
  login: '123',
  shortInfo: '123',
  subscriptions: [],
};

const pagination: PaginationParams = {
  order: 'asc',
  page: 0,
  size: 0,
  type: 'createdAt',
};

const editProfileEntity: EditProfileEntity = {
  password: '',
  shortInfo: 'new',
};

const editPost: EditableContent = {
  body: 'body',
  title: 'title',
};

const otherProfile: ProfileEntity = {
  id: 0,
  login: '123',
  shortInfo: '123',
  subscribed: false,
};

const post: PostEntity = {
  authorId: 0,
  authorLogin: '123',
  body: '123',
  createdAt: 0,
  firstComments: [],
  hitLike: false,
  id: 0,
  likeCounter: 0,
  title: '123',
};

const comments: Comment[] = [
  {
    id: 1,
    authorLogin: '123',
    body: 'body',
  },
];

const postPage: PostPageEntity = {
  authorId: 1,
  authorLogin: 'default',
  body: 'body',
  createdAt: 1333,
  hitLike: true,
  isAuthor: true,
  likeCounter: 3,
  title: 'title',
};

export {
  posts,
  notifications,
  profiles,
  myProfile,
  pagination,
  editProfileEntity,
  otherProfile,
  post,
  comments,
  editPost,
  postPage,
};
