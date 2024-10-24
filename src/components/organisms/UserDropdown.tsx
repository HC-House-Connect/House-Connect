import { useRef } from 'react';

import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import Link from '@/components/atoms/Link';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import { routePaths } from '@/constants/route';
import { supabase } from '@/libs/supabaseClient';
import { createToast } from '@/libs/toast';
import { UserType } from '@/types/auth.type';
import useCloseOnClickOutside from '@/hooks/useCloseOnClickOutside';

type UserDropdownProps = {
  user: UserType | null;
  setDropView: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserDropdown({ user, setDropView }: UserDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useCloseOnClickOutside(containerRef, () => setDropView(false));

  const onClickLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      createToast(
        'logoutError',
        '죄송합니다. 로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.',
        {
          type: 'error',
          isLoading: false,
          autoClose: 1000,
        },
      );
    }
  };

  return (
    <Container.FlexCol
      ref={containerRef}
      className="absolute right-0 top-14 z-50 w-[17.625rem] overflow-hidden rounded-xl bg-bg text-brown shadow-[0_0_4px_0_rgb(0,0,0,0.25)]"
    >
      <Container.FlexRow className="items-center gap-[1.0625rem] border-b-[0.5px] border-brown2 p-6">
        {user?.avatar ? (
          <Avatar.XL src={user.avatar} />
        ) : (
          <IconButton button="Ghost" iconType="avatar" />
        )}
        <Typography.SubTitle3>
          {user?.nickname ? user?.nickname : user?.name}님
        </Typography.SubTitle3>
      </Container.FlexRow>
      <li className="list-none " onClick={() => setDropView(false)} aria-hidden>
        <Link
          to={routePaths.houseRegister}
          className="flex h-[3rem] w-full items-center px-5 hover:bg-brown6 active:bg-brown6"
        >
          <Typography.SubTitle3>하우스 등록</Typography.SubTitle3>
        </Link>
      </li>
      <li className="list-none" onClick={() => setDropView(false)} aria-hidden>
        <Link
          to={routePaths.myBookmark}
          className="flex h-[3rem] w-full items-center border-b-[0.5px] border-brown2 px-5 hover:bg-brown6 active:bg-brown6"
        >
          <Typography.SubTitle3>내 북마크</Typography.SubTitle3>
        </Link>
      </li>
      <li className="list-none" onClick={() => setDropView(false)} aria-hidden>
        <Link
          to={routePaths.myActivity}
          className="flex h-[3rem] w-full items-center px-5 hover:bg-brown6 active:bg-brown6"
        >
          <Typography.SubTitle3>마이페이지</Typography.SubTitle3>
        </Link>
      </li>
      <li className="list-none" onClick={() => setDropView(false)} aria-hidden>
        <Button.Ghost
          onClick={onClickLogout}
          className="flex h-[3rem] w-full items-center px-5 hover:bg-brown6 active:bg-brown6"
        >
          <Typography.SubTitle3>로그아웃</Typography.SubTitle3>
        </Button.Ghost>
      </li>
    </Container.FlexCol>
  );
}
