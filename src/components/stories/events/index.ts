import { z } from 'zod';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import schema from '../../../shares/schema';
import Firebase from '../../../shares/Firebase';
import ENVIRONMENT from '../../../config/environment';

const storyBasePath = ENVIRONMENT.STORY_BASE_PATH;

export function createUserStory(
  payload: z.infer<(typeof schema.stories)['createStorySchema']> & {
    userId: number;
  }
) {
  const timestamp = Timestamp.now();

  const storyData: HourChat.Firestore.BaseStory = {
    ...payload,
    likes: [] as number[],
    dislikes: [] as number[],
    timestamp,
  };

  const { firestore } = Firebase.instance;

  return firestore.collection(`${storyBasePath}/story/users`).add(storyData);
}

export function updateUserStory(
  uuid: string,
  payload: Partial<z.infer<(typeof schema.stories)['createStorySchema']>>
) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${uuid}`).set(payload, {
    merge: true,
  });
}

export async function getUserStoryByuuid(uuid: string) {
  const doc = await Firebase.instance.firestore
    .doc(`${storyBasePath}/story/users/${uuid}`)
    .get();
  const data = doc.data() as HourChat.Firestore.BaseStory | undefined;

  if (!data) return;

  return data;
}

export function likeUserStory(uuid: string, userId: number) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${uuid}`).set(
    {
      likes: FieldValue.arrayUnion(userId),
      dislikes: FieldValue.arrayRemove(userId),
    },
    {
      merge: true,
    }
  );
}

export function dislikeUserStory(uuid: string, userId: number) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${uuid}`).set(
    {
      likes: FieldValue.arrayRemove(userId),
      dislikes: FieldValue.arrayUnion(userId),
    },
    {
      merge: true,
    }
  );
}

export function deleteUserStory(uuid: string) {
  const { firestore } = Firebase.instance;

  return firestore.doc(`${storyBasePath}/story/users/${uuid}`).delete();
}
