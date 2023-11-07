import { PostEntity, PostPageEntity } from '@/types/posts';
import { Notification } from '@/types/notifications';
import { MyProfileEntity, ProfileEntity, Subscription } from '@/types/profiles';
import { Comment } from '@/types/comments';

const fakeNewsFeedPosts: PostEntity[] = [
  {
    id: 1,
    title: 'Title',
    body: 'BIIIIIIIIIIIIIIIIIIG BOOOOOOOOOOOOOOOOOOODY',
    authorId: 1,
    authorLogin: 'author123',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'author123',
        body: 'Автор не прав 1',
      },
      {
        id: 2,
        authorLogin: 'author122',
        body: 'ш92уотагывтгаптгвытпгтвгыпгвыпв',
      },
      {
        id: 3,
        authorLogin: 'author121',
        body: 'ылтвпгивынгитпгнвитыгптвгштгшптьывш',
      },
    ],
  },
  {
    id: 2,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 3,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 4,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 5,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 6,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 2,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 3,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 7,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 2,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 3,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 8,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 2,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 3,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 9,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 2,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 3,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 10,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 2,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 3,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
  {
    id: 11,
    title: 'string',
    body: 'string',
    authorId: 1,
    authorLogin: 'string',
    createdAt: 11111111111,
    likeCounter: 1,
    hitLike: true,
    firstComments: [
      {
        id: 1,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 2,
        authorLogin: 'string',
        body: 'string',
      },
      {
        id: 3,
        authorLogin: 'string',
        body: 'string',
      },
    ],
  },
];

const fakeNotifications: Notification[] = [
  {
    id: 1,
    postId: 1,
  },
  {
    id: 2,
    postId: 2,
  },
  {
    id: 3,
    postId: 3,
  },
];

const fakeProfiles: ProfileEntity[] = [
  {
    id: 1,
    login: 'login1',
    shortInfo: 'asoifdjisafisauifuisanuifnuisnafuis',
    subscribed: false,
  },
  {
    id: 2,
    login: 'login2',
    shortInfo: 'asoifdjisafisauifuisanuifnuisnafuissadsads',
    subscribed: true,
  },
  {
    id: 3,
    login: 'login2',
    shortInfo: 'asoifdjisafisauifuisanuifnuisnafuissadsads',
    subscribed: true,
  },
  {
    id: 4,
    login: 'login2',
    shortInfo: 'asoifdjisafisauifuisanuifnuisnafuissadsads',
    subscribed: true,
  },
  {
    id: 5,
    login: 'login2',
    shortInfo: 'asoifdjisafisauifuisanuifnuisnafuissadsads',
    subscribed: true,
  },
  {
    id: 6,
    login: 'login2',
    shortInfo: 'asoifdjisafisauifuisanuifnuisnafuissadsads',
    subscribed: true,
  },
];

const myFakeSubscriptions: Subscription[] = [
  { id: 1, login: 'asudbuasd' },
  { id: 2, login: 'asudbuasd' },
  { id: 3, login: 'asudbuasd' },
  { id: 4, login: 'asudbuasd' },
  { id: 5, login: 'asudbuasd' },
  { id: 6, login: 'asudbuasd' },
  { id: 7, login: 'asudbuasd' },
  { id: 8, login: 'asudbuasd' },
  { id: 9, login: 'asudbuasd' },
  { id: 10, login: 'asudbuasd' },
  { id: 11, login: 'asudbuasd' },
  { id: 12, login: 'asudbuasd' },
  { id: 13, login: 'asudbuasd' },
  { id: 14, login: 'asudbuasd' },
];

const myFakeProfile: MyProfileEntity = {
  login: 'mycoollogin123',
  shortInfo: 'Краткая информация обо мне',
  subcriptions: myFakeSubscriptions,
};

const myFakePosts: PostEntity[] = fakeNewsFeedPosts;

const fakeProfile: ProfileEntity = {
  id: 1,
  login: 'mycoollogin1',
  shortInfo: 'Краткая информация обо мне',
  subscribed: true,
};

const fakePost: PostPageEntity = {
  title: 'Заголовок поста',
  body: 'Оскароносный Уилл Смит действительно мастер на все руки в индустрии развлечений: его актёрское портфолио насчитывает под сотню работ. А ещё он талантливый рэпер и дальновидный продюсер. Его впечатляющая карьера началась в середине 1980-х, когда будущий актёр был половиной хип-хоп-дуэта DJ Jazzy Jeff & the Fresh Prince, который первый из рэперских тандемов получил «Грэмми». После музыкального триумфа Смит отправился покорять Голливуд, и в 2022 году американские киноакадемики оценили его талант, вручив первый «Оскар». Один из рецептов успеха актёра — он не боится сниматься в самых разнообразных жанрах и фильмах. Какие из них получились главными у Смита — смотрите в этой подборке Фильм Про.',
  createdAt: 101212212,
  authorId: 1,
  authorLogin: 'ivanov123',
  likeCounter: 2,
  hitLike: false,
  isAuthor: true,
};

const fakeComments: Comment[] = [
  {
    id: 1,
    authorLogin: 'string',
    body: 'string',
  },
];

export {
  fakeNewsFeedPosts,
  fakeNotifications,
  fakeProfiles,
  myFakeProfile,
  myFakeSubscriptions,
  myFakePosts,
  fakeProfile,
  fakePost,
  fakeComments,
};
