import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  SignUpUserBirthAtom,
  SignUpUserGenderAtom,
  SignUpUserNameAtom,
  ShowVerificationAtom,
} from '@/stores/sign.store';
import {
  EmailAuthType,
  SignUpFormData2,
  SignUpFormData2Type,
  VerifyEmailType,
} from '@/types/auth.type';
import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import FormItem from '@/components/molecules/FormItem';
import { useSignUpEmail, useVerifyEmail } from '@/hooks/useSign';

export default function SignUpIntroTemplate2() {
  const Form = FormProvider;
  const form = useForm<SignUpFormData2Type>({
    resolver: zodResolver(SignUpFormData2),
  });
  const showVerification = useRecoilValue(ShowVerificationAtom);
  const name = useRecoilValue(SignUpUserNameAtom);
  const birth = useRecoilValue(SignUpUserBirthAtom);
  const gender = useRecoilValue(SignUpUserGenderAtom);

  const { signUpEmail, isSignUpEmail } = useSignUpEmail();
  const { verifyEmail, isVerifyEmail } = useVerifyEmail({
    mutateMessage: '인증 중입니다.',
    successMessage: '🎉인증성공! 회원가입 되셨습니다!',
  });

  const isPending = isSignUpEmail || isVerifyEmail;
  const onSubmitSignUp = async (formData: EmailAuthType) => {
    if (birth && gender) {
      const userData = { ...formData, birth, gender, name };
      signUpEmail(userData);
    }
  };

  const onSubmitVerify = async (formData: VerifyEmailType) => {
    verifyEmail(formData);
  };

  const onSubmit: SubmitHandler<SignUpFormData2Type> = data =>
    !showVerification
      ? onSubmitSignUp(data as EmailAuthType)
      : onSubmitVerify(data as VerifyEmailType);

  return (
    <Container.FlexCol className="min-w-full flex-1 gap-[3.25rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Container.FlexCol className="gap-[1.625rem]">
            <FormItem.TextField
              labelName="이메일"
              type="text"
              name="email"
              placeholder="이메일 입력"
            />
            <FormItem.TextField
              labelName="비밀번호"
              type="password"
              name="password"
              placeholder="비밀번호 입력"
            />
            <FormItem.TextField
              labelName="비밀번호 재입력"
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 입력"
            />
          </Container.FlexCol>
          {showVerification ? (
            <>
              <FormItem.TextField
                labelName="인증번호"
                type="text"
                name="token"
                options={{ required: '인증번호를 입력해주세요.' }}
                placeholder="인증번호 입력"
                containerStyle="mt-[1.625rem]"
              />
              <Button.Fill
                type="submit"
                className="mt-[3.25rem] w-full rounded-[10px]"
                disabled={isPending}
              >
                <Typography.P3 className="mx-auto my-[1rem] text-[#F4E7DB]">
                  인증 요청
                </Typography.P3>
              </Button.Fill>
            </>
          ) : (
            <Button.Fill
              type="submit"
              className="mt-[3.25rem] w-full rounded-[10px]"
              disabled={isPending}
            >
              <Typography.P3 className="mx-auto my-[1rem] text-[#F4E7DB]">
                확인
              </Typography.P3>
            </Button.Fill>
          )}
        </form>
      </Form>
    </Container.FlexCol>
  );
}
