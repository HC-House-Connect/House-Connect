import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import cn from '@/libs/cn';
import { useAuthState } from '@/hooks/useSign';
import Header from '@/components/templates/Header';
import { GNB } from '@/components/organisms/header';
import isRoutePathMatched from '@/libs/isPathMatched';
import { routeHeaderInfo, routePaths } from '@/constants/route';

export default function LayoutTemplate() {
  // * supabase authListener를 등록함과 동시에 isLogin상태를 가져오기 위함
  const [session] = useAuthState();
  const location = useLocation();
  // @FIXME: 처음 브라우저의 window.innerWidth가 576보다 작을 때는 isOverSTabletBreakPoint = false여야
  // 하지만, 초기 rendering 시 값이 true로 설정되어 있어서 s-tablet breakpoint 이하에서도 header가 존재하는 버그가 생김
  const [isOverSTabletBreakPoint, setIsOverSTabletBreakPoint] = useState(true);

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
  const commonHeaderStyle = 'flex h-[8rem] items-center fixed w-screen z-50';

  const getHeaderConfig = (locationPathName: string) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const routePathType of Object.keys(routePaths)) {
      if (
        isRoutePathMatched(
          locationPathName,
          routePathType as keyof typeof routePaths,
        )
      )
        return routeHeaderInfo[routePathType as keyof typeof routePaths];
    }

    return routeHeaderInfo.default;
  };

  const headerConfig = getHeaderConfig(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      // ! !isSTabletBreakPoint 조건식에 추가하지 않으면 window size가 변할 때마다 isMobile state가 변경되어 렌더링이 불필요하게 많이 일어남
      // ! 576 => s-tablet breakpoint(refer -> tailwind.config.ts)
      if (window.innerWidth < 576 && isOverSTabletBreakPoint) {
        setIsOverSTabletBreakPoint(false);
      } else if (window.innerWidth >= 576 && !isOverSTabletBreakPoint) {
        setIsOverSTabletBreakPoint(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOverSTabletBreakPoint]);

  return (
    <>
      {(isOverSTabletBreakPoint || headerConfig.isHeaderExistOnMobile) && (
        <Header
          isLogin={!!session}
          className={cn(commonHeaderStyle, isSignPath && 'bg-transparent')}
          exist={headerConfig}
        />
      )}
      {!isOverSTabletBreakPoint &&
        headerConfig.isGNBExistBottomUnderSTablet && (
          <GNB
            className={cn(
              commonHeaderStyle,
              'bottom-0 left-0 justify-center bg-bg',
            )}
          />
        )}
      <main
        className={cn(
          'flex flex-col relative max-w-[79rem] p-5 mx-auto h-screen',
          // * isSignPath & isSignUpProfilePath에 해당하는 page는 header가 존재하기 때문
          (isSignPath || isSignUpProfilePath) && 'pt-[8rem] pb-8',
          's-tablet:pt-[8rem] px-8 pb-8',
        )}
      >
        <Outlet />
      </main>
    </>
  );
}

LayoutTemplate.defaultProps = {
  isLogin: false,
};
