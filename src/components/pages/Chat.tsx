import { Outlet } from 'react-router-dom';

import ChatList from '@/components/templates/ChatList';
import Container from '@/components/atoms/Container';

export default function Chat() {
  return (
    <Container.FlexRow className="min-h-full w-full">
      <ChatList />
      <Outlet />
    </Container.FlexRow>
  );
}
