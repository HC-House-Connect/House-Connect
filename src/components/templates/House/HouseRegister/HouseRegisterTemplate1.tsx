import { KeyboardEvent, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { MoleculeSelectorState } from '@/components/organisms/districtSelector/selector.store';
import { SignupProfileStateSelector } from '@/stores/sign.store';
import { HouseFormType } from '@/types/house.type';
import {
  UserLifeStyleType,
  UserMateStyleType,
} from '@/components/pages/HouseRegister';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import BadgeButton from '@/components/molecules/BadgeButton';
import DistrictSelector from '@/components/organisms/districtSelector/DistrictSelector';
import BadgeButtons from '@/components/molecules/BadgeButtons';
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import FormItem from '@/components/molecules/FormItem';
import MultiImageForm from '@/components/templates/House/HouseRegister/MultiImageForm';
import Input from '@/components/atoms/Input';
import TextAreaField from '@/components/molecules/TextAreaField';
import {
  houseTypeDisplayData,
  rentalTypeDisplayData,
} from '@/constants/signUpProfileData';
import { floorDisplayData } from '@/constants/houseData';
import HouseFormRow from '@/components/molecules/HouseFormRow';
import { houseTypesInfo, rentalTypesInfo } from '@/constants/profileDetailInfo';

type Template1HiddenState = {
  house_type: HouseFormType['house_type'];
  rental_type: HouseFormType['rental_type'];
  house_appeal: HouseFormType['house_appeal'];
  floor: HouseFormType['floor'];
};

type HouseRegisterTemplate1Prop = {
  userId: string;
  houseId: string;
  isEditMode: boolean;
  locationError: boolean;
  setLocationError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HouseRegisterTemplate1({
  userId,
  houseId,
  isEditMode,
  locationError,
  setLocationError,
}: HouseRegisterTemplate1Prop) {
  const form = useFormContext<
    HouseFormType & UserLifeStyleType & UserMateStyleType
  >();
  const [template1HiddenState, setTemplate1HiddenState] =
    useState<Template1HiddenState>({
      house_type: form.getValues('house_type') || 0,
      rental_type: form.getValues('rental_type') || 1,
      house_appeal: form.getValues('house_appeal') || [],
      floor: form.getValues('floor') || 0,
    });

  const [term, setTerm] = useRecoilState(SignupProfileStateSelector('term'));
  const [region, setRegion] = useRecoilState(MoleculeSelectorState('지역'));
  const [district, setDistrict] = useRecoilState(
    MoleculeSelectorState('시, 구'),
  );

  const setLocation = () => {
    if (form.watch('region') !== '지역' && form.watch('district') !== '시, 구')
      return `${form.watch('region')} ${form.watch('district')}`;
    return '';
  };

  const location = setLocation();

  const onDeleteLocationBadge = () => {
    setRegion({ value: '지역', isOpen: false });
    setDistrict({ value: '시, 구', isOpen: false });
    setLocationError(true);
  };

  const onClickHouseType = (stateValue: HouseFormType['house_type']) => {
    form.setValue('house_type', stateValue);
    setTemplate1HiddenState(prev => ({
      ...prev,
      house_type: stateValue,
    }));
  };

  const onClickRentalType = (stateValue: HouseFormType['rental_type']) => {
    form.setValue('rental_type', stateValue);
    setTemplate1HiddenState(prev => ({
      ...prev,
      rental_type: stateValue,
    }));
  };

  const onClickFloorType = (stateValue: HouseFormType['floor']) => {
    form.setValue('floor', stateValue);
    setTemplate1HiddenState(prev => ({
      ...prev,
      floor: stateValue,
    }));
  };

  const [appeal, setAppeal] = useState('');

  const onChangeAppeal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const content = e.currentTarget.value;
    setAppeal(content);
  };

  const createBadge = () => {
    const appeals = form.watch('house_appeal');
    if (appeals.length < 5 && !appeals.includes(appeal) && appeal !== '') {
      appeals.push(appeal);
      form.setValue('house_appeal', appeals);
      setAppeal('');
    } else if (appeals.length === 5) {
      form.setError('house_appeal', {
        type: 'maxLength',
        message: '특징은 최대 5개까지만 작성할 수 있습니다.',
      });
    }
  };

  const pressEnterCreateBadge = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      createBadge();
    }
  };

  const onDeleteAppealBadge = (appealContent: string) => {
    const appeals = form
      .watch('house_appeal')
      .filter(houseAppeal => houseAppeal !== appealContent);
    form.setValue('house_appeal', appeals);
    form.trigger('house_appeal');
  };

  // 마지막 요소에서 tab 키로 다음 캐러셀로 이동하지 않도록 하는 핸들러
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      if (event.target instanceof HTMLElement) {
        (event.target as HTMLElement).focus();
      }
    }
  };
  return (
    <Container.FlexCol className="mt-8 min-w-full flex-1 px-1">
      <Container.FlexCol className="min-w-[13rem] max-w-[75rem]">
        <Typography.Head3 className="mb-10 text-brown">
          나의 하우스
        </Typography.Head3>
        <Container.FlexCol className="gap-[3.25rem] tablet:gap-[5.5rem]">
          <MultiImageForm
            userId={userId}
            houseId={houseId}
            isEditMode={isEditMode}
          />
          <HouseFormRow
            title="제목"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <FormItem.TextField
              containerStyle="w-full"
              inputStyle="w-full"
              type="text"
              name="post_title"
              placeholder="제목을 작성해주세요"
            />
          </HouseFormRow>
          <HouseFormRow
            title="위치"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol>
              {location && (
                <BadgeButton.Fill
                  className="mb-[2rem] gap-[1rem] rounded-full px-5 pb-2 pt-2.5 text-bg"
                  iconType="close"
                  stroke="bg"
                  id="location"
                  onClick={onDeleteLocationBadge}
                >
                  <Typography.P2>{location}</Typography.P2>
                </BadgeButton.Fill>
              )}
              <DistrictSelector />
              {location === '' && locationError && (
                <Typography.Span2 className="mt-[8px] block text-point">
                  주거지의 지역을 선택해주세요.
                </Typography.Span2>
              )}
              <FormItem.Hidden<Pick<HouseFormType, 'region'>>
                name="region"
                valueProp={region.value}
              />
              <FormItem.Hidden<Pick<HouseFormType, 'district'>>
                name="district"
                valueProp={district.value}
              />
            </Container.FlexCol>
          </HouseFormRow>
          <HouseFormRow
            title="집유형"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol>
              <Container.FlexRow className="mb-4 flex-wrap gap-2">
                {houseTypeDisplayData.map(house => (
                  <BadgeButton.Outline
                    key={house.displayValue}
                    className="rounded-full px-5 pb-2 pt-2.5"
                    onClick={() =>
                      onClickHouseType(
                        house.stateValue as keyof typeof houseTypesInfo,
                      )
                    }
                    badgeActive={house.stateValue === form.watch('house_type')}
                  >
                    <Typography.P2>{house.displayValue}</Typography.P2>
                  </BadgeButton.Outline>
                ))}
                <FormItem.Hidden<Pick<HouseFormType, 'house_type'>>
                  name="house_type"
                  valueProp={template1HiddenState.house_type}
                />
              </Container.FlexRow>
              <Container.FlexRow className="flex-wrap gap-2">
                {rentalTypeDisplayData.map(({ displayValue, stateValue }) => (
                  <BadgeButton.Outline
                    key={displayValue}
                    className="rounded-full px-5 pb-2 pt-2.5"
                    onClick={() =>
                      onClickRentalType(
                        stateValue as keyof typeof rentalTypesInfo,
                      )
                    }
                    badgeActive={stateValue === form.watch('rental_type')}
                  >
                    <Typography.P2>{displayValue}</Typography.P2>
                  </BadgeButton.Outline>
                ))}
                <FormItem.Hidden<Pick<HouseFormType, 'rental_type'>>
                  name="rental_type"
                  valueProp={template1HiddenState.rental_type}
                />
              </Container.FlexRow>
            </Container.FlexCol>
          </HouseFormRow>
          <HouseFormRow
            title="크기/방 개수"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol>
              <Container.FlexRow className="items-center gap-[24px] text-brown">
                <Input
                  type="text"
                  className="w-[4.5rem] p-2"
                  placeholder="12"
                  {...form.register('house_size', { valueAsNumber: true })}
                />
                <div className="flex gap-[18px]">
                  <Typography.P2>평</Typography.P2>
                  <Typography.P2>/</Typography.P2>
                  <Typography.P2>방</Typography.P2>
                </div>
                <Input
                  type="text"
                  className="w-[4.5rem] p-2"
                  placeholder="1"
                  {...form.register('room_num', { valueAsNumber: true })}
                />
                <span>개</span>
              </Container.FlexRow>
              {form.formState.errors.house_size ? (
                <Typography.Span2
                  className={`${!form.formState.errors.house_size?.message && 'invisible h-3'} mt-[8px] block text-point`}
                >
                  {form.formState.errors.house_size?.message as string}
                </Typography.Span2>
              ) : (
                <Typography.Span2
                  className={`${!form.formState.errors.room_num?.message && 'invisible h-3'} mt-[8px] block text-point`}
                >
                  {form.formState.errors.room_num?.message as string}
                </Typography.Span2>
              )}
            </Container.FlexCol>
          </HouseFormRow>
          <HouseFormRow
            title="건물층 옵션"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexRow className="gap-2">
              {floorDisplayData.map(({ displayValue, stateValue }) => (
                <BadgeButton.Outline
                  key={displayValue}
                  className="rounded-full px-5 pb-2 pt-2.5"
                  onClick={() => onClickFloorType(stateValue)}
                  badgeActive={stateValue === form.watch('floor')}
                >
                  <Typography.P2>{displayValue}</Typography.P2>
                </BadgeButton.Outline>
              ))}
            </Container.FlexRow>
          </HouseFormRow>
          <HouseFormRow
            title="가격"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol className="gap-[2rem]">
              <Container.FlexRow className="items-center gap-[1.5rem]">
                <Typography.SubTitle2 className="w-[3.375rem] text-brown">
                  보증금
                </Typography.SubTitle2>
                <Input
                  type="text"
                  className="w-[6rem]"
                  {...form.register('deposit_price', { valueAsNumber: true })}
                  placeholder="500"
                />
                <Typography.P2 className="whitespace-nowrap text-brown">
                  만원
                </Typography.P2>
                <Typography.Span2
                  className={`${!form.formState.errors.deposit_price?.message && 'invisible h-3'} mt-[8px] block text-point`}
                >
                  {form.formState.errors.deposit_price?.message as string}
                </Typography.Span2>
              </Container.FlexRow>
              <Container.FlexRow className="items-center gap-[1.5rem]">
                <Typography.SubTitle2 className="w-[3.375rem] text-brown">
                  월세
                </Typography.SubTitle2>
                <Input
                  type="text"
                  className="w-[6rem]"
                  {...form.register('monthly_price', { valueAsNumber: true })}
                  placeholder="50"
                />
                <Typography.P2 className="whitespace-nowrap text-brown">
                  만원
                </Typography.P2>
                <Typography.Span2
                  className={`${!form.formState.errors.monthly_price?.message && 'invisible h-3'} mt-[8px] block text-point`}
                >
                  {form.formState.errors.monthly_price?.message as string}
                </Typography.Span2>
              </Container.FlexRow>
              <Container.FlexRow className="items-center gap-[1.5rem]">
                <Typography.SubTitle2 className="w-[3.375rem] text-brown">
                  관리비
                </Typography.SubTitle2>
                <Container.FlexRow className="items-center gap-[1.5rem]">
                  <Input
                    type="text"
                    className="w-[6rem]"
                    {...form.register('manage_price', { valueAsNumber: true })}
                    placeholder="30"
                  />
                  <Typography.P2 className="whitespace-nowrap text-brown">
                    만원
                  </Typography.P2>
                  <Typography.Span2
                    className={`${!form.formState.errors.manage_price?.message && 'invisible h-3'} mt-[8px] block text-point`}
                  >
                    {form.formState.errors.manage_price?.message as string}
                  </Typography.Span2>
                </Container.FlexRow>
              </Container.FlexRow>
            </Container.FlexCol>
          </HouseFormRow>
          <HouseFormRow
            title="특징"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol>
              <input
                type="text"
                value={appeal}
                onChange={onChangeAppeal}
                onKeyDown={pressEnterCreateBadge}
                className=" h-14 max-w-[30.4375rem] rounded-lg border-[1px] border-solid border-brown bg-transparent p-[1rem] caret-brown ring-subColor2 placeholder:text-brown3 focus:border-point focus:outline-none focus:ring-1 focus:ring-point"
                placeholder="EX) 역 도보 5분, 정류장 3분, 햇빛 잘 들어요"
              />
              {form.formState.errors.house_appeal && (
                <Typography.Span2
                  className={`${!form.formState.errors.house_appeal?.message && 'invisible h-3'} mt-2 block text-point`}
                >
                  {form.formState.errors.house_appeal?.message as string}
                </Typography.Span2>
              )}
              <BadgeButtons
                contents={form.watch('house_appeal')}
                className="mt-4 flex-wrap gap-2"
                badgeStyle="rounded-full px-5 pb-2 pt-2.5"
                iconStyle="ml-2"
                stroke="bg"
                iconType="close"
                typoStyle="text-bg"
                onClick={onDeleteAppealBadge}
              />
              <FormItem.Hidden<Pick<HouseFormType, 'house_appeal'>>
                name="house_appeal"
                valueProp={template1HiddenState.house_appeal}
              />
            </Container.FlexCol>
          </HouseFormRow>
          <HouseFormRow
            title="원하는 기간"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Container.FlexCol>
              <LabelDualInputRange
                className="max-w-[30rem]"
                min={0}
                max={24}
                step={1}
                setRangeValue={setTerm}
                rangeValue={term}
                category="term"
              />
              <FormItem.Hidden<Pick<HouseFormType, 'term'>>
                name="term"
                valueProp={term}
              />
            </Container.FlexCol>
          </HouseFormRow>
          <HouseFormRow
            title="상세설명"
            gridClassName="tablet:grid-cols-[12.8125rem_auto]"
          >
            <Controller
              name="describe"
              control={form.control}
              render={({ field }) => (
                <TextAreaField
                  {...field}
                  placeholder="집에 대한 설명이나 내가 원하는 조건에 대해 더 소개할 것이 있다면 작성해주세요 (200자 이내)"
                  textAreaStyle="h-[10rem] resize-none rounded-lg border border-solid border-brown bg-inherit p-5 placeholder:text-brown3"
                  maxLength={200}
                  rows={5}
                  cols={100}
                  onKeyDown={handleKeyDown}
                />
              )}
            />
          </HouseFormRow>
        </Container.FlexCol>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
