import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { ReactElement, useState } from 'react';
import { useRecoilValue } from 'recoil';

import LayoutTemplate from '@/components/templates/Layout.template';
import ComponentTest from '@/components/pages/ComponentTest';
import SignLayoutTemplate from '@/components/templates/SignLayout.template';
import SignUpProfileIntro from '@/components/pages/SignUpProfileIntro';
import SignUpProfile from '@/components/pages/SignUpProfile';
import SignIn from '@/components/pages/SignIn';
import SignUp from '@/components/pages/SignUp';
// import About from '@/components/pages/About';
import SignUpProfileOutro from '@/components/pages/SignUpProfileOutro';
import { IsInitializingSession, SessionAtom } from '@/stores/auth.store';
import Loading from '@/components/pages/Loading';
import SignPasswordReset from '@/components/pages/SignPasswordReset';
import SignUpdatePassword from '@/components/pages/SignUpdatePassword';
import SignUpEmail from '@/components/pages/SignUpEmail';
import SignUpInfo from '@/components/pages/SignUpInfo';
import HouseRegister from '@/components/pages/HouseRegister';
import { ChatRoom } from '@/components/templates/chats';
import Chat from '@/components/pages/Chat';
import HouseDetail from '@/components/pages/HouseDetail';
import HouseList from '@/components/pages/HouseList';
import MyPageLayoutTemplate from '@/components/templates/MyPageLayout.template';
import MyActivity from '@/components/pages/MyActivity';
import MyAccount from '@/components/pages/MyAccount';
import MyBookmark from '@/components/pages/MyBookmark';
import { routePaths } from '@/constants/route';

type RouteType = RouteObject & {
  shouldProtected?: boolean;
  element: ReactElement;
  children?: RouteType[];
};

type ProtectedRouterType = {
  children: ReactElement<{ isLogin?: boolean }>;
};

function ProtectedRouter({ children }: ProtectedRouterType) {
  const session = useRecoilValue(SessionAtom);
  const isInitializingSession = useRecoilValue(IsInitializingSession);
  const [isDelaying, setIsDelaying] = useState(true);

  // ! TODO: 하위 컴포넌트에서 초기 렌더링 시 user의 정보를 참조하고 있어 발생하는 오류를
  // ! user가 초기화 중일 때는 하위 컴포넌트의 렌더링을 막고 user 정보 초기화가 완료되었을 시만
  // ! 하위 컴포넌트를 렌더링 함.
  if (isInitializingSession) return <Loading text="로그인 정보 확인 중" />;

  if (!isInitializingSession && !session) {
    return isDelaying ? (
      <Loading
        delayTime={2000}
        setIsDelaying={setIsDelaying}
        text="로그인이 필요한 서비스입니다"
      />
    ) : (
      <Navigate to={routePaths.signIn} />
    );
  }

  // * session이 초기화되었을 때만 도달하는 영역
  return children;
}

const routes: RouteType[] = [
  {
    path: routePaths.root,
    element: <LayoutTemplate />,
    children: [
      {
        index: true,
        element: <HouseList />,
      },
      {
        path: routePaths.chat,
        element: <Chat />,
        shouldProtected: true,
        children: [
          {
            path: routePaths.chatRoom(),
            element: <ChatRoom />,
          },
        ],
      },
      {
        path: routePaths.lounge,
        shouldProtected: true,
        element: (
          <div className="flex size-full items-center justify-center bg-black text-3xl text-white">
            lounge page
          </div>
        ),
      },
      {
        path: routePaths.house,
        element: <HouseList />,
        shouldProtected: false,
      },
      {
        path: routePaths.houseRegister,
        element: <HouseRegister />,
        shouldProtected: true,
      },
      {
        path: routePaths.houseEdit(),
        element: <HouseRegister />,
        shouldProtected: true,
      },
      {
        path: routePaths.houseDetail(),
        element: <HouseDetail />,
        shouldProtected: false,
      },
      {
        path: routePaths.sign,
        element: <SignLayoutTemplate />,
        shouldProtected: false,
        children: [
          {
            path: routePaths.signIn,
            element: <SignIn />,
          },
          {
            path: routePaths.signUp,
            element: <SignUp />,
            children: [
              { index: true, element: <SignUpEmail /> },
              { path: 'info', element: <SignUpInfo /> },
            ],
          },
          {
            path: routePaths.signPasswordReset,
            element: <SignPasswordReset />,
          },
          {
            path: routePaths.signUpdatePassword,
            element: <SignUpdatePassword />,
          },
        ],
      },
      {
        path: routePaths.signUpProfileIntro,
        shouldProtected: true,
        element: <SignUpProfileIntro />,
      },
      {
        path: routePaths.signUpProfile,
        // shouldProtected: true,
        element: <SignUpProfile />,
      },
      {
        path: routePaths.signUpProfileOutro,
        shouldProtected: true,
        element: <SignUpProfileOutro />,
      },
      {
        path: routePaths.componentTest,
        element: <ComponentTest />,
      },
      {
        path: routePaths.myPage,
        shouldProtected: true,
        element: <MyPageLayoutTemplate />,
        children: [
          { path: routePaths.myActivity, element: <MyActivity /> },
          { path: routePaths.myBookmark, element: <MyBookmark /> },
          { path: routePaths.myAccount, element: <MyAccount /> },
          { path: routePaths.myMate, element: <h1>준비중...</h1> },
          { path: routePaths.myAlarm, element: <h1>준비중...</h1> },
          { path: routePaths.myTheme, element: <h1>준비중...</h1> },
        ],
      },
    ],
  },
];

const createRoutes = (routeInfo: RouteType[]): RouteObject[] =>
  routeInfo.map(route => {
    const { path, element, children, shouldProtected } = route;

    const routeObject = {
      ...route,
      path,
      element: shouldProtected ? (
        <ProtectedRouter>{element}</ProtectedRouter>
      ) : (
        element
      ),
      children: children ? createRoutes(children) : undefined,
    } as RouteType;

    // ! delete useless property of RouterObject from react-router-dom
    const { shouldProtected: _, ...parsedToRouterObject } = routeObject;

    return parsedToRouterObject;
  });

const router = createBrowserRouter(createRoutes(routes));

export default function Router() {
  return <RouterProvider router={router} />;
}
