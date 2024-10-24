import { SignLayoutWrapper } from '@/components/templates/SignLayout.template';
import SignPasswordResetTemplate from '@/components/templates/SignPasswordReset.template';

export default function SignPasswordReset() {
  return (
    <SignLayoutWrapper className="gap-[2.5rem]">
      <SignPasswordResetTemplate />
    </SignLayoutWrapper>
  );
}
