import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { routePaths } from '@/constants/route';
import cn from '@/libs/cn';
import Container from '@/components/atoms/Container';
import Icon from '@/components/atoms/Icon';
import { SessionAtom } from '@/stores/auth.store';
import { createToast } from '@/libs/toast';
import { supabase } from '@/libs/supabaseClient';

export default function SignLayoutTemplate() {
  const navigate = useNavigate();
  const session = useRecoilValue(SessionAtom);

  useEffect(() => {
    let timeoutId: number;
    const { data } = supabase.auth.onAuthStateChange(async _event => {
      if (session) {
        timeoutId = window.setTimeout(() => {
          const { birth, gender, nickname } = session.user.user_metadata;

          if (!birth || !gender || !nickname) {
            createToast('signup-info', '추가 정보를 입력해주세요.', {
              isLoading: false,
              type: 'warning',
              autoClose: 3000,
            });

            navigate(routePaths.signUpInfo);
          }
          // 성공적으로 user추가정보(birth, gender, nickname)를 update했을 때
          else {
            navigate(routePaths.signUpProfileIntro);
          }
        }, 0);
      }
    });

    return () => {
      data.subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [session, navigate]);

  return (
    <>
      <Container
        className={cn(
          'fixed left-0 top-0 z-[-9999] h-screen w-[50vw] bg-subColor1',
        )}
      />
      <Container
        className={cn(
          'fixed right-0 top-0 z-[-9998] h-screen w-[50vw] bg-bg rounded-xl',
        )}
      />
      <Container.FlexRow className="w-full">
        <Container.FlexRow className="h-full flex-1 items-center justify-center">
          <Icon type="character" />
        </Container.FlexRow>
        <Container.FlexRow className="w-full flex-1 justify-center">
          <Outlet />
        </Container.FlexRow>
      </Container.FlexRow>
    </>
  );
}
