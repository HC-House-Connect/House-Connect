import SignInTemplate from '@/components/templates/SignInTemplate';
import { SignLayoutWrapper } from '@/components/templates/SignLayout.template';

export default function SignIn() {
  return (
    <SignLayoutWrapper className="gap-[3.75rem]">
      <SignInTemplate />
    </SignLayoutWrapper>
  );
}
