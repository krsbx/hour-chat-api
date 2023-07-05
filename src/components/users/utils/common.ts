import _ from 'lodash';
import { UserAttribute } from '../models/attributes';

export function createFullName(user: UserAttribute | null) {
  return _([user?.firstName, user?.middleName, user?.lastName])
    .map(_.trim)
    .compact()
    .join(' ');
}
