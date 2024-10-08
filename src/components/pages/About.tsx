import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/constants/route';
import { supabase } from '@/libs/supabaseClient';
import Container from '@/components/atoms/Container';
import Button from '@/components/atoms/Button';
import Typography from '@/components/atoms/Typography';
import { UserAtom } from '@/stores/auth.store';
import Link from '@/components/atoms/Link';

export default function About() {
  const user = useRecoilValue(UserAtom);
  const navigate = useNavigate();
  const onClickSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
  };

  return (
    <Container.FlexCol className="gap-4">
      <Typography.Head1>서비스 소개 및 사용방법</Typography.Head1>
      <Typography.P1>고유번호: {user?.id}</Typography.P1>
      <Typography.P1>생년월일: {user?.birth}</Typography.P1>
      <Typography.P1>성별 : {user?.gender}</Typography.P1>
      <Typography.P1>성명 : {user?.name}</Typography.P1>
      <Typography.P1>이메일 : {user?.email}</Typography.P1>
      {user?.avatar && (
        <img
          className="size-[100px] rounded-full"
          src={user?.avatar}
          alt="avatar"
        />
      )}
      {user && (
        <Button.Fill className="w-fit p-8 text-white" onClick={onClickSignOut}>
          로그아웃
        </Button.Fill>
      )}
      {!user && (
        <Button.Fill
          className="w-fit p-8 text-white"
          onClick={() => navigate(routePaths.signIn)}
        >
          로그인
        </Button.Fill>
      )}
      <Container.FlexCol className="space-y-2">
        <Link to="/chat" className="w-40 bg-brown text-xl text-white">
          chats
        </Link>
        <Link to="/chat/2c818fc5-8b49-44ff-8713-b4ece60c36d5" className="w-40 bg-brown text-xl text-white">
          chatRoom
        </Link>
        <Link to="/lounge" className="w-40 bg-brown text-xl text-white">
          lounge
        </Link>
        <Link to="/house" className="w-40 bg-brown text-xl text-white">
          house
        </Link>
        <Link
          to={routePaths.houseRegister}
          className="w-40 bg-brown text-xl text-white"
        >
          house register
        </Link>
        <Link
          to={routePaths.houseDetail('4f627998-1306-4ac6-8683-50e80db68b8b')}
          className="w-40 bg-brown text-xl text-white"
        >
          house detail
        </Link>
        <Link
          to={routePaths.signUpProfileIntro}
          className="w-40 bg-brown text-xl text-white"
        >
          signup-intro
        </Link>
        <Link
          to={routePaths.signUpProfile}
          className="w-40 bg-brown text-xl text-white"
        >
          signup-profile
        </Link>
        <Link
          to={routePaths.signUpProfileOutro}
          className="w-40 bg-brown text-xl text-white"
        >
          signup-outro
        </Link>
        <Link
          to={routePaths.myActivity}
          className="w-40 bg-brown text-xl text-white"
        >
          my-activity
        </Link>
        <Link
          to={routePaths.myBookmark}
          className="w-40 bg-brown text-xl text-white"
        >
          my-bookmark
        </Link>
        <Link
          to={routePaths.myAccount}
          className="w-40 bg-brown text-xl text-white"
        >
          my-account
        </Link>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
