import { SignLayoutWrapper } from '@/components/templates/SignLayout.template';
import SignUpTemplate from '@/components/templates/SignUp.template';

export default function SignUp() {
  return (
    <SignLayoutWrapper className="gap-[2.5rem]">
      <SignUpTemplate />
    </SignLayoutWrapper>
  );
}
