// Contains a routes that can be reused in /groups routes

import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';
import groupMiddlewares from '../../groups/middlewares';

export const createGroupRoute = [
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateCreateGroupMessagePayloadMw,
  middlewares.common.validateGroupMemberMw,
  middlewares.read.checkGroupMessageUsersExistsMw,
  middlewares.create.createGroupMessageGroupMw,
];

export const sendGroupMessageRoute = [
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateGroupMessagePayloadMw,
  middlewares.common.validateSenderPayloadMw,
  middlewares.read.checkGroupExistsMw,
  groupMiddlewares.common.validateUserAccessMw,
  middlewares.create.sendGroupMessageMw,
];

export const groupTypingRoute = [
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateGroupMessageTypingPayloadMw,
  middlewares.common.validateSenderPayloadMw,
  middlewares.read.checkGroupExistsMw,
  groupMiddlewares.common.validateUserAccessMw,
  middlewares.update.updateGroupMessageTypingMw,
];

export const modifyMemberRoute = [
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateModifyGroupMemberPayloadMw,
  middlewares.common.validateSenderPayloadMw,
  middlewares.read.checkGroupExistsMw,
  groupMiddlewares.common.validateUserAccessMw,
  middlewares.update.modifyGroupMemberMw,
];
