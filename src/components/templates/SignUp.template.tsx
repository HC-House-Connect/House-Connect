import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/constants/route';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import isRoutePathMatched from '@/libs/isRoutePathMatched';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUpInfoRoute = isRoutePathMatched(location.pathname, 'signUpInfo');

  const onClickPrevButton = () => {
    if (isSignUpInfoRoute)
      navigate(-1); // * 인증 후 추가적인 이름, 주민번호를 입력하는 page에서는 뒤로가기 버튼이 실행되어야 함
    else navigate(routePaths.signIn);
  };

  return (
    <>
      <IconButton.Ghost
        onClick={onClickPrevButton}
        iconType="back"
        iconClassName="mx-auto"
        className="size-[2.75rem] cursor-pointer rounded-full"
      />
      <Container.FlexCol className="gap-[3.5rem]">
        <Typography.Head2 className="text-brown">회원가입</Typography.Head2>
        <Container className="w-full">
          <Outlet />
        </Container>
      </Container.FlexCol>
    </>
  );
}
