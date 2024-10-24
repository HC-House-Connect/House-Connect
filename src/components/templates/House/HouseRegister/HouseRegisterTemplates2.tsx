import { KeyboardEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { SignUpProfileFormType } from '@/types/signUp.type';
import {
  UserLifeStyleType,
  UserMateStyleType,
} from '@/components/pages/HouseRegister';
import { HouseFormType } from '@/types/house.type';
import {
  matesGenderDisplayData,
  registPetDisplayData,
} from '@/constants/houseData';
import {
  mateNumberDisplayData,
  smokeDisplayData,
} from '@/constants/signUpProfileData';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import BadgeButton from '@/components/molecules/BadgeButton';
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import BadgeButtons from '@/components/molecules/BadgeButtons';
import Accordion from '@/components/molecules/Accordion';
import FormItem from '@/components/molecules/FormItem';
import HouseFormRow from '@/components/molecules/HouseFormRow';

export default function HouseRegisterTemplates2() {
  const form = useFormContext<
    HouseFormType & UserLifeStyleType & UserMateStyleType
  >();
  const [userLifeStyle, setUserLifeStyle] = useState<UserLifeStyleType>({
    smoking: form.getValues('smoking'),
    pet: form.getValues('pet'),
    appeals: form.getValues('appeals'),
  });

  const [userMateStyle, setUserMateStyle] = useState<UserMateStyleType>({
    mate_gender: form.getValues('mate_gender'),
    mate_number: form.getValues('mate_number'),
    mate_appeals: form.getValues('mate_appeals'),
    prefer_mate_age: form.getValues('prefer_mate_age'),
  });

  const [preferAge, setPreferAge] = useState<
    UserMateStyleType['prefer_mate_age']
  >(form.watch('prefer_mate_age'));

  const onClickMatesNum = (
    stateValue: SignUpProfileFormType['mate_number'],
  ) => {
    form.setValue('mate_number', stateValue);
    setUserMateStyle(prev => ({
      ...prev,
      mate_number: stateValue,
    }));
  };

  const onClickGenderType = (
    stateValue: SignUpProfileFormType['mate_gender'],
  ) => {
    form.setValue('mate_gender', stateValue);
    setUserMateStyle(prev => ({
      ...prev,
      mate_gender: stateValue,
    }));
  };

  const [mateAppeal, setMateAppeal] = useState('');
  const [myAppeal, setMyAppeal] = useState('');

  const onChangeAppeal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === 'mateAppeals') {
      setMateAppeal(e.currentTarget.value);
    } else if (e.currentTarget.name === 'myAppeals') {
      setMyAppeal(e.currentTarget.value);
    }
  };

  const createBadge = (part: string) => {
    if (part === 'mateAppeals') {
      const mateAppeals = form.getValues('mate_appeals');
      if (!mateAppeals.includes(mateAppeal) && mateAppeal !== '') {
        mateAppeals.push(mateAppeal);
        form.setValue('mate_appeals', mateAppeals);
        setUserMateStyle(prev => ({
          ...prev,
          mate_appeals: mateAppeals,
        }));
        setMateAppeal('');
      }
    } else if (part === 'myAppeals') {
      const myAppeals = form.getValues('appeals');
      if (!myAppeals.includes(myAppeal) && myAppeal !== '') {
        myAppeals.push(myAppeal);
        form.setValue('appeals', myAppeals);
        setUserLifeStyle(prev => ({
          ...prev,
          appeals: myAppeals,
        }));
        setMyAppeal('');
      }
    }
  };

  const pressEnterCreateBadge = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (e.currentTarget.name === 'mateAppeals') {
        createBadge(e.currentTarget.name);
      } else if (e.currentTarget.name === 'myAppeals') {
        createBadge(e.currentTarget.name);
      }
    }
  };

  const onDeleteAppealBadge = (appealContent: string) => {
    const mateAppeals = form.watch('mate_appeals');
    const myAppeals = form.watch('appeals');

    if (mateAppeals.includes(appealContent)) {
      const appeals = mateAppeals.filter(appeal => appeal !== appealContent);
      form.setValue('mate_appeals', appeals);
      setUserMateStyle(prev => ({
        ...prev,
        mate_appeals: appeals,
      }));
    } else if (myAppeals.includes(appealContent)) {
      const appeals = myAppeals.filter(appeal => appeal !== appealContent);
      form.setValue('appeals', appeals);
      setUserLifeStyle(prev => ({
        ...prev,
        appeals,
      }));
    }
  };

  const onClickSmokingType = (stateValue: UserLifeStyleType['smoking']) => {
    form.setValue('smoking', stateValue);
    setUserLifeStyle(prev => ({
      ...prev,
      smoking: stateValue,
    }));
  };

  const onClickPetType = (stateValue: UserLifeStyleType['pet']) => {
    form.setValue('pet', stateValue);
    setUserLifeStyle(prev => ({
      ...prev,
      pet: stateValue,
    }));
  };

  return (
    <Container.FlexCol className="mt-8 min-w-full flex-1 shrink-0 px-1">
      <Container.FlexCol className="min-w-[13rem] max-w-[75rem]">
        <Typography.Head3 className="mb-10 text-brown">
          원하는 룸메이트
        </Typography.Head3>
        <Container.FlexCol className="gap-[5.5rem]">
          <HouseFormRow
            title="성별"
            gridClassName="sm:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexRow className="mb-4 flex-wrap gap-2">
              {matesGenderDisplayData.map(
                ({ displayValue, stateValue, iconType }) => (
                  <BadgeButton.Outline
                    key={displayValue}
                    className="h-10 gap-2 rounded-full px-4"
                    badgeActive={stateValue === form.watch('mate_gender')}
                    iconType={iconType}
                    direction="left"
                    onClick={() => onClickGenderType(stateValue)}
                  >
                    <Typography.P2>{displayValue}</Typography.P2>
                  </BadgeButton.Outline>
                ),
              )}
            </Container.FlexRow>
            <FormItem.Hidden<Pick<UserMateStyleType, 'mate_gender'>>
              name="mate_gender"
              valueProp={userMateStyle.mate_gender}
            />
          </HouseFormRow>
          <HouseFormRow
            title="원하는 인원 수"
            gridClassName="sm:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexRow className="mb-4 flex-wrap gap-2">
              {mateNumberDisplayData.map(({ displayValue, stateValue }) => (
                <BadgeButton.Outline
                  key={displayValue}
                  className="h-10 rounded-full px-5"
                  onClick={() => onClickMatesNum(stateValue)}
                  badgeActive={stateValue === form.watch('mate_number')}
                >
                  <Typography.P2>{displayValue}</Typography.P2>
                </BadgeButton.Outline>
              ))}
            </Container.FlexRow>
            <FormItem.Hidden<Pick<UserMateStyleType, 'mate_number'>>
              name="mate_number"
              valueProp={userMateStyle.mate_number}
            />
          </HouseFormRow>
          <HouseFormRow
            title="원하는 나이"
            gridClassName="sm:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol>
              <LabelDualInputRange
                className="max-w-[30rem] pl-1"
                min={0}
                max={30}
                step={1}
                setRangeValue={setPreferAge}
                rangeValue={preferAge}
                category="age"
              />
            </Container.FlexCol>
            <FormItem.Hidden<Pick<UserMateStyleType, 'prefer_mate_age'>>
              name="prefer_mate_age"
              valueProp={preferAge}
            />
          </HouseFormRow>
          <HouseFormRow
            title="룸메이트 특징"
            gridClassName="sm:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol className="gap-2.5">
              <input
                type="text"
                name="mateAppeals"
                value={mateAppeal}
                onChange={onChangeAppeal}
                onKeyDown={pressEnterCreateBadge}
                className="mb-[1rem] h-14 max-w-[30.4375rem] rounded-lg border-[1px] border-solid border-brown bg-transparent p-[1rem] caret-brown ring-subColor2 placeholder:text-brown3 focus:border-point focus:outline-none focus:ring-1 focus:ring-point"
                placeholder="EX) 반려동물 NO, 늦게자요, 잠귀 어두운 분"
              />
              {form.watch('mate_appeals').length === 0 ? (
                <span className="h-[2.5rem]">&nbsp;</span>
              ) : (
                <BadgeButtons
                  contents={form.watch('mate_appeals')}
                  className="flex-wrap gap-2"
                  badgeStyle="h-10 rounded-full px-5"
                  iconStyle="ml-2"
                  stroke="bg"
                  iconType="close"
                  typoStyle="text-bg"
                  onClick={onDeleteAppealBadge}
                />
              )}
            </Container.FlexCol>
            <FormItem.Hidden<Pick<UserMateStyleType, 'mate_appeals'>>
              name="mate_appeals"
              valueProp={userMateStyle.mate_appeals}
            />
          </HouseFormRow>
          <Container.FlexCol>
            <Accordion
              title="내 프로필 수정"
              titleStyle="text-brown"
              guideline="작성하신 프로필과 달라진 점이 있다면 수정해주세요."
              guideStyle="text-brown1"
              openContainerStyle="bg-brown6 rounded-xl p-8"
            >
              <Container.FlexCol className="gap-11">
                <Container.FlexCol className="gap-6">
                  <Typography.SubTitle2 className="text-brown">
                    흡연여부
                  </Typography.SubTitle2>
                  <Container.FlexRow className="flex-wrap gap-2">
                    {smokeDisplayData.map(
                      ({ displayValue, stateValue, iconType }) => (
                        <BadgeButton.Outline
                          key={displayValue}
                          className="h-10 rounded-full px-4"
                          badgeActive={stateValue === form.watch('smoking')}
                          iconType={iconType}
                          iconClassName="h-[1.75rem] w-auto mr-1.5"
                          direction="left"
                          onClick={() => onClickSmokingType(stateValue)}
                        >
                          <Typography.P2>{displayValue}</Typography.P2>
                        </BadgeButton.Outline>
                      ),
                    )}
                  </Container.FlexRow>
                  <FormItem.Hidden<Pick<UserLifeStyleType, 'smoking'>>
                    name="smoking"
                    valueProp={userLifeStyle.smoking}
                  />
                </Container.FlexCol>
                <Container.FlexCol className="gap-6">
                  <Typography.SubTitle2 className="text-brown">
                    반려동물
                  </Typography.SubTitle2>
                  <Container.FlexRow className="flex-wrap gap-2">
                    {registPetDisplayData.map(
                      ({ displayValue, stateValue, iconType }) => (
                        <BadgeButton.Outline
                          key={displayValue}
                          className="h-10 rounded-full px-3"
                          badgeActive={stateValue === form.watch('pet')}
                          iconType={iconType}
                          iconClassName="w-[1.125rem] h-auto mr-1.5"
                          direction="left"
                          onClick={() => onClickPetType(stateValue)}
                        >
                          <Typography.P2>{displayValue}</Typography.P2>
                        </BadgeButton.Outline>
                      ),
                    )}
                  </Container.FlexRow>
                  <FormItem.Hidden<Pick<UserLifeStyleType, 'pet'>>
                    name="pet"
                    valueProp={userLifeStyle.pet}
                  />
                </Container.FlexCol>
                <Container.FlexCol className="mt-3 gap-6">
                  <Typography.SubTitle2 className="text-brown">
                    나의 라이프 스타일
                  </Typography.SubTitle2>
                  <Container.FlexCol className="gap-2.5">
                    <input
                      type="text"
                      name="myAppeals"
                      value={myAppeal}
                      onChange={onChangeAppeal}
                      onKeyDown={pressEnterCreateBadge}
                      className="mb-[1rem] h-14 max-w-[30.4375rem] rounded-lg border-[1px] border-solid border-brown bg-transparent p-[1rem] placeholder:text-brown3 focus:outline-none focus:ring-1 focus:ring-brown2"
                      placeholder="EX) 반려동물 NO, 늦게자요, 잠귀 어두운 분"
                    />
                    {form.getValues('appeals').length === 0 ? (
                      <span className="h-[2.5rem]">&nbsp;</span>
                    ) : (
                      <BadgeButtons
                        contents={form.watch('appeals')}
                        className="flex-wrap gap-2"
                        badgeStyle="h-10 rounded-full px-5"
                        iconStyle="ml-2"
                        stroke="bg"
                        iconType="close"
                        typoStyle="text-bg"
                        onClick={onDeleteAppealBadge}
                      />
                    )}
                  </Container.FlexCol>
                  <FormItem.Hidden<Pick<UserLifeStyleType, 'appeals'>>
                    name="appeals"
                    valueProp={userLifeStyle.appeals}
                  />
                </Container.FlexCol>
              </Container.FlexCol>
            </Accordion>
          </Container.FlexCol>
        </Container.FlexCol>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
