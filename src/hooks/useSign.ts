import { useMutation } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  Subscription,
} from '@supabase/supabase-js';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/libs/supabaseClient';
import {
  IsInitializingSession,
  IsNotVerifiedAtom,
  SessionAtom,
  UserAtom,
} from '@/stores/auth.store';
import {
  EmailAuthType,
  GoogleOAuthType,
  KakaoOAuthType,
  SocialType,
  UserAdditionalType,
  UserType,
  VerifyEmailType,
} from '@/types/auth.type';
import { fetchGet } from '@/libs/fetch';
import { createToast, errorToast, successToast } from '@/libs/toast';
import { ShowVerificationAtom, SignUpEmailUserAtom } from '@/stores/sign.store';

const preProcessingUserData = (
  data: AuthTokenResponsePassword | AuthResponse,
): UserType | undefined => {
  if (data.data.user?.email) {
    const { email, id } = data.data.user;
    const { gender, avatar, birth, name, nickname, status } =
      data.data.user.user_metadata;
    return {
      gender,
      avatar,
      birth,
      name,
      nickname,
      email,
      id,
      status,
    };
  }
  throw new Error(data.error?.message);
};

const parseUserFromSession = (session: Session | null): UserType | null => {
  if (!session) return null;
  const { email, id } = session.user;
  const { gender, avatar, avatar_url, birth, name, nickname, status } =
    session.user.user_metadata;

  return {
    id,
    name,
    nickname,
    gender,
    email,
    avatar: avatar || avatar_url,
    birth,
    status,
  } as UserType;
};

export const useSignUpEmail = () => {
  const signUpEmailValue = useRecoilValue(SignUpEmailUserAtom);
  const setShowVerification = useSetRecoilState(ShowVerificationAtom);
  const { mutate: signUpEmail, isPending: isSignUpEmail } = useMutation({
    mutationFn: async () =>
      supabase.auth.signUp({
        email: signUpEmailValue.email,
        password: signUpEmailValue.password,
        options: {
          data: {
            avatar: '',
            email: signUpEmailValue.email,
            name: signUpEmailValue.name,
            birth: signUpEmailValue.birth,
            gender: signUpEmailValue.gender,
            nickName: signUpEmailValue.name,
            status: 0,
          },
        },
      }),
    onMutate: () => createToast('signUp', '인증메일을 전송중입니다.'),
    onError: (error: AuthError) => {
      errorToast('signUp', error.message);
    },
    onSuccess: async () => {
      successToast('signUp', '📧 인증메일이 전송되었습니다.');
      setShowVerification(true);
    },
  });
  return { signUpEmail, isSignUpEmail };
};

export const useSignInEmail = () => {
  const setUser = useSetRecoilState(UserAtom);
  const setIsNotVerified = useSetRecoilState(IsNotVerifiedAtom);
  const { mutate: signInEmail, isPending: isSignInEmail } = useMutation({
    mutationFn: async (payload: EmailAuthType) =>
      supabase.auth.signInWithPassword(payload),
    onMutate: () => createToast('signin', '로그인 시도 중...'),
    onError: (error: AuthError) => {
      errorToast('signin', error.message);
      if (error.message === 'Email not confirmed') {
        setIsNotVerified(true);
      }
    },
    onSuccess: async data => {
      const payload = preProcessingUserData(data);
      // * Recoil 상태로 유저정보 등록
      if (payload) setUser(payload);
      successToast('signin', '로그인 성공!');
    },
  });
  return { signInEmail, isSignInEmail };
};

export const useVerifyEmail = ({
  mutateMessage,
  successMessage,
}: {
  [key: string]: string;
}) => {
  const setUser = useSetRecoilState(UserAtom);
  const { mutate: verifyEmail, isPending: isVerifyEmail } = useMutation({
    mutationFn: async (payload: VerifyEmailType) => {
      const { email, token } = payload;
      if (token) {
        return supabase.auth.verifyOtp({ email, token, type: 'email' });
      }
      throw new Error('토큰이 없습니다.');
    },
    onMutate: () => createToast('signin', mutateMessage),
    onSuccess: async data => {
      const payload = preProcessingUserData(data);
      // * Recoil 상태로 유저정보 등록
      if (payload) setUser(payload);
      successToast('signin', successMessage);
    },
    onError: (error: AuthError) => {
      errorToast('signin', error.message);
    },
  });
  return { verifyEmail, isVerifyEmail };
};

export const useSignInSocial = () => {
  const { mutate: signInSocial, isPending: isSignInSocial } = useMutation({
    mutationFn: async (payload: SocialType) => {
      const options = {
        kakao: {
          scopes: 'gender, birthday, birthyear',
        },
        google: {
          scopes:
            'https://www.googleapis.com/auth/user.gender.read, https://www.googleapis.com/auth/user.birthday.read',
        },
      };
      // * 강제로 에러를 발생 시킬 수 없음
      // * signInWithOAuth 내부 과정에서 에러가 발생하지 않으면 바로 SIGNED_IN 으로 이벤트 발생
      return supabase.auth.signInWithOAuth({
        provider: payload,
        options: options[payload],
      });
    },
    onMutate: () => createToast('signin', '로그인 시도 중...'),
    onError: error => {
      errorToast('signin', error.message);
    },
  });
  return { signInSocial, isSignInSocial };
};

