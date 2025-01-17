/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Children, ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { routePaths } from '@/constants/route';
import Container from '@/components/atoms/Container';
import IconButton from '@/components/molecules/IconButton';
import Typography from '@/components/atoms/Typography';
import Carousel from '@/components/organisms/Carousel';
import StepNavLinks from '@/components/molecules/StepNavLinks';
import cn from '@/libs/cn';
import {
  signUpProfileValidationConfig,
  stepDisplayData,
  ValidationStep,
} from '@/constants/signUpProfileData';
import { SignUpProfileFormType } from '@/types/signUp.type';
import { createToast } from '@/libs/toast';

type StepTitleType = {
  num: string | number;
  title: string;
  isActive?: boolean;
};

function StepTitle({ num, title, isActive }: StepTitleType) {
  return (
    <Container.FlexRow className="mb-3 items-center gap-3">
      <div
        className={cn(
          'size-9 rounded-full flex justify-center items-center',
          isActive ? 'bg-brown' : 'bg-brown2',
        )}
      >
        <span className="translate-x-[0.0625rem] translate-y-[-0.0625rem] text-lg font-semibold text-bg">
          {num}
        </span>
      </div>
      <Typography.SubTitle3
        className={cn('font-semibold', isActive ? 'text-brown' : 'text-brown2')}
      >
        {title}
      </Typography.SubTitle3>
    </Container.FlexRow>
  );
}

StepTitle.defaultProps = {
  isActive: false,
};

type SignProfileLayoutTemplateProps = {
  children: ReactNode;
  isSubmitted: boolean;
};

export default function SignUpProfileLayoutTemplate(
  props: Readonly<SignProfileLayoutTemplateProps>,
) {
  const { children, isSubmitted } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [passedPage, setPassedPage] = useState<number[]>([]);
  const navigate = useNavigate();
  const numsOfCarouselChildren = Children.count(children);
  const [isFirstOfCarousel, isLastOfCarousel] = [
    currentStep === 0,
    currentStep === numsOfCarouselChildren - 1,
  ];
  const isInitialRendered = useRef<boolean>(true);
  const {
    trigger,
    formState: { errors },
  } = useFormContext<SignUpProfileFormType>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    trigger();
  }, []);

  const validationStep = async (carouselStep: ValidationStep) => {
    const validationConfig = signUpProfileValidationConfig[carouselStep];

    if (!validationConfig) return true;

    const { fields } = validationConfig;
    const isStepValid = await trigger(fields);

    if (!isStepValid) {
      fields.forEach(field => {
        const message = errors[field]?.message;
        if (message) {
          createToast(`${field}ValidationError`, message, {
            containerId: 'signUpProfileToastContainer',
            autoClose: 1000,
            isLoading: false,
            type: 'error',
          });
        }
      });
      return false;
    }
    return true;
  };

  const onClickPrevButton = () => {
    if (isFirstOfCarousel) navigate(routePaths.signUpProfileIntro);
    else setCurrentStep(prev => prev - 1);
  };

  const onClickNextButton = async () => {
    const canGoNextCarousel = await validationStep(
      currentStep as ValidationStep,
    );

    if (canGoNextCarousel) {
      setCurrentStep(prev => prev + 1);
      setPassedPage(prev => [...new Set([...prev, currentStep])]);
    }
  };

  // * persist carousel state(currentStep) with session Storage
  useEffect(() => {
    const carouselStepKey = 'carouselStep';
    const carouselStep = sessionStorage.getItem(carouselStepKey);

    if (isInitialRendered.current) {
      isInitialRendered.current = false;

      if (carouselStep) {
        const stepNumber = JSON.parse(carouselStep);
        setCurrentStep(stepNumber);
        setPassedPage(
          Array.from({ length: stepNumber + 1 }, (_, i) => stepNumber - i),
        );
      }
    } else {
      sessionStorage.setItem(carouselStepKey, JSON.stringify(currentStep));
    }
  }, [currentStep]);

  const onClickstepNavLinkValidate = async (step: ValidationStep) =>
    passedPage.includes(step) ? setCurrentStep(step) : null;

  return (
    // ! 9.25rem은 prev, next button section의 높이 값
    <>
      <Container.FlexRow className="w-full justify-between gap-[3.75rem]">
        <Container.FlexCol className="hidden h-[calc(100vh-9.25rem)] min-h-[31rem] min-w-[13rem] overflow-y-scroll pb-[10rem] lg:block">
          {stepDisplayData.map(({ stepTitle, stepNum, stepContents }) => (
            <Container.FlexCol key={stepTitle} className="mb-12">
              <StepTitle
                num={stepNum}
                isActive={stepContents.some(
                  content => content.carouselCurrentStep === currentStep,
                )}
                title={stepTitle}
              />
              <StepNavLinks
                className="pl-[0.875rem]"
                contents={stepContents.map(stepContent => ({
                  ...stepContent,
                  isActive: currentStep === stepContent.carouselCurrentStep,
                  onClick: () =>
                    onClickstepNavLinkValidate(
                      stepContent.carouselCurrentStep as ValidationStep,
                    ),
                }))}
              />
            </Container.FlexCol>
          ))}
        </Container.FlexCol>
        <Container.FlexCol className="size-full h-[calc(100vh-9.25rem)] pb-[10rem]">
          <Carousel.NonFocusable order={currentStep}>
            {children}
          </Carousel.NonFocusable>
        </Container.FlexCol>
      </Container.FlexRow>
      <Container.FlexRow className="absolute bottom-0 right-0 z-20 w-full justify-end gap-x-3 bg-bg pb-[3.75rem] pr-8 pt-8">
        <IconButton.Outline
          className="flex size-[3rem] flex-row-reverse items-center justify-center gap-x-[0.625rem] rounded-[2rem] tablet:h-14 tablet:w-36"
          iconType="left-arrow"
          disabled={isSubmitted}
          onClick={onClickPrevButton}
        >
          <Typography.P1 className="hidden text-brown tablet:block">
            이전
          </Typography.P1>
        </IconButton.Outline>
        {isLastOfCarousel ? (
          <IconButton.Fill
            key="signUpProfileSubmitButton"
            className="flex size-[3rem] items-center justify-center gap-x-[0.625rem] rounded-[2rem] tablet:h-14 tablet:w-36"
            iconType="done"
            stroke="bg"
            type="submit"
            disabled={isSubmitted}
          >
            <Typography.P1 className="hidden text-bg tablet:block">
              완료
            </Typography.P1>
          </IconButton.Fill>
        ) : (
          <IconButton.Fill
            key="signUpProfileNextButton"
            className="flex size-[3rem] items-center justify-center gap-x-[0.625rem] rounded-[2rem] tablet:h-14 tablet:w-36"
            iconType="right-arrow"
            stroke="bg"
            onClick={onClickNextButton}
            type="button"
          >
            <Typography.P1 className="hidden text-bg tablet:block">
              다음
            </Typography.P1>
          </IconButton.Fill>
        )}
      </Container.FlexRow>
    </>
  );
}
