import { Comment } from './comments';

type PostEntity = {
  id: number;
  title: string;
  body: string;
  authorId: number;
  authorLogin: string;
  createdAt: number;
  likeCounter: number;
  hitLike: boolean;
  firstComments: Comment[];
};

type PostPageEntity = {
  title: string;
  body: string;
  createdAt: number;
  authorId: number;
  authorLogin: string;
  likeCounter: number;
  hitLike: boolean;
  isAuthor: boolean;
};

type EditableContent = Pick<PostPageEntity, 'title' | 'body'>;

export type { PostEntity, PostPageEntity, EditableContent };
