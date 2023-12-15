export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IComment = {
  id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  post: IPost;
  user: IUser;
  media?: IMedia | null;
  replied_comment_id?: string | null;
};
export type IGroup = {
  id: string;
  name: string;
  avatar?: string | null;
  users?: IUser[];
};
export type IMedia = {
  id: string;
  link: string;
  type: 'image' | 'video';
};
export type IMessage = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id?: string | null;
  group_id?: string | null;
  media_id?: string | null;
};
export type IPet = {
  id: string;
  avatar?: string | null;
  name: string;
  species: string;
  sex: string;
  breed: string;
  date_of_birth: string;
  description: string;
  owner: IUser;
};
export type IPost = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: IUser;
  media?: IMedia;
  likes?: IUser[];
  comments?: IComment[];
  group?: IGroup;
  tags?: ITag[];
};
export type IPostLike = {
  user_id: string;
  post_id: string;
};
export type IPostTag = {
  tag_id: string;
  post_id: string;
};
export type IRelationship = {
  id: string;
  isFriend: boolean;
  isBlocked: boolean;
  status: 'pending' | 'confirmed';
  isFollowing: boolean;
  userId?: string | null;
  friendId?: string | null;
};
export type ITag = {
  id: string;
  name: string;
};
export type IUserDetail = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  refresh_token?: string | null;
  avatar?: string | null;
  status: string;
  userType: 'regular' | 'admin';
  created_at: string;
  updated_at: string;
};
export type IUser = {
  id: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
};
export type IUserGroup = {
  group_id: string;
  user_id: string;
};
export type IUserHistoryTag = {
  tag_id: string;
  user_id: string;
};
