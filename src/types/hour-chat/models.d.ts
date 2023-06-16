import { MODEL_NAME } from '../../shares/models';
import {
  DeviceTokenModel,
  BaseDeviceTokenModel,
} from '../../components/device-tokens/models/attributes';
import {
  EmailOtpModel,
  BaseEmailOtpModel,
} from '../../components/email-otps/models/attributes';
import {
  EmailModel,
  BaseEmailModel,
} from '../../components/emails/models/attributes';
import {
  UserLocationModel,
  BaseUserLocationModel,
} from '../../components/user-locations/models/attributes';
import {
  UserModel,
  BaseUserModel,
} from '../../components/users/models/attributes';

export type BaseModel = {
  [MODEL_NAME.DEVICE_TOKENS]: BaseDeviceTokenModel;
  [MODEL_NAME.EMAILS]: BaseEmailModel;
  [MODEL_NAME.EMAIL_OTPS]: BaseEmailOtpModel;
  [MODEL_NAME.USERS]: BaseUserModel;
  [MODEL_NAME.USER_LOCATIONS]: BaseUserLocationModel;
};

export type ModelStatic = {
  [MODEL_NAME.DEVICE_TOKENS]: DeviceTokenModel;
  [MODEL_NAME.EMAILS]: EmailModel;
  [MODEL_NAME.EMAIL_OTPS]: EmailOtpModel;
  [MODEL_NAME.USERS]: UserModel;
  [MODEL_NAME.USER_LOCATIONS]: UserLocationModel;
};
