import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import Icon from '@/components/atoms/Icon';
import Img from '@/components/atoms/Img';
import Typography from '@/components/atoms/Typography';
import { HouseImageProp} from '@/components/templates/House/HouseDetail/ImageCarouselModal';

export default function HouseImageTemplate({
  houseId,
  representativeImg,
  houseImg,
  userId,
  setModal,
}: HouseImageProp) {
  const HOUSE_STORAGE_URL = `${import.meta.env.VITE_SUPABASE_BUCKET_URL}/house/${userId}/${houseId}`;

  const imgLen = houseImg.length;
  const getImgCount = () => {
    if (imgLen - 4 < 0) return <Icon type="camera-off" />;
    if (imgLen - 4 === 0) return '';
    return `+ ${imgLen - 4} 개`;
  };

  return (
    <Container.FlexRow className="relative max-h-[27.75rem] gap-5 laptop:min-h-[22.1875rem] tablet:min-h-[16.25rem]">
      <Img
        className="min-h-[18.125rem] min-w-[23.8125rem] flex-1 [&>img]:object-cover"
        src={`${HOUSE_STORAGE_URL}/${representativeImg}`}
      />
      <Button.Ghost
        onClick={() => setModal(true)}
        className="absolute bottom-5 right-5 gap-1.5 rounded-3xl bg-white px-4 py-2 text-brown drop-shadow-md"
      >
        <Typography.P1>{`1 / ${imgLen + 1}`}</Typography.P1>
      </Button.Ghost>
      <Container.Grid className="relative hidden min-w-[10rem] flex-1 grid-cols-2 grid-rows-2 gap-5 tablet:grid">
        {houseImg.slice(0, 4).map((src, index) => (
          <Img
            key={src}
            src={`${HOUSE_STORAGE_URL}/${src}`}
            alt={`house image ${index + 1}`}
            className={`[&>img]:object-cover ${index === 3 && 'col-start-2 row-start-2'}`}
          />
        ))}
        <Container.FlexCol
          className={`col-start-2 row-start-2 items-center justify-center rounded-xl ${imgLen - 4 === 0 ? ' bg-brown3/30' : ' bg-brown3/50'}`}
        >
          <Typography.Head2 className="text-brown">
            {getImgCount()}
          </Typography.Head2>
        </Container.FlexCol>
        <Button.Outline
          onClick={() => setModal(true)}
          className="absolute bottom-4 right-4 rounded-3xl border-white px-5  py-2 text-brown drop-shadow-md "
        >
          <Typography.P2>사진 모두 보기</Typography.P2>
        </Button.Outline>
      </Container.Grid>
    </Container.FlexRow>
  );
}
