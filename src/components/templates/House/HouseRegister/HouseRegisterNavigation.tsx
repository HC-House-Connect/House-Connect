import { useNavigate } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import { routePaths } from '@/constants/route';
import cn from '@/libs/cn';
import useIsOverSTabletBreakpoint from '@/hooks/useIsOverSTabletBreakpoint';
import IconButton from '@/components/molecules/IconButton';

type NavigationProps = {
  currentStep: number;
  onClickNextCarousel: () => void;
  onClickPrevCarousel: () => void;
  onClickSaveTemporary: () => void;
  buttonDisable: boolean;
  carouselLength: number;
};

export default function HouseRegisterNavigation({
  currentStep,
  onClickNextCarousel,
  onClickPrevCarousel,
  onClickSaveTemporary,
  buttonDisable,
  carouselLength,
}: NavigationProps) {
  const navigate = useNavigate();
  const [isOverSTabletBreakpoint] = useIsOverSTabletBreakpoint();
  <h1>mobile navigation</h1>;
  const overSTabletCommonButtonStyle =
    'flex h-[3.5rem] w-[9.25rem] justify-center items-center rounded-[2rem] p-2';
  const underSTabletCommonButtonStyle =
    'flex justify-center items-center px-4 py-2 rounded-none';
  const isLastStep = currentStep === carouselLength - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Container.FlexRow
      className={cn(
        'sticky top-0 z-10 w-full justify-between bg-bg pt-4 pb-8',
        's-tablet:bottom-0 s-tablet:border-t-[1px] s-tablet:border-brown s-tablet:py-8',
      )}
    >
      {isOverSTabletBreakpoint && (
        <>
          <Container.FlexRow>
            <Button.Outline
              className={overSTabletCommonButtonStyle}
              onClick={() => navigate(routePaths.root)}
              disabled={buttonDisable}
            >
              <Typography.P1 className="text-brown">취소</Typography.P1>
            </Button.Outline>
          </Container.FlexRow>
          <Container.FlexRow className="gap-4">
            {!isFirstStep && (
              <Button.Outline
                className={overSTabletCommonButtonStyle}
                onClick={onClickPrevCarousel}
              >
                <Typography.P1 className="text-brown">이전</Typography.P1>
              </Button.Outline>
            )}
            <Button.Fill
              key={
                isLastStep
                  ? 'houseRegisterSubmitButton'
                  : 'houseRegisterNextButton'
              }
              type={isLastStep ? 'submit' : 'button'}
              className={overSTabletCommonButtonStyle}
              onClick={isLastStep ? () => {} : onClickNextCarousel}
              disabled={buttonDisable}
            >
              <Typography.P1 className="text-bg">
                {isLastStep ? '완료' : '다음'}
              </Typography.P1>
            </Button.Fill>
          </Container.FlexRow>
        </>
      )}
      {!isOverSTabletBreakpoint && (
        <>
          <IconButton.Ghost
            className="border-none bg-transparent"
            fill="brown1"
            iconType="close"
            iconClassName="size-5"
            onClick={() => navigate(routePaths.root)}
            disabled={buttonDisable}
          />
          <Container.FlexRow>
            <Button.Ghost
              className={underSTabletCommonButtonStyle}
              onClick={onClickSaveTemporary}
              disabled={buttonDisable}
            >
              <Typography.P2 className="text-brown">임시저장</Typography.P2>
            </Button.Ghost>
            {!isFirstStep && (
              <Button.Ghost
                className={underSTabletCommonButtonStyle}
                onClick={onClickPrevCarousel}
                disabled={buttonDisable}
              >
                <Typography.P2 className="text-brown">이전</Typography.P2>
              </Button.Ghost>
            )}
            <Button.Ghost
              key={
                isLastStep
                  ? 'houseRegisterSubmitButton'
                  : 'houseRegisterNextButton'
              }
              type={isLastStep ? 'submit' : 'button'}
              onClick={isLastStep ? () => {} : onClickNextCarousel}
              disabled={buttonDisable}
              className={underSTabletCommonButtonStyle}
            >
              <Typography.P2 className="text-brown">
                {isLastStep ? '완료' : '다음'}
              </Typography.P2>
            </Button.Ghost>
          </Container.FlexRow>
        </>
      )}
    </Container.FlexRow>
  );
}
