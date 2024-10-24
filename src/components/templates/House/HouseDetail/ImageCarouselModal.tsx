import { useState } from 'react';

import Container from '@/components/atoms/Container';
import Img from '@/components/atoms/Img';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import Carousel from '@/components/organisms/Carousel';
import ModalBackdrop from '@/components/organisms/modals/ModalBackdrop';
import { HouseFormType } from '@/types/house.type';

export type HouseImageProp = {
  houseId: string;
  representativeImg: HouseFormType['representative_img'];
  houseImg: HouseFormType['house_img'];
  userId: HouseFormType['user_id'];
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ImageCarouselModal({
  houseId,
  representativeImg,
  houseImg,
  userId,
  setModal,
}: HouseImageProp) {
  const HOUSE_STORAGE_URL = `${import.meta.env.VITE_SUPABASE_BUCKET_URL}/house/${userId}/${houseId}`;
  const houseImages = [representativeImg, ...houseImg];
  const [carouselStep, setCarouselStep] = useState(0);

  return (
    <ModalBackdrop
      className="bg-[#6d6d6d]/70"
      onClickClose={() => setModal(false)}
    >
      <Container.FlexRow className="relative size-full tablet:size-[700px]">
        <Carousel order={carouselStep} className="overflow-y-auto">
          {houseImages.map(src => (
            <Img
              key={src}
              alt="하우스 사진"
              src={`${HOUSE_STORAGE_URL}/${src}`}
              className="min-w-full flex-1 justify-center tablet:min-w-[700px] [&>*]:flex-1 [&>*]:object-contain"
            />
          ))}
        </Carousel>
        <IconButton.Ghost
          className="absolute left-1 top-[50%] size-8 justify-center !bg-brown/60 tablet:left-auto tablet:right-[46.5rem] tablet:size-16 "
          iconClassName="size-6 tablet:size-10"
          fill="brown4"
          iconType="prev"
          direction="left"
          onClick={() => {
            setCarouselStep(prev =>
              prev !== 0 ? prev - 1 : houseImages.length,
            );
          }}
        />
        <IconButton.Ghost
          className="absolute right-1 top-[50%] size-8 justify-center !bg-brown/60 tablet:left-[46.5rem] tablet:right-0 tablet:size-16 "
          iconClassName="size-6 tablet:size-10"
          fill="brown4"
          iconType="next"
          direction="right"
          onClick={() => {
            setCarouselStep(prev =>
              prev !== houseImages.length ? prev + 1 : 0,
            );
          }}
        />
        <IconButton.Ghost
          className="absolute right-2 top-2 size-10 justify-center hover:!bg-brown/60 tablet:-right-16 tablet:top-0"
          iconType="close"
          iconClassName="size-6"
          fill="brown4"
          onClick={() => setModal(false)}
        />
        <Container.FlexRow className="absolute bottom-8 left-2/4 -translate-x-2/4 items-center gap-2 text-brown tablet:-bottom-2 tablet:translate-y-full">
          <Typography.P1>{`${carouselStep + 1} / ${houseImages.length}`}</Typography.P1>
        </Container.FlexRow>
      </Container.FlexRow>
    </ModalBackdrop>
  );
}
