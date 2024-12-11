import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ComponentProps, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { routePaths } from '@/constants/route';
import cn from '@/libs/cn';
import Container from '@/components/atoms/Container';
import Icon from '@/components/atoms/Icon';
import { SessionAtom } from '@/stores/auth.store';
import { createToast } from '@/libs/toast';
import { supabase } from '@/libs/supabaseClient';
import isRoutePathMatched from '@/libs/isRoutePathMatched';

export function SignLayoutWrapper({
  className,
  children,
}: ComponentProps<'div'>) {
  return (
    <Container.FlexCol
      className={cn(
        'size-full max-w-[40rem] justify-center laptop:px-[3.5rem]',
        className,
      )}
    >
      {children}
    </Container.FlexCol>
  );
}

export default function SignLayoutTemplate() {
  const navigate = useNavigate();
  const session = useRecoilValue(SessionAtom);
  const location = useLocation();

  useEffect(() => {
    let timeoutId: number;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { data } = supabase.auth.onAuthStateChange(async _event => {
      if (isRoutePathMatched(location.pathname, 'signUpdatePassword')) return;

      if (session) {
        timeoutId = window.setTimeout(async () => {
          const { data, error } = await supabase
            .from('user')
            .select('is_set_profile')
            .eq('id', session?.user.id)
            .maybeSingle();

          const { birth, gender, name } = session.user.user_metadata;

          if (!birth || !gender || !name) {
            createToast('signup-info', '추가 정보를 입력해주세요.', {
              isLoading: false,
              type: 'warning',
              autoClose: 3000,
            });

            return navigate(routePaths.signUpInfo);
          }

          if (data) {
            if (data.is_set_profile) {
              return navigate(routePaths.root);
            }

            return navigate(routePaths.signUpProfileIntro);
          }

          if (error) {
            navigate(routePaths.root);
          }

          return navigate(routePaths.root);
        }, 0);
      }
    });

    return () => {
      data.subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [session, navigate, location.pathname]);

  return (
    <>
      <Container
        className={cn(
          'fixed left-0 top-0 z-[-9999] h-screen w-[50vw] bg-transparent laptop:bg-bg-beige',
        )}
      />
      <Container
        className={cn(
          'fixed right-0 top-0 z-[-9998] h-screen w-[50vw] bg-bg rounded-xl',
        )}
      />
      <Container.FlexRow className="mx-auto w-full flex-1">
        <Container.FlexRow className="hidden h-full flex-1 items-center justify-center laptop:flex">
          <Icon type="character" />
        </Container.FlexRow>
        <Container.FlexRow className="w-full flex-1 justify-center">
          <Outlet />
        </Container.FlexRow>
      </Container.FlexRow>
    </>
  );
}
