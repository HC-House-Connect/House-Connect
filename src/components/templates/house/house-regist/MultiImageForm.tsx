import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { supabase } from '@/libs/supabaseClient';
import { HouseFormType } from '@/types/house.type';
import Icon from '@/components/atoms/Icon';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Img from '@/components/atoms/Img';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import cn from '@/libs/cn';

type MultiImageFormProp = {
  userId: string;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  // eslint-disable-next-line react/require-default-props
  houseId?: string;
};

const IMAGES_PER_PAGE = 3;

export default function MultiImageForm({
  userId,
  setImageFiles,
  houseId,
}: MultiImageFormProp) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const form =
    useFormContext<Pick<HouseFormType, 'house_img' | 'representative_img'>>();
  const representativeImage = form.watch('representative_img');

  const totalImageCount = previewUrls.length;

	const handleIndexNavigation = (direction: 'next' | 'prev') => {
    setCurrentIndex((prev) =>
      direction === 'next'
        ? Math.min(prev + 1, Math.ceil(totalImageCount / IMAGES_PER_PAGE) - 1)
        : Math.max(prev - 1, 0)
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const fileArray = Array.from(files).map((file) => {
      const blobUrl = URL.createObjectURL(file);
      const imageUuid = blobUrl.split('/').pop() as string;
      return {
        file: new File([file], imageUuid, { type: file.type }),
        preview: blobUrl,
        name: imageUuid,
      };
    });

    setImageFiles((prev) => [...prev, ...fileArray.map((item) => item.file)]);
    setPreviewUrls((prev) => [...prev, ...fileArray.map((item) => item.preview)]);
    form.setValue('house_img', [...form.getValues('house_img'), ...fileArray.map((item) => item.name)]);
  };

	const handleDeleteLocalImage = (imgSrc: string) => {
    const imgName = imgSrc.split('/').pop() as string;
    if (!imgName) return;

    if (imgName === representativeImage) form.setValue('representative_img', '');

    setPreviewUrls((prev) => prev.filter((url) => !url.includes(imgName)));
    setImageFiles((prev) => prev.filter((file) => file.name !== imgName));

    form.setValue(
      'house_img',
      form.getValues('house_img').filter((img) => img !== imgName)
    );

    if ((totalImageCount - 1) % IMAGES_PER_PAGE === 0 && currentIndex > 0) {
      handleIndexNavigation('prev');
    }
  };

  const selectRepresentativeImage = (imgSrc: string) => {
    const imgName = imgSrc.split('/').pop() as string;
    form.setValue('representative_img', imgName);
  };

  useEffect(() => {
    if (!representativeImage && totalImageCount > 0) {
      form.setValue('representative_img', previewUrls[0].split('/').pop() as string);
    }
  }, [representativeImage, totalImageCount, previewUrls, form]);

  useEffect(() => {
    if (!houseId) return;

    (async () => {
      const { data, error } = await supabase.storage
        .from('images')
        .list(`house/${userId}/${houseId}`, { limit: 10 });

      if (error) {
        console.error('Error fetching images:', error.message);
        return;
      }

      if (data) {
        const HOUSE_BUCKET_URL = `${import.meta.env.VITE_SUPABASE_BUCKET_URL}/house`;
        const imageUrls = data.map((image) => `${HOUSE_BUCKET_URL}/${userId}/${houseId}/${image.name}`);
        const imageNames = data.map((image) => image.name);

        setPreviewUrls(imageUrls);
        form.setValue('house_img', imageNames);
      }
    })();
  }, [userId, houseId, form]);

  const paginatedImages = previewUrls.slice(
    currentIndex * IMAGES_PER_PAGE,
    (currentIndex + 1) * IMAGES_PER_PAGE,
  );

  return (
    <Container.FlexCol className="w-full justify-center">
      <Container.FlexRow className="items-center">
        {currentIndex > 0 && (
          <IconButton.Ghost
            className={cn(
              'size-[1.25rem] absolute left-4 z-10 flex items-center justify-center rounded-full bg-bg opacity-60 hover:opacity-100',
              'mobile:size-9',
              's-tablet:size-12',
            )}
            iconType="prev"
            fill="brown1"
            stroke="brown"
            iconClassName={cn(
              'size-[0.5rem]',
              'mobile:size-4',
              's-tablet:size-6',
            )}
            onClick={() => handleIndexNavigation('prev')}
          />
        )}
        <Container.Grid
          className={cn('w-full grid-cols-4 gap-[0.5rem]', 's-tablet:gap-4')}
        >
          <div className="relative aspect-square w-full">
            <Label
              htmlFor="upload_house_img"
              className="absolute inset-0 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg bg-brown3"
            >
              <Icon type="camera" className="pointer-events-none size-1/3" />
              <Input
                type="file"
                id="upload_house_img"
                name="house_img"
                className="hidden"
                onChange={handleFileUpload}
                accept=".jpg, .jpeg, .png"
                multiple
              />
            </Label>
            <Typography.P1
              className={cn(
                'absolute bottom-[0.375rem] left-[0.5rem] text-brown text-[0.8rem]',
                'mobile:text-[0.8rem] mobile:bottom-[0.625rem] mobile:left-[0.625rem]',
                's-tablet:text-base s-tablet:bottom-3 s-tablet:left-3',
                'laptop:text-xl laptop:bottom-4 laptop:left-4',
              )}
            >
              {`${totalImageCount}/10`}
            </Typography.P1>
          </div>
          {paginatedImages.map((imgSrc, index) => (
            <Container.FlexRow
              key={imgSrc.split('/').pop()}
              className="relative size-full items-center"
            >
              <IconButton.Fill
                className={cn(
                  'size-[1.25rem] absolute right-0 top-0 translate-x-[20%] translate-y-[-15%] z-10 flex items-center justify-center rounded-full border border-brown3 bg-bg',
                  'mobile:size-7',
                  's-tablet:translate-x-[30%] s-tablet:translate-y-[-15%] s-tablet:size-9',
                )}
                iconType="close"
                fill="brown1"
                stroke="brown1"
                iconClassName={cn(
                  'size-[0.5rem]',
                  'mobile:size-3',
                  's-tablet:size-4',
                )}
                onClick={() => handleDeleteLocalImage(imgSrc)}
              />
              <Label
                htmlFor={`image_${index}`}
                className="absolute m-0 size-full"
              >
                <Container.FlexRow className="absolute inset-0 items-center justify-center">
                  <Img
                    className="size-full rounded-lg object-cover"
                    src={imgSrc}
                  />
                </Container.FlexRow>
                {imgSrc.includes(representativeImage) && (
                  <Container.FlexRow
                    className={cn(
                      'absolute bottom-0 w-full rounded-b-lg bg-brown/60 p-[0.375rem]',
                      'mobile:p-[0.625rem]',
                      'laptop:p-4',
                    )}
                  >
                    <Typography.P1
                      className={cn(
                        'text-[0.8rem] text-bg',
                        'mobile:text-[0.8rem]',
                        's-tablet:text-base',
                        'laptop:text-xl',
                      )}
                    >
                      대표사진
                    </Typography.P1>
                  </Container.FlexRow>
                )}
                <Input
                  type="radio"
                  id={`image_${index}`}
                  className={cn(
                    'absolute bottom-[0.375rem] right-[0.5rem] z-10 size-[0.875rem] accent-point',
                    'mobile:bottom-[0.625rem] mobile:right-[0.5rem] mobile:size-4',
                    's-tablet:bottom-3 s-tablet:right-3 s-tablet:size-5',
                    'laptop:bottom-4 laptop:right-4 laptop:size-6',
                  )}
                  checked={imgSrc.includes(representativeImage)}
                  onChange={() => selectRepresentativeImage(imgSrc)}
                />
              </Label>
            </Container.FlexRow>
          ))}
          {totalImageCount < IMAGES_PER_PAGE &&
            Array.from({ length: IMAGES_PER_PAGE - totalImageCount }).map(
              (_, index) => (
                <Label
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  htmlFor="house_img"
                  className="mb-0 flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg bg-brown3"
                />
              ),
            )}
        </Container.Grid>
        {totalImageCount > IMAGES_PER_PAGE &&
          currentIndex < Math.ceil(totalImageCount / IMAGES_PER_PAGE) - 1 && (
            <IconButton.Ghost
              className={cn(
                'size-[1.25rem] absolute right-4 z-10 flex items-center justify-center rounded-full bg-bg opacity-60 hover:opacity-100',
                'mobile:size-9',
                's-tablet:size-12',
              )}
              iconType="next"
              fill="brown1"
              stroke="brown"
              iconClassName={cn(
                'size-[0.5rem]',
                'mobile:size-4',
                's-tablet:size-6',
              )}
              onClick={() => handleIndexNavigation('next')}
            />
          )}
      </Container.FlexRow>
      <Typography.Span2
        className={`${
          !form.formState.errors.house_img?.message ? 'invisible h-3' : ''
        } mr-7 mt-[0.5rem] block text-right text-point`}
      >
        {form.formState.errors.house_img?.message as string}
      </Typography.Span2>
    </Container.FlexCol>
  );
}
