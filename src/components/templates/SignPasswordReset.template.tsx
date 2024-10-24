import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import Button from '@/components/atoms/Button';
import FormItem from '@/components/molecules/FormItem';
import { SignPasswordReset, SignPasswordResetType } from '@/types/auth.type';
import { useSignPasswordReset } from '@/hooks/useSignPasswordReset';
import IconButton from '@/components/molecules/IconButton';

export default function SignPasswordResetTemplate() {
  const navigate = useNavigate();
  const Form = FormProvider;
  const form = useForm<SignPasswordResetType>({
    resolver: zodResolver(SignPasswordReset),
  });
  const { passwordReset, isPending } = useSignPasswordReset();

  const onClickPasswordReset = (data: SignPasswordResetType) => {
    passwordReset(data);
  };

  const onClickPrevButton = () => {
    navigate(-1);
  };
  return (
    <>
      <IconButton.Ghost
        onClick={onClickPrevButton}
        iconType="back"
        iconClassName="mx-auto"
        className="size-[2.75rem] rounded-full"
      />
      <Container.FlexCol className="gap-[3.5rem]">
        <Typography.Head2 className="text-brown">
          비밀번호 재설정
        </Typography.Head2>
        <Container className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onClickPasswordReset)}>
              <FormItem.TextField
                labelName="이메일"
                name="email"
                placeholder="이메일 입력"
                inputStyle="w-full bg-transparent mt-[1rem]"
              />
              <Button.Fill
                type="submit"
                className="mt-[2.5rem] w-full rounded-[10px] py-[0.25rem]"
                disabled={isPending}
              >
                <Typography.P3 className="mx-auto my-[1rem] text-[#F4E7DB]">
                  완료
                </Typography.P3>
              </Button.Fill>
            </form>
          </Form>
        </Container>
      </Container.FlexCol>
    </>
  );
}
