import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: Timestamp;
}

const postsCollection = collection(db, 'posts');

export const createPost = async (
  title: string,
  content: string,
  author: string,
  authorId: string
): Promise<string> => {
  const docRef = await addDoc(postsCollection, {
    title,
    content,
    author,
    authorId,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
};

export const updatePost = async (
  postId: string,
  title: string,
  content: string
): Promise<void> => {
  const postDoc = doc(db, 'posts', postId);
  await updateDoc(postDoc, {
    title,
    content,
  });
};

export const deletePost = async (postId: string): Promise<void> => {
  const postDoc = doc(db, 'posts', postId);
  await deleteDoc(postDoc);
};

export const subscribeToPosts = (
  callback: (posts: Post[]) => void
): (() => void) => {
  const q = query(postsCollection, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const posts: Post[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Post));
    callback(posts);
  });
};

