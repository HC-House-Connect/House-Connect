import { ComponentProps, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { UserType } from '@/types/auth.type';
import Container from '@/components/atoms/Container';
import cn from '@/libs/cn';
import IconButton from '@/components/molecules/IconButton';
import Avatar from '@/components/atoms/Avatar';
import Link from '@/components/atoms/Link';
import Typography from '@/components/atoms/Typography';
import { routePaths } from '@/constants/route';
import Button from '@/components/atoms/Button';
import UserDropdown from '@/components/organisms/UserDropdown';

type UserMenuProps = ComponentProps<'div'> & {
  user: UserType | null;
  isLogin: boolean;
  hasNewAlarm: boolean;
  isUserMenuActive: boolean;
};

// header에서 Logo, GNB를 제외한 user에 대한 정보(e.g avatar alarm)
export default function UserMenu({
  user,
  className,
  isLogin,
  hasNewAlarm,
  isUserMenuActive,
}: UserMenuProps) {
  const [dropView, setDropView] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDropView(false);
  }, [location]);

  return (
    <Container.FlexRow
      className={cn('items-center justify-between gap-7 relative', className)}
    >
      {isLogin && (
        <>
          <IconButton
            button="Ghost"
            iconType={hasNewAlarm ? 'alarm-exist' : 'alarm-none'}
          />
          {user?.avatar ? (
            <Button.Ghost onClick={() => setDropView(!dropView)}>
              <Avatar.XS src={user.avatar} isActive={isUserMenuActive} />
            </Button.Ghost>
          ) : (
            <IconButton button="Ghost" iconType="avatar" />
          )}
          {dropView && (
            <UserDropdown
              setDropView={setDropView}
              user={user}
            />
          )}
        </>
      )}
      {!isLogin && (
        <Container.FlexRow className="items-center gap-4">
          <Link to={routePaths.signIn}>
            <Typography.SpanMid1
              lang="en"
              className="cursor-pointer text-[0.9375rem] font-semibold uppercase tracking-widest text-brown hover:text-brown1"
            >
              login
            </Typography.SpanMid1>
          </Link>
        </Container.FlexRow>
      )}
    </Container.FlexRow>
  );
}
