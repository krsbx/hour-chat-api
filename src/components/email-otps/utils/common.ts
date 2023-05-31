import otpGenerator from 'otp-generator';

export function generateOtp() {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
  });
}
