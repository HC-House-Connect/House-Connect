import { Session } from '@supabase/supabase-js';
import { z } from 'zod';

// * Email 로그인 검증 및 타입
export const EmailAuth = z.object({
  email: z
    .string({ required_error: '이메일을 입력해주세요.' })
    .email({ message: '올바른 이메일 형식이 아닙니다.' }),
  password: z
    .string({ required_error: '암호를 입력해주세요.' })
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' }),
});

export type EmailAuthType = z.infer<typeof EmailAuth>;

// * 미인증 유저가 로그인 할 경우 인증할 때 사용할 타입
export const VerifyEmail = EmailAuth.pick({ email: true }).extend({
  token: z
    .string({ required_error: '인증번호을 입력해주세요' })
    .length(6, { message: '인증번호는 6자입니다.' }),
});
export type VerifyEmailType = z.infer<typeof VerifyEmail>;

// * 추가 과정(API)이 필요한 데이터 타입
const UserAdditional = z.object({
  birth: z.number().optional(),
  gender: z.number().optional(),
});
export type UserAdditionalType = z.infer<typeof UserAdditional>;

// * SignUp Info 페이지 타입
// * birth, gender는 자체 제작 SignUp 페이지에서는 필수 필드
export const SignUpInfo = z.object({
  name: z
    .string({ required_error: '필수 입력 사항입니다.' })
    .min(2, { message: '최소 2글자 이상 입력해주세요.' }),
  birth: z.coerce
    .string({ required_error: '필수 입력 사항입니다.' })
    .length(6, { message: '6자리를 입력해주세요.' })
    .regex(/^\d+$/, {
      message: '숫자만 입력 가능합니다.',
    })
    .refine(
      data => {
        const dataYear = data.slice(0, 2);
        const dataMonth = data.slice(2, 4);
        const dataDay = data.slice(4, 6);
        const dateToCompare = `${dataYear}-${dataMonth}-${dataDay}`;
        const currentYear = new Date().getUTCFullYear() - 2000;
        // * 입력한 날짜가 유효한 날짜인지 비교하여 반환
        // * false가 나올 시 문제가 없고 true일 경우 에러
        return Number(dataYear) > currentYear
          ? !Number.isNaN(new Date(`19${dateToCompare}`).getDay())
          : !Number.isNaN(new Date(`20${dateToCompare}`).getDay());
      },
      { message: '유효하지 않은 날짜입니다.' },
    )
    .transform(data => Number(data)),
  gender: z
    .string({ required_error: '필수 입력 사항입니다.' })
    .length(1, { message: '숫자를 입력해주세요.' })
    .regex(/^[1-4]$/, {
      message: '유효하지 않은 입력입니다.',
    })
    .transform(data => Number(data)),
});
export type SignUpInfoType = z.infer<typeof SignUpInfo>;

// * SignUp Email 페이지 타입
export const PasswordValidate = z
  .string({ required_error: '비밀번호를 입력해주세요.' })
  .min(8, {
    message: '영문, 숫자, 특수기호를 포함하여 8자리 이상 입력해주세요.',
  })
  .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/, {
    message: '영문, 숫자, 특수기호를 포함하여 8자리 이상 입력해주세요.',
  });
export const SignUpEmail = z
  .object({
    email: z
      .string({ required_error: '필수 입력 사항입니다.' })
      .email({ message: '이메일 형식으로 입력해주세요.' }),
    password: PasswordValidate,
    confirmPassword: PasswordValidate,
    token: z
      .string({ required_error: '인증번호을 입력해주세요' })
      .length(6, { message: '인증번호는 6자입니다.' })
      .optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });
export type SignUpEmailType = z.infer<typeof SignUpEmail>;

// * 상태로 관리할 User 의 타입
export type UserType = UserAdditionalType & {
  avatar: string;
  email: string;
  id: string;
  name: string;
  nickname: string | null;
  status: number;
};

// * 로그인 후 LocalStorage 타입
export type UserLocalStorageType = Session;

// * Social 종류
export type SocialType = 'kakao' | 'google';

// * Kakao API 요청 시 반환타입
export type KakaoOAuthType = {
  id: number;
  connected_at: string;
  synched_at: string;
  kakao_account: {
    has_birthyear: boolean;
    birthyear_needs_agreement: boolean;
    birthyear: string;
    has_birthday: boolean;
    birthday_needs_agreement: boolean;
    birthday: string;
    birthday_type: string;
    has_gender: boolean;
    gender_needs_agreement: boolean;
    gender: string;
  } | null;
};

// * Google API 요청 시 반환타입
export type GoogleOAuthType = {
  resourceName: string;
  etag: string;
  genders: [
    {
      metadata: {
        primary: boolean;
        source: {
          type: string;
          id: string;
        };
      };
      value: string;
      formattedValue: string;
    },
  ];
  birthdays: [
    {
      metadata: {
        primary: boolean;
        source: {
          type: string;
          id: string;
        };
      };
      date: {
        year: number;
        month: number;
        day: number;
      };
    },
    {
      metadata: {
        source: {
          type: string;
          id: string;
        };
      };
      date: {
        year: number;
        month: number;
        day: number;
      };
    },
  ];
};

export const SignPasswordReset = z.object({
  email: z
    .string({ required_error: '이메일을 입력해주세요.' })
    .email({ message: '이메일 형식으로 입력해주세요.' }),
});

export type SignPasswordResetType = z.infer<typeof SignPasswordReset>;

export const SignUpdatePassword = z
  .object({
    password: PasswordValidate,
    confirmPassword: PasswordValidate,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignUpdatePasswordType = z.infer<typeof SignUpdatePassword>;
