import { useRecoilState } from 'recoil';

import Container from '@/components/atoms/Container';
import SignUpProfileStepTitleTemplate from '@/components/templates/SignUpProfileStepTitle.template';
import Typography from '@/components/atoms/Typography';
import Button from '@/components/atoms/Button';
import IconButton from '@/components/molecules/IconButton';
import { SignupProfileStateSelector } from '@/stores/sign.store';
import { SignUpType } from '@/types/signUp.type';
import { IconType } from '@/types/icon.type';

export const houseTypeInfos: {
  displayValue: string;
  stateValue: SignUpType['type'];
  iconType: IconType;
}[] = [
  {
    displayValue: '원룸/오피스텔',
    stateValue: 0,
    iconType: 'studio-officetel',
  },
  {
    displayValue: '빌라/연립',
    stateValue: 1,
    iconType: 'villa-townhouse',
  },
  {
    displayValue: '아파트',
    stateValue: 2,
    iconType: 'apartment',
  },
  {
    displayValue: '단독주택',
    stateValue: 3,
    iconType: 'single-family-house',
  },
];

export const rentalTypeInfos: {
  displayValue: string;
  stateValue: SignUpType['rental_type'];
}[] = [
  {
    displayValue: '월세',
    stateValue: 1,
  },
  {
    displayValue: '반전세',
    stateValue: 2,
  },
  {
    displayValue: '전세',
    stateValue: 3,
  },
  {
    displayValue: '상관없음',
    stateValue: 0,
  },
];

export default function SignUpProfile1_1Template() {
  const [houseType, setHouseType] = useRecoilState(
    SignupProfileStateSelector('type'),
  );
  const [rentalType, setRentalType] = useRecoilState(
    SignupProfileStateSelector('rental_type'),
  );

  const onClickType = (stateValue: SignUpType['type']) =>
    setHouseType(stateValue);
  const onClickRentalType = (stateValue: SignUpType['rental_type']) =>
    setRentalType(stateValue);

  return (
    <Container.FlexCol className="min-w-full px-2">
      <Container.FlexCol>
        <SignUpProfileStepTitleTemplate step="1-1" title="내가 찾는 집은..." />
        <Typography.SubTitle1 className="text-brown">
          집 유형
        </Typography.SubTitle1>
        {/* TODO ICON 변경 */}
        <Container.FlexRow className="mb-[4.25rem] mt-11 gap-x-6">
          {houseTypeInfos.map(({ displayValue, stateValue, iconType }) => (
            <IconButton.Outline
              key={displayValue}
              className="flex-1 gap-y-5 rounded-lg py-5"
              isActive={stateValue === houseType}
              iconType={iconType}
              direction="top"
              onClick={() => onClickType(stateValue)}
            >
              <Typography.P2 className="text-brown">
                {displayValue}
              </Typography.P2>
            </IconButton.Outline>
          ))}
        </Container.FlexRow>
        <Typography.SubTitle1 className="text-brown">
          매물 종류
        </Typography.SubTitle1>
        <Container.FlexRow className="mt-11 gap-x-6">
          {rentalTypeInfos.map(({ displayValue, stateValue }) => (
            <Button.Outline
              key={displayValue}
              className="flex-1 rounded-lg py-5"
              isActive={stateValue === rentalType}
              onClick={() => onClickRentalType(stateValue)}
            >
              <Typography.P2 className="flex-1 text-brown">
                {displayValue}
              </Typography.P2>
            </Button.Outline>
          ))}
        </Container.FlexRow>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
