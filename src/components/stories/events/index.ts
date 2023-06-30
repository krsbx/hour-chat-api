import { FieldValue } from 'firebase-admin/firestore';
import Firebase from '../../../shares/Firebase';
import ENVIRONMENT from '../../../config/environment';
import { StoryAttribute } from '../models/attributes';
import { omit } from '../../../shares/common';

const storyBasePath = ENVIRONMENT.STORY_BASE_PATH;

export function createUserStory(payload: StoryAttribute) {
  const storyData = {
    ...omit(payload, ['id']),
    likes: [] as string[],
    dislikes: [] as string[],
  };

  const { firestore } = Firebase.instance;

  return firestore
    .doc(`${storyBasePath}/story/users/${payload.id}`)
    .create(storyData);
}

export function updateUserStory(id: string, payload: Partial<StoryAttribute>) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${id}`).set(payload, {
    merge: true,
  });
}

export function likeUserStory(id: string, userId: string) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${id}`).set(
    {
      likes: FieldValue.arrayUnion(userId),
      dislikes: FieldValue.arrayRemove(userId),
    },
    {
      merge: true,
    }
  );
}

export function dislikeUserStory(id: string, userId: string) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${id}`).set(
    {
      likes: FieldValue.arrayRemove(userId),
      dislikes: FieldValue.arrayUnion(userId),
    },
    {
      merge: true,
    }
  );
}

export function deleteUserStory(id: string) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${id}`).delete();
}
