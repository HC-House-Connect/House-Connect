import { useMutation } from '@tanstack/react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  Subscription,
} from '@supabase/supabase-js';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';

import { routePaths } from '@/constants/route';
import { supabase } from '@/libs/supabaseClient';
import {
  IsInitializingSession,
  IsNotVerifiedAtom,
  SessionAtom,
  UserAtom,
} from '@/stores/auth.store';
import {
  EmailAuthType,
  SignUpEmailType,
  SignUpInfoType,
  SocialType,
  UserType,
  VerifyEmailType,
} from '@/types/auth.type';
import { createToast, errorToast, successToast } from '@/libs/toast';
import { ShowVerificationAtom } from '@/stores/sign.store';
import getRedirectURL from '@/libs/getRedirectURL';

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
  const setShowVerification = useSetRecoilState(ShowVerificationAtom);
  const { mutate: signUpEmail, isPending: isSignUpEmail } = useMutation({
    mutationFn: async (payload: SignUpEmailType) =>
      supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: uuid(),
            avatar: '',
            email: payload.email,
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
  const navigate = useNavigate();
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
      navigate(routePaths.signUpInfo);
    },
    onError: (error: AuthError) => {
      errorToast('signin', error.message);
    },
  });
  return { verifyEmail, isVerifyEmail };
};

export const useSignInSocial = () => {
  const isDev =
    import.meta.env.MODE === 'development' &&
    process.env.NODE_ENV === 'development';

  const { mutate: signInSocial, isPending: isSignInSocial } = useMutation({
    mutationFn: async (payload: SocialType) =>
      supabase.auth.signInWithOAuth({
        provider: payload,
        options: {
          redirectTo: isDev
            ? `${getRedirectURL().devURL}${routePaths.sign.slice(1)}`
            : `${getRedirectURL().prodURL}${routePaths.sign.slice(1)}`,
        },
      }),
    onMutate: () => createToast('signin', '로그인 시도 중...'),
    onError: error => {
      errorToast('signin', error.message);
    },
  });
  return { signInSocial, isSignInSocial };
};

export const useResendVerifyMail = () => {
  const { mutate: resendVerifyMail, isPending: isResending } = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: payload.email,
      });
      if (error) throw new Error(error.message);
    },
    onMutate: () =>
      createToast('resendVerifyEmail', '인증메일을 전송중입니다.'),
    onError: (error: AuthError) => {
      errorToast('resendVerifyEmail', error.message);
    },
    onSuccess: async () => {
      successToast('resendVerifyEmail', '📧 인증메일이 전송되었습니다.');
    },
  });
  return { resendVerifyMail, isResending };
};
export const useUpdateUserInfo = () => {
  const navigate = useNavigate();
  const { mutate: updateUserInfo, isPending } = useMutation({
    mutationFn: async (payload: SignUpInfoType) => {
      const { error } = await supabase.auth.updateUser({
        data: { ...payload, nickname: payload.name },
      });
      if (error) throw new Error(error.message);
    },
    onMutate: () =>
      createToast('update-user-info', '기본 정보를 수정중입니다...'),
    onSuccess: () => {
      successToast('update-user-info', '프로필 정보를 설정해주세요');
      navigate(routePaths.signUpProfileIntro);
    },
    onError: error => errorToast('update-user-info', error.message),
  });
  return { updateUserInfo, isPending };
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
        (_event, session) => {
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
              break;
            case 'SIGNED_OUT':
              setAuthState(session);
              navigate(routePaths.signIn);
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
  }, [isInitializingSession, navigate, setAuthState, setIsInitializingSession]);

  return [sessionValue, isInitializingSession] as const;
};