// * User 의 생년월일, 성별을 얻기 위해 추가적으로 진행하는 요청
export const userAdditionalInfo = (session: Session) => ({
  queryKey: ['user-additional-info'],
  queryFn: async () => {
    const user: UserAdditionalType = {};
    if (session.user.app_metadata.providers.includes('kakao')) {
      const response = await fetchGet<KakaoOAuthType>(
        'https://kapi.kakao.com/v2/user/me?property_keys=["kakao_account.gender", "kakao_account.birthday", "kakao_account.birthyear"]',
        session.provider_token ?? undefined,
      );
      user.gender = response.kakao_account?.gender === 'male' ? 1 : 2;
      user.birth = Number(
        `${response.kakao_account?.birthyear.slice(2)}${response.kakao_account?.birthday}`,
      );
    } else if (session.user.app_metadata.providers.includes('google')) {
      /*
       * Google 은 이메일로 우리가 생성한 이메일 회원가입과 같은 이메일을 사용하게 되면
       * session.user.app_metadata.provider 가 먼저 생성한 것으로 처리됨
       * 그래서 session.user.app_metadata.providers 라는 객체 값에서
       * ["email", "google"] 이런 형태로 저장이 되어 있어 google 이 있을 경우 하위 로직을 실행
       * */
      const response = await fetchGet<GoogleOAuthType>(
        'https://people.googleapis.com/v1/people/me?personFields=genders,birthdays',
        session.provider_token ?? '',
      );
      user.gender = response.genders[0].value === 'male' ? 1 : 2;
      const { year, month, day } = response.birthdays[0].date;
      user.birth = Number(
        `${String(year).slice(2)}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`,
      );
    }
    return user;
  },
});

// ! TODO: useUserAdditionalUpdate로 renmae하는게 logic을 더 잘 나타내는 듯 보임.
export const useUpdateUserAdditionalInfo = () => {
  // * Social 로그인에서 Gender, Birth 데이터를 DB와 연동하기 위한 훅
  const setUser = useSetRecoilState(UserAtom);
  const { mutate: updateUser, isPending: isUpdateUser } = useMutation({
    mutationFn: async (payload: UserAdditionalType) =>
      supabase.auth.updateUser({ data: { ...payload } }),
    onSuccess: async data => {
      // * 성별과 생년월일을 업데이트 후 신규 가입 시에만 닉네임 및 status(정지 여부)에 대한 값이 없어 수동으로 추가
      const { user } = data.data;
      if (user) {
        const { id } = user;
        const {
          gender,
          avatar_url: avatar,
          birth,
          name,
          email,
        } = user.user_metadata;
        const payload = { id, gender, avatar, birth, name, email };
        if (!user.user_metadata.nickname) {
          const updatePayload = { status: 0, nickname: name };
          await supabase.auth.updateUser({ data: { ...updatePayload } });
          Object.assign(payload, updatePayload);
        } else {
          Object.assign(payload, {
            status: user.user_metadata.status,
            nickname: user.user_metadata.nickname,
          });
        }
        successToast('signin', `${name}님 환영합니다!`);
        // * Recoil 상태로 유저정보 등록
        setUser(payload as UserType);
      } else {
        throw new Error('오류가 발생했습니다. 잠시 후 다시 시도해 주세요');
      }
    },
    onError: error => errorToast('signin', error.message),
  });
  return { updateUser, isUpdateUser };
};

export const useAuthState = () => {
  const [sessionValue, setSessionValue] = useRecoilState(SessionAtom);
  const [isInitializingSession, setIsInitializingSession] = useRecoilState(
    IsInitializingSession,
  );
  const setUser = useSetRecoilState(UserAtom);
  const navigate = useNavigate();

  const setAuthState = useCallback(
    (session: Session | null) => {
      setSessionValue(session);
      setUser(parseUserFromSession(session));
    },
    [setUser, setSessionValue],
  );

  useEffect(() => {
    let beforeInitialSessionAuthListener: null | {
      data: { subscription: Subscription };
    };
    let afterInitialSessionAuthListener: null | {
      data: { subscription: Subscription };
    };

    // ! onAuthStateChange 를 사용하는 이유는 React-Query에서 onSuccess 로 처리를 하면 API Fetching 에 필요한 토큰 값을 받을 수 없기 때문
    // ! 토큰을 취득하려면 localStorage 에서 저장된 값을 불러와 하거나 onAuthStateChange 를 사용
    if (isInitializingSession) {
      beforeInitialSessionAuthListener = supabase.auth.onAuthStateChange(
        (event, session) => {
          setAuthState(session);
          setIsInitializingSession(false);
        },
      );
    } else {
      afterInitialSessionAuthListener = supabase.auth.onAuthStateChange(
        (event, session) => {
          switch (event) {
            case 'INITIAL_SESSION':
              setAuthState(session);
              setIsInitializingSession(false);
              break;
            case 'SIGNED_IN':
              setAuthState(session);
              navigate('/');
              break;
            case 'SIGNED_OUT':
              setAuthState(session);
              navigate('/sign/in');
              break;
            case 'PASSWORD_RECOVERY':
              // TODO: 추후 비밀번호 재설정 로직 구현하기 @한준
              break;
            case 'TOKEN_REFRESHED':
              setAuthState(session);
              break;
            case 'USER_UPDATED':
              // TODO: user update
              // * db update => trigger로 구현되어 잇음
              // * user update fetch할 때 supabase auth api를 이용하여 update하고 이 event를 발생
              // * global state에 대한 user는 여기서 update
              setAuthState(session);
              break;
            default:
              console.error('unknown auth event listener 👉🏻', event);
          }
        },
      );
    }

    return () => {
      if (beforeInitialSessionAuthListener)
        beforeInitialSessionAuthListener.data.subscription.unsubscribe();
      if (afterInitialSessionAuthListener)
        afterInitialSessionAuthListener.data.subscription.unsubscribe();
    };
  }, [isInitializingSession, navigate]);

  return [sessionValue, isInitializingSession] as const;
};
