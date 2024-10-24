import { Outlet, useLocation } from 'react-router-dom';

import cn from '@/libs/cn';
import { useAuthState } from '@/hooks/useSign';
import Header from '@/components/templates/Header';
import isRoutePathMatched from '@/libs/isRoutePathMatched';
import Container from '@/components/atoms/Container';
import HouseListTopSection from '@/components/templates/House/HouseList/HouseListTopSection';

export default function LayoutTemplate() {
  // * supabase authListener를 등록함과 동시에 isLogin상태를 가져오기 위함
  const [session] = useAuthState();
  const location = useLocation();
  const isSignPath = isRoutePathMatched(location.pathname, [
    'sign',
    'signIn',
    'signUp',
    'signUpInfo',
    'signPasswordReset',
    'signUpdatePassword',
  ]);
  const isSignUpProfilePath = isRoutePathMatched(location.pathname, [
    'signUpProfile',
    'signUpProfileIntro',
    'signUpProfileOutro',
  ]);

  const isHouseListPath =
    isRoutePathMatched(location.pathname, 'house') ||
    isRoutePathMatched(location.pathname, 'root');

  return (
    <>
      <Header
        isLogin={!!session}
        className={cn(isSignPath && 'bg-bg laptop:bg-transparent')}
      />
      {isHouseListPath ? (
        <Container.FlexCol className="w-full bg-bg-orange pb-[6rem]">
          <HouseListTopSection />
          <Container.FlexRow className="bg-bg-orange">
            <main
              className={cn(
                'flex flex-col relative w-full mx-auto pt-[2rem] pb-16 bg-transparent',
              )}
            >
              <Outlet />
            </main>
          </Container.FlexRow>
        </Container.FlexCol>
      ) : (
        <main
          className={cn(
            'flex flex-col relative max-w-[79rem] p-5 mx-auto h-screen',
            // * isSignPath & isSignUpProfilePath에 해당하는 page는 header가 존재하기 때문
            (isSignPath || isSignUpProfilePath) && 'pt-[8rem] pb-8',
            's-tablet:pt-[8rem] px-8 pb-8',
            // 'bg-yellow-200',
          )}
        >
          <Outlet />
        </main>
      )}
    </>
  );
}

LayoutTemplate.defaultProps = {
  isLogin: false,
};
