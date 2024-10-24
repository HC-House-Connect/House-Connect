import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import Container from '@/components/atoms/Container';
import FormItem from '@/components/molecules/FormItem';
import Button from '@/components/atoms/Button';
import Typography from '@/components/atoms/Typography';
import { SignUpdatePassword, SignUpdatePasswordType } from '@/types/auth.type';
import { useSignUpdatePassword } from '@/hooks/useSignPasswordReset';
import { routePaths } from '@/constants/route';

export default function SignUpdatePasswordTemplate() {
  const [showPassword, setShowPassword] = useState(false);
  const Form = FormProvider;
  const form = useForm<SignUpdatePasswordType>({
    resolver: zodResolver(SignUpdatePassword),
  });
  const onClickShowPassword = () => setShowPassword(prev => !prev);
  const { updatePassword, isPending } = useSignUpdatePassword();
  const onSubmit = (data: SignUpdatePasswordType) => {
    updatePassword(data);
  };
  return (
    <Container.FlexCol className="gap-[3.5rem]">
      <Typography.Head2 className="text-brown">비밀번호 변경</Typography.Head2>
      <Container className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Container.FlexCol className="gap-[1.75rem]">
              <FormItem.Password
                labelName="비밀번호"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="비밀번호 입력"
                inputStyle="w-full mt-[1rem]"
                disabled={isPending}
                isVisible={showPassword}
                onClickVisible={onClickShowPassword}
              />
              <FormItem.Password
                labelName="비밀번호 재입력"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="비밀번호 입력"
                inputStyle="w-full mt-[1rem]"
                disabled={isPending}
                isVisible={showPassword}
                onClickVisible={onClickShowPassword}
              />
            </Container.FlexCol>
            <Button.Fill
              type="submit"
              className="mt-[2.5rem] w-full rounded-[10px]"
              disabled={isPending}
            >
              <Typography.P3 className="mx-auto my-[1rem] py-[0.25rem] text-[#F4E7DB]">
                확인
              </Typography.P3>
            </Button.Fill>
            <Link to={routePaths.signIn} className="w-full">
              <Button.Outline
                className="mx-auto my-[1.25rem] w-full rounded-[10px]"
                disabled={isPending}
              >
                <Typography.P3 className="mx-auto my-[1rem] py-[0.1875rem] text-brown">
                  로그인 페이지로 이동
                </Typography.P3>
              </Button.Outline>
            </Link>
          </form>
        </Form>
      </Container>
    </Container.FlexCol>
  );
}
