import { KeyboardEvent, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { TypeOptions } from 'react-toastify';

import { supabase } from '@/libs/supabaseClient';
import { MoleculeSelectorState } from '@/components/organisms/districtSelector/selector.store';
import { HouseForm, HouseFormType } from '@/types/house.type';
import { SignupProfileStateSelector } from '@/stores/sign.store';
import { createToast } from '@/libs/toast';
import { SessionAtom } from '@/stores/auth.store';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import BadgeButton from '@/components/molecules/BadgeButton';
import DistrictSelector from '@/components/organisms/districtSelector/DistrictSelector';
import BadgeButtons from '@/components/molecules/BadgeButtons';
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import Button from '@/components/atoms/Button';
import FormItem from '@/components/molecules/FormItem';
import MultiImageForm from '@/components/molecules/MultiImageForm';
import {
  houseTypeDisplayData,
  mateNumberDisplayData,
  rentalTypeDisplayData,
} from '@/constants/signUpProfileData';

type HiddenStateType = {
  house_type: HouseFormType['house_type'];
  rental_type: HouseFormType['rental_type'];
  mates_num: HouseFormType['mates_num'];
  house_appeal: HouseFormType['house_appeal'];
};

export default function HouseRegisterTemplate() {
  const navigate = useNavigate();
  const userId = useRecoilState(SessionAtom)[0]?.user.id;
  const Form = FormProvider;
  const form = useForm<HouseFormType>({
    resolver: zodResolver(HouseForm),
    defaultValues: {
      house_img: [],
      representative_img: '',
      post_title: '',
      region: '',
      district: '',
      house_type: 0,
      rental_type: 1,
      house_size: undefined,
      room_num: undefined,
      deposit_price: undefined,
      monthly_price: undefined,
      manage_price: undefined,
      house_appeal: [],
      mates_num: 1,
      term: [0, 24],
      describe: undefined,
      bookmark: 0,
      temporary: 0,
      prefer_age: [20, 60],
      user_id: userId,
    },
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [representativeImg, setRepresentativeImg] = useState('');

  const [hiddenState, setHiddenState] = useState<HiddenStateType>({
    house_type: 0,
    rental_type: 1,
    mates_num: 1,
    house_appeal: [],
  });

  const [term, setTerm] = useRecoilState(SignupProfileStateSelector('term'));
  const [region, setRegion] = useRecoilState(MoleculeSelectorState('지역'));
  const [district, setDistrict] = useRecoilState(
    MoleculeSelectorState('시, 구'),
  );
  const location =
    region.value !== '지역' && district.value !== '시, 구'
      ? `${region.value} ${district.value}`
      : '';

  const onDeleteLocationBadge = () => {
    setRegion({ value: '지역', isOpen: false });
    setDistrict({ value: '시, 구', isOpen: false });
  };

  const onClickHouseType = (stateValue: HouseFormType['house_type']) => {
    form.setValue('house_type', stateValue);
    setHiddenState(prev => ({
      ...prev,
      house_type: stateValue,
    }));
  };

  const onClickRentalType = (stateValue: HouseFormType['rental_type']) => {
    form.setValue('rental_type', stateValue);
    setHiddenState(prev => ({
      ...prev,
      rental_type: stateValue,
    }));
  };
  const onClickMatesNum = (stateValue: HouseFormType['mates_num']) => {
    form.setValue('mates_num', stateValue);
    setHiddenState(prev => ({
      ...prev,
      mates_num: stateValue,
    }));
  };

  const [appeal, setAppeal] = useState('');

  const onChangeAppeal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const content = e.currentTarget.value;
    setAppeal(content);
  };

  const createBadge = () => {
    const appeals = form.watch('house_appeal');
    if (!appeals.includes(appeal) && appeal !== '') {
      appeals.push(appeal);
      form.setValue('house_appeal', appeals);
      setAppeal('');
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
  };

  const createHouseToast = (type: TypeOptions, message: string) =>
    createToast('houseUpload', `${message}`, {
      type: `${type}`,
      autoClose: 3000,
      isLoading: false,
    });

  const moveImageStorage = async (postId: string) => {
    try {
      const fullImage = images
        .concat(representativeImg)
        .map(imgUrl => imgUrl.split('/').slice(-1)[0]);

      // 업로드된 이미지를 postId 폴더로 이동
      fullImage.forEach(async imgName => {
        const { error } = await supabase.storage
          .from('images')
          .move(
            `house/${userId}/temporary/${imgName}`,
            `house/${userId}/${postId}/${imgName}`,
          );

        if (error) throw new Error(error.message);
      });

      // 이동후 남아있는 temporary 폴더에 있는 이미지를 가져옴
      const { data: temporaryImg, error: pullError } = await supabase.storage
        .from('images')
        .list(`house/${userId}/temporary`, {
          limit: 100,
          offset: 0,
        });
      if (pullError) throw new Error(pullError.message);

      // 가져왔다면 이미지들을 삭제
      if (temporaryImg) {
        temporaryImg.forEach(async imgObj => {
          const imgName = imgObj.name;
          const { error: removeError } = await supabase.storage
            .from('images')
            .remove([`house/${userId}/temporary/${imgName}`]);

          if (removeError) throw new Error(removeError.message);
        });
      }
    } catch (error) {
      createHouseToast('error', '💧이미지 이동 또는 삭제에 실패했습니다.');
    }
  };

  const onSaveHouse = async (formData: HouseFormType, temporary: 0 | 1) => {
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('house')
        .insert({
          ...formData,
          temporary,
          region: region.value,
          district: district.value,
          house_size: Number(formData.house_size),
          deposit_price: Number(formData.deposit_price),
          monthly_price: Number(formData.monthly_price),
          manage_price: Number(formData.manage_price),
          house_img: images,
          representative_img: representativeImg,
          room_num: Number(formData.room_num),
          term,
        })
        .select('id');

      if (error) {
        throw new Error(error.message);
      }

      // Supabase에서 생성된 postId 가져와서 폴더를 만들어 이미지 이동하고 temporary 폴더내 이미지 삭제하는 함수 호출
      const postId = data[0].id;
      await moveImageStorage(postId);

      createHouseToast('success', '👍🏻 성공적으로 저장되었습니다.');
      navigate('/');
    } catch (error) {
      createHouseToast('error', '💧submit에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitHouse = (formData: HouseFormType) => {
    onSaveHouse(formData, 1);
  };

  const onSaveTemporary = () => {
    const formData = form.getValues();
    onSaveHouse(formData, 0);
  };

  const onError = error => {
    console.log(error);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHouse, onError)}>
        <Container.FlexCol className="gap-[5rem]">
          <Container.FlexRow className="mb-[1.75rem] gap-6">
            <MultiImageForm
              images={images}
              setImages={setImages}
              representativeImg={representativeImg}
              setRepresentativeImg={setRepresentativeImg}
            />
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              제목
            </Typography.SubTitle1>
            <FormItem.TextField
              containerStyle="max-w-[690px] flex-1"
              inputStyle="w-full"
              type="text"
              name="post_title"
              placeholder="제목을 작성해주세요"
            />
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              위치
            </Typography.SubTitle1>
            <Container.FlexCol className="flex-1">
              <Container.FlexRow className="mb-[2rem] gap-2">
                {location && (
                  <BadgeButton.Fill
                    className="gap-[1rem] rounded-[30px] px-[20px] py-[10px] text-bg"
                    iconType="close"
                    stroke="bg"
                    id="location"
                    onClick={onDeleteLocationBadge}
                  >
                    <Typography.P2>{location}</Typography.P2>
                  </BadgeButton.Fill>
                )}
              </Container.FlexRow>
              <DistrictSelector />
              <FormItem.Hidden<Pick<HouseFormType, 'region'>>
                name="region"
                valueProp={region.value}
              />
              <FormItem.Hidden<Pick<HouseFormType, 'district'>>
                name="district"
                valueProp={district.value}
              />
            </Container.FlexCol>
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              집유형
            </Typography.SubTitle1>
            <Container.FlexCol>
              <Container.FlexRow className="mb-4 gap-2">
                {houseTypeDisplayData.map(house => (
                  <BadgeButton.Outline
                    key={house.displayValue}
                    className="rounded-[30px] px-[20px] py-[10px]"
                    onClick={() => onClickHouseType(house.stateValue)}
                    badgeActive={house.stateValue === form.watch('house_type')}
                  >
                    <Typography.P2>{house.displayValue}</Typography.P2>
                  </BadgeButton.Outline>
                ))}
                <FormItem.Hidden<Pick<HouseFormType, 'house_type'>>
                  name="house_type"
                  valueProp={hiddenState.house_type}
                />
              </Container.FlexRow>
              <Container.FlexRow className="gap-2">
                {rentalTypeDisplayData.map(({ displayValue, stateValue }) => (
                  <BadgeButton.Outline
                    key={displayValue}
                    className="rounded-[30px] px-[20px] py-[10px]"
                    onClick={() => onClickRentalType(stateValue)}
                    badgeActive={stateValue === form.watch('rental_type')}
                  >
                    <Typography.P2>{displayValue}</Typography.P2>
                  </BadgeButton.Outline>
                ))}
                <FormItem.Hidden<Pick<HouseFormType, 'rental_type'>>
                  name="rental_type"
                  valueProp={hiddenState.rental_type}
                />
              </Container.FlexRow>
            </Container.FlexCol>
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              크기/방 개수
            </Typography.SubTitle1>
            <Container.FlexRow className="items-center gap-[24px] text-brown">
              <FormItem.TextField
                type="text"
                inputStyle="w-[78px] p-2"
                {...form.register('house_size', { valueAsNumber: true })}
              />
              <div className="flex gap-[18px]">
                <Typography.P2>평</Typography.P2>
                <Typography.P2>/</Typography.P2>
                <Typography.P2>방</Typography.P2>
              </div>
              <FormItem.TextField
                type="text"
                inputStyle="w-[78px] p-2"
                {...form.register('room_num', { valueAsNumber: true })}
              />
              <span>개</span>
            </Container.FlexRow>
          </Container.FlexRow>
          <Container.FlexRow className="text-brown">
            <Typography.SubTitle1 className="w-[205px] text-brown">
              가격
            </Typography.SubTitle1>
            <Container.FlexCol className="gap-[1.5rem]">
              <Container.FlexCol>
                <Typography.SubTitle2 className="mb-[1rem]">
                  보증금
                </Typography.SubTitle2>
                <Container.FlexRow className="items-center gap-[1.5rem]">
                  <FormItem.TextField
                    type="text"
                    inputStyle="w-[11.25rem]"
                    {...form.register('deposit_price', { valueAsNumber: true })}
                    placeholder="500"
                  />
                  <Typography.P2 className="whitespace-nowrap">
                    만원
                  </Typography.P2>
                </Container.FlexRow>
              </Container.FlexCol>
              <Container.FlexCol>
                <Typography.SubTitle2 className="mb-[1em]">
                  월세
                </Typography.SubTitle2>
                <Container.FlexRow className="items-center gap-[1.5rem]">
                  <FormItem.TextField
                    type="text"
                    inputStyle="w-[11.25rem]"
                    {...form.register('monthly_price', { valueAsNumber: true })}
                    placeholder="50"
                  />
                  <Typography.P2 className="whitespace-nowrap">
                    만원
                  </Typography.P2>
                </Container.FlexRow>
              </Container.FlexCol>
              <Container.FlexCol>
                <Typography.SubTitle2 className="mb-[1rem]">
                  관리비
                </Typography.SubTitle2>{' '}
                <Container.FlexRow className="items-center gap-[1.5rem]">
                  <FormItem.TextField
                    type="text"
                    inputStyle="w-[11.25rem]"
                    {...form.register('manage_price', { valueAsNumber: true })}
                    placeholder="30"
                  />
                  <Typography.P2 className="whitespace-nowrap">
                    만원
                  </Typography.P2>
                </Container.FlexRow>
              </Container.FlexCol>
            </Container.FlexCol>
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              특징
            </Typography.SubTitle1>
            <Container.FlexCol>
              <input
                type="text"
                value={appeal}
                onChange={onChangeAppeal}
                onKeyDown={pressEnterCreateBadge}
                className="mb-[20px] h-14 w-[487px] rounded-lg border-[1px] border-solid border-brown bg-transparent p-[16px] placeholder:text-brown3 focus:outline-none focus:ring-1 focus:ring-brown2"
                placeholder="EX) 역 도보 5분, 정류장 3분, 햇빛 잘 들어요"
              />
              {form.watch('house_appeal').length === 0 ? (
                <span className="h-[40px]">&nbsp;</span>
              ) : (
                <BadgeButtons
                  contents={form.watch('house_appeal')}
                  className="gap-2"
                  badgeStyle="rounded-[30px] px-[20px] py-[10px]"
                  iconStyle="ml-2"
                  stroke="bg"
                  iconType="close"
                  typoStyle="text-bg"
                  onClick={onDeleteAppealBadge}
                />
              )}
              <FormItem.Hidden<Pick<HouseFormType, 'house_appeal'>>
                name="house_appeal"
                valueProp={hiddenState.house_appeal}
              />
            </Container.FlexCol>
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              원하는 인원 수
            </Typography.SubTitle1>
            <Container.FlexRow className="gap-2">
              {mateNumberDisplayData.map(({ displayValue, stateValue }) => (
                <BadgeButton.Outline
                  key={displayValue}
                  badgeActive={stateValue === form.watch('mates_num')}
                  onClick={() => onClickMatesNum(stateValue)}
                  className="rounded-[30px] px-[20px] py-[10px]"
                >
                  <Typography.P2>{displayValue}</Typography.P2>
                </BadgeButton.Outline>
              ))}
              <FormItem.Hidden<Pick<HouseFormType, 'mates_num'>>
                name="mates_num"
                valueProp={hiddenState.mates_num}
              />
            </Container.FlexRow>
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              원하는 기간
            </Typography.SubTitle1>
            <Container.FlexCol>
              <LabelDualInputRange
                label="기간"
                className=" w-[480px]"
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
          </Container.FlexRow>
          <Container.FlexRow>
            <Typography.SubTitle1 className="w-[205px] text-brown">
              상세 설명
            </Typography.SubTitle1>
            <textarea
              className="resize-none rounded-[8px] border border-solid border-brown bg-inherit p-5 placeholder:text-brown3"
              {...form.register('describe')}
              maxLength={200}
              rows={8}
              cols={100}
              placeholder="집에 대한 설명이나 내가 원하는 조건에 대해 더 소개할 것이 있다면 작성해주세요 (200자 이내)"
            />
          </Container.FlexRow>
        </Container.FlexCol>
        <hr style={{ marginTop: '5rem', marginBottom: '2.75rem' }} />
        <Container.FlexRow className="justify-between">
          <div>
            <Button.Outline
              className="flex h-[59px] w-[9.25rem] justify-center rounded-[2rem]"
              onClick={() => navigate('/')}
            >
              <Typography.P1 className="text-brown">취소</Typography.P1>
            </Button.Outline>
          </div>
          <Container.FlexRow className="mb-[16rem] gap-[15px]">
            <Button.Outline
              className="flex h-[59px] w-[9.25rem] justify-center rounded-[2rem]"
              onClick={onSaveTemporary}
              disabled={saving}
            >
              <Typography.P1 className="text-brown">임시저장</Typography.P1>
            </Button.Outline>
            <Button.Fill
              className="flex h-[59px] w-[9.5rem] justify-center rounded-[2rem]"
              type="submit"
              disabled={saving}
            >
              <Typography.P1 className="text-bg">완료</Typography.P1>
            </Button.Fill>
          </Container.FlexRow>
        </Container.FlexRow>
      </form>
    </Form>
  );
}
