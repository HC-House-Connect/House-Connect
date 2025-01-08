import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import { SessionAtom } from '@/stores/auth.store';
import { HouseFormType } from '@/types/house.type';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import Carousel from '@/components/organisms/Carousel';
import HouseRegisterTemplate1 from '@/components/templates/house/house-regist/HouseRegister1.template';
import HouseRegisterTemplates2 from '@/components/templates/house/house-regist/HouseRegister2.templates';
import Button from '@/components/atoms/Button';
import {
  useRegistHouse,
  useUpdateHouse,
  useFetchProfileData,
  useUserProfileUpdate,
} from '@/hooks/useHouse';
import HouseRegisterNavigation from '@/components/templates/house/house-regist/HouseRegisterNavigation';
import {
  UserLifeStyleType,
  UserMateStyleType,
} from '@/components/pages/house/house-regist/HouseRegister';
import { supabase } from '@/libs/supabaseClient';

export type HouseRegistFormProps = {
  form: UseFormReturn<HouseFormType & UserLifeStyleType & UserMateStyleType>;
};

export default function HouseRegisterForm({ form }: HouseRegistFormProps) {
  const Form = FormProvider;
  const userId = useRecoilState(SessionAtom)[0]?.user.id as string;
  const { houseId } = useParams<{ houseId: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [locationError, setLocationError] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // 사용자 프로필(user_lifestyle, user_mate_style)을 가져와 초기값을 수정
  const { userLifeStyleQuery, userMateStyleQuery } = useFetchProfileData(
    userId as string,
  );
  const { data: userLifeStyleData, isSuccess: fetchedUserLifeStyle } =
    userLifeStyleQuery;
  const { data: userMateStyleData, isSuccess: fetchedUserMateStyle } =
    userMateStyleQuery;
  // ! reset을 사용하면 undefined여야하는 입력란이 초기값인 NaN이들어가면서 placeholder가 보이지 않아서 setValue 사용
  useEffect(() => {
    if (fetchedUserLifeStyle && fetchedUserMateStyle) {
      const mappedAge = userMateStyleData.prefer_mate_age.map(age => age - 20);
      form.setValue('smoking', userLifeStyleData.smoking);
      form.setValue('pet', userLifeStyleData.pet);
      form.setValue('appeals', userLifeStyleData.appeals);
      form.setValue('mate_gender', userMateStyleData.mate_gender);
      form.setValue('mate_number', userMateStyleData.mate_number);
      form.setValue('mate_appeals', userMateStyleData.mate_appeals);
      form.setValue('prefer_mate_age', mappedAge as [number, number]);
    }
  }, [
    fetchedUserLifeStyle,
    fetchedUserMateStyle,
    form,
    userLifeStyleData,
    userMateStyleData,
  ]);

  const { registHouse, isRegisteringHouse } = useRegistHouse();
  const { updateUserProfile } = useUserProfileUpdate();
  const { updateHouse, isUpdatingHouse } = useUpdateHouse();

  const onUpdateProfile = async (
    formData: HouseFormType & UserLifeStyleType & UserMateStyleType,
  ) => {
    const preferAge = formData.prefer_mate_age.map(age => age + 20);
    updateUserProfile({
      dbName: 'user_lifestyle',
      data: {
        smoking: formData.smoking,
        pet: formData.pet,
        appeals: formData.appeals,
      },
      userId,
    });

    updateUserProfile({
      dbName: 'user_mate_style',
      data: {
        mate_gender: formData.mate_gender,
        mate_number: formData.mate_number,
        mate_appeals: formData.mate_appeals,
        prefer_mate_age: preferAge as [number, number],
      },
      userId,
    });
  };

  const uploadImages = async (files: File[]) => {
    await Promise.all(
      files.map(async file => {
        const { error } = await supabase.storage
          .from('images')
          .upload(`house/${userId}/temp/${file.name}`, file);

        if (error) throw new Error('이미지 업로드 실패');
      }),
    );
  };

  const onSaveHouse = async (
    formData: HouseFormType & UserLifeStyleType & UserMateStyleType,
    temporary: 0 | 1,
  ) => {
    await uploadImages(imageFiles);
    const userStyle = form.getValues();
    const houseImgExcludeRep = formData.house_img.filter(
      imgName => imgName !== formData.representative_img,
    );

    // ! FormData에 user_lifeStyle, user_mate_style도 있어서 houseData만 분리해서 넘겨줘야 함.
    const houseData = {
      house_img: houseImgExcludeRep,
      representative_img: formData.representative_img,
      post_title: formData.post_title,
      region: formData.region,
      district: formData.district,
      house_type: formData.house_type,
      rental_type: formData.rental_type,
      floor: formData.floor,
      house_size: Number(formData.house_size) || -1,
      room_num: Number(formData.room_num) || -1,
      deposit_price: Number(formData.deposit_price) || -1,
      monthly_price: Number(formData.monthly_price) || -1,
      manage_price: Number(formData.manage_price) || -1,
      house_appeal: formData.house_appeal,
      term: formData.term,
      describe: formData.describe,
      bookmark: formData.bookmark,
      temporary,
      user_id: userId,
    };

    if (houseId) {
      updateHouse({ houseData, houseId: houseId as string });
    } else {
      registHouse(houseData);
    }
    await onUpdateProfile(userStyle);
  };

  const onClickPrevCarousel = () => setCurrentStep(prev => prev - 1);

  const onClickNextCarousel = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLocationError(false);
    } else if (
      form.getValues('region') === '지역' ||
      form.getValues('district') === '시, 구'
    ) {
      setLocationError(true);
    }
  };

  const onSubmitHouse = (
    formData: HouseFormType & UserLifeStyleType & UserMateStyleType,
  ) => {
    onSaveHouse(formData, 1);
  };

  const onClickSaveTemporary = () => {
    const formData = form.getValues();
    onSaveHouse(formData, 0);
  };

  const carouselTemplates = [
    <HouseRegisterTemplate1
      key="houseRegisterTemplate1"
      userId={userId}
      houseId={houseId as string}
      locationError={locationError}
      setLocationError={setLocationError}
      setImageFiles={setImageFiles}
    />,
    <HouseRegisterTemplates2 key="houseRegisterTemplate2" />,
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHouse)} className="flex-col">
        <Container.FlexCol className="w-full s-tablet:flex-col-reverse">
          {/* navigation bar */}
          <HouseRegisterNavigation
            currentStep={currentStep}
            buttonDisable={isRegisteringHouse || isUpdatingHouse}
            onClickNextCarousel={onClickNextCarousel}
            onClickPrevCarousel={onClickPrevCarousel}
            onClickSaveTemporary={onClickSaveTemporary}
            carouselLength={carouselTemplates.length}
          />
          <Container.FlexCol className="pb-12 pt-4">
            <Container.FlexRow className="items-center gap-4 py-2">
              <Typography.Head2 className="text-brown">
                하우스 등록
              </Typography.Head2>
              <Typography.P1 className="text-brown1">
                {currentStep + 1}/2
              </Typography.P1>
              <Button.Outline
                className="ml-6 hidden items-center justify-center rounded-[2rem] px-[1.5rem] py-[0.625rem] s-tablet:flex"
                onClick={onClickSaveTemporary}
                disabled={isRegisteringHouse || isUpdatingHouse}
              >
                <Typography.P1 className="text-brown">임시저장</Typography.P1>
              </Button.Outline>
            </Container.FlexRow>
            <Carousel order={currentStep} className="w-full grow">
              {carouselTemplates}
            </Carousel>
          </Container.FlexCol>
        </Container.FlexCol>
      </form>
    </Form>
  );
}
