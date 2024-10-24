import { ComponentProps, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';

import { routeHeaderInfo, routePaths } from '@/constants/route';
import Container from '@/components/atoms/Container';
import cn from '@/libs/cn';
import { UserAtom } from '@/stores/auth.store';
import { GNB, Logo, UserMenu } from '@/components/organisms/header';
import isRoutePathMatched from '@/libs/isRoutePathMatched';
import useIsOverSTabletBreakpoint from '@/hooks/useIsOverSTabletBreakpoint';

type Props = ComponentProps<'header'> & {
  className?: string;
  isLogin: boolean;
};

export default function Header({ className, isLogin, ...others }: Props) {
  const [hasNewAlarm] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [isUserMenuActive, _setIsUserMenuActive] = useState(false);
  const user = useRecoilValue(UserAtom);
  const location = useLocation();
  const [isOverSTabletBreakPoint] = useIsOverSTabletBreakpoint();

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

  const isHouseListPath =
    isRoutePathMatched(location.pathname, 'house') ||
    isRoutePathMatched(location.pathname, 'root');

  if (isHouseListPath) {
    headerConfig.gnb = !!isOverSTabletBreakPoint;
  }

  return (
    <>
      {(isOverSTabletBreakPoint || headerConfig.isHeaderExistUnderSTablet) && (
        <header
          className={cn(
            commonHeaderStyle,
            'top-0 left-0 bg-bg',
            isHouseListPath && (isOverSTabletBreakPoint ? '' : 'h-[6rem]'),
            className,
          )}
          {...others}
        >
          <Container.FlexRow className="mx-auto w-full max-w-[79rem] items-center justify-between px-8">
            {headerConfig.logo && <Logo to={routePaths.root} />}
            {headerConfig.gnb && <GNB />}
            {headerConfig.userMenu && (
              <UserMenu
                user={user}
                isLogin={isLogin}
                hasNewAlarm={hasNewAlarm}
                isUserMenuActive={isUserMenuActive}
              />
            )}
          </Container.FlexRow>
        </header>
      )}
      {!isOverSTabletBreakPoint &&
        headerConfig.isGNBExistBottomUnderSTablet && (
          <GNB
            className={cn(
              commonHeaderStyle,
              isHouseListPath && 'h-auto py-7 bg-bg',
              'bottom-0 left-0 justify-center',
            )}
          />
        )}
    </>
  );
}

Header.defaultProps = {
  className: '',
};
