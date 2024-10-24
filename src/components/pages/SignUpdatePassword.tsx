import { SignLayoutWrapper } from '@/components/templates/SignLayout.template';
import SignUpdatePasswordTemplate from '@/components/templates/SignUpdatePassword.template';

export default function SignUpdatePassword() {
  return (
    <SignLayoutWrapper className="gap-[3.75rem]">
      <SignUpdatePasswordTemplate />
    </SignLayoutWrapper>
  );
}
