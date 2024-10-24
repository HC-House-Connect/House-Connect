import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { MouseEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { zodResolver } from '@hookform/resolvers/zod';

import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import Link from '@/components/atoms/Link';
import Divider from '@/components/atoms/Divider';
import Button from '@/components/atoms/Button';
import IconButton from '@/components/molecules/IconButton';
import {
  useResendVerifyMail,
  useSignInEmail,
  useSignInSocial,
  useVerifyEmail,
} from '@/hooks/useSign';
import {
  EmailAuth,
  EmailAuthType,
  SocialType,
  VerifyEmail,
  VerifyEmailType,
} from '@/types/auth.type';
import { IsNotVerifiedAtom } from '@/stores/auth.store';
import FormItem from '@/components/molecules/FormItem';
import { routePaths } from '@/constants/route';

export default function SignInTemplate() {
  const Form = FormProvider;
  const isNotVerified = useRecoilValue(IsNotVerifiedAtom);
  const form = useForm<EmailAuthType & VerifyEmailType>({
    resolver: isNotVerified ? zodResolver(VerifyEmail) : zodResolver(EmailAuth),
  });
  const [isReSendVerifyEmail, setIsReSendVerifyEmail] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signInEmail, isSignInEmail } = useSignInEmail();
  const { verifyEmail, isVerifyEmail } = useVerifyEmail({
    mutateMessage: '인증 후 로그인 시도 중...',
    successMessage: '로그인 성공!',
  });
  const { resendVerifyMail, isResending } = useResendVerifyMail();
  const { signInSocial, isSignInSocial } = useSignInSocial();

  const isPending =
    isSignInEmail || isSignInSocial || isVerifyEmail || isResending;

  // * 회원가입에서 Email 인증을 거치지 않고 로그인 시 다시 인증번호를 전송하는 기능
  const onReSendVerifyEmail = async () => {
    setIsReSendVerifyEmail(true);
    resendVerifyMail({ email: form.getValues('email') });
    setIsReSendVerifyEmail(false);
  };

  const onClickSocial = (event: MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    signInSocial(id as SocialType);
  };

  const onSubmitHandle: SubmitHandler<
    EmailAuthType | VerifyEmailType
  > = data => {
    if (isNotVerified) {
      // * 미인증 로그인 시 인증하는 기능
      verifyEmail(data as VerifyEmailType);
    }
    signInEmail(data as EmailAuthType);
  };

  const onClickVisible = () => setPasswordVisible(prev => !prev);

  return (
      <>
      <Container.FlexCol className="w-full">
        <Container.FlexCol className="mb-[4rem] gap-[1.25rem] text-brown">
          <Typography.Head2>House-Connect</Typography.Head2>
          <Typography.SubTitle1>룸메이트 쉽게 찾기</Typography.SubTitle1>
        </Container.FlexCol>
        <Container.FlexCol>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandle)}>
              <FormItem.TextField
                labelName="이메일"
                name="email"
                placeholder="이메일 입력"
                inputStyle="w-full bg-transparent mt-[1rem]"
              />
              <FormItem.Password
                labelName="비밀번호"
                type="password"
                name="password"
                placeholder="비밀번호 입력"
                inputStyle="w-full bg-transparent mt-[1rem]"
                containerStyle="mt-[1.75rem]"
                isVisible={passwordVisible}
                onClickVisible={onClickVisible}
              />
              {isNotVerified && (
                <Container.FlexRow className="mt-7 gap-x-2">
                  <FormItem.TextField
                    containerStyle="flex-1"
                    labelName="인증번호"
                    type="number"
                    placeholder="000000"
                    inputStyle="w-full bg-transparent mt-[1rem]"
                    name="token"
                  />
                  <Button.Outline
                    className={`${form.formState.errors?.token ? 'mb-5' : 'mb-2'} mt-8 rounded-[0.625rem] px-[0.6875rem]`}
                    disabled={isReSendVerifyEmail}
                    onClick={onReSendVerifyEmail}
                  >
                    <Typography.P3 className="text-brown">
                      인증요청
                    </Typography.P3>
                  </Button.Outline>
                </Container.FlexRow>
              )}
              <div className="mt-1.5 flex flex-row-reverse gap-2">
                <Link to={routePaths.signUp}>회원가입</Link>
                <Divider.Row />
                <Link to={routePaths.signPasswordReset}>비밀번호 찾기</Link>
              </div>
              <Button.Fill
                type="submit"
                className="mt-[2.5rem] w-full rounded-[10px]"
                disabled={isPending}
              >
                <Typography.P3 className="mx-auto pb-[1.125rem] pt-4 leading-150 text-[#F4E7DB]">
                  {isNotVerified ? '인증 후 로그인' : '로그인'}
                </Typography.P3>
              </Button.Fill>
            </form>
          </Form>
        </Container.FlexCol>
      </Container.FlexCol>
      <Container.FlexCol className="gap-[2.25rem] pb-5">
        <div className="flex">
          <Divider.Row className="[&_span]:text-sm">
            SNS 계정으로 로그인
          </Divider.Row>
        </div>
        <Container.FlexCol className="gap-y-5">
          <IconButton.Ghost
            id="kakao"
            className="justify-center gap-x-[0.75rem] rounded-[6px] !bg-[#FEE500] py-[0.96875rem]"
            iconType="kakaotalk-logo"
            disabled={isPending}
            direction="left"
            onClick={onClickSocial}
          >
            <Typography.SubTitle3 className="pt-[0.0625rem] font-[500] leading-150">
              카카오로 시작하기
            </Typography.SubTitle3>
          </IconButton.Ghost>
          <IconButton.Ghost
            id="google"
            className="justify-center gap-x-[0.75rem] rounded-[6px] border-[1px] border-[#BCBCBC] py-[0.90625rem]"
            iconType="google-logo"
            disabled={isPending}
            direction="left"
            onClick={onClickSocial}
          >
            {/* eslint-disable-next-line tailwindcss/no-contradicting-classname */}
            <Typography.SubTitle3 className="pt-[0.0625rem] font-Noto-Sans-KR font-[500] leading-150 text-[#00000089]">
              Google로 시작하기
            </Typography.SubTitle3>
          </IconButton.Ghost>
        </Container.FlexCol>
      </Container.FlexCol>
      </>
  );
}
