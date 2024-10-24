import { routePaths } from '@/constants/route';
import Link from '@/components/atoms/Link';
import Container from '@/components/atoms/Container';
import Img from '@/components/atoms/Img';
import Badge from '@/components/atoms/Badge';
import Typography from '@/components/atoms/Typography';
import { houseTypesInfo, rentalTypesInfo } from '@/constants/profileDetailInfo';
import { HouseCardType } from '@/types/house.type';

type HouseCardProps = HouseCardType;

export default function HouseCard(props: HouseCardProps) {
  const {
    id,
    region,
    district,
    house_type,
    house_appeal,
    rental_type,
    representative_img,
    term,
    monthly_price,
    deposit_price,
    user_id,
  } = props;

  return (
    <Link
      to={routePaths.houseDetail(id)}
      className="relative w-full rounded-xl shadow-[0_4px_12px_0_rgba(0,0,0,12%)] monitor:w-[23.25rem]"
    >
      <Img
        className="h-[13.7rem] rounded-b-none object-cover"
        src={`${import.meta.env.VITE_SUPABASE_BUCKET_URL}/house/${user_id}/${id}/${representative_img}`}
        alt="House Image"
      />
      {/* 사진 위의 badge 부분 */}
      <Container.FlexRow className="absolute inset-x-0 top-0 items-start p-4">
        <Container.FlexRow className="flex-1 flex-wrap gap-2">
          {house_appeal.map(appeal => (
            <Badge.Outline
              key={appeal}
              hover={false}
              active={false}
              focus={false}
              className="rounded-2xl border-none px-[0.625rem] pb-[0.3125rem] pt-[0.5rem] shadow-badge"
            >
              <Typography.SpanMid2
                key={appeal}
                className="translate-y-[-0.1rem]"
              >
                {appeal}
              </Typography.SpanMid2>
            </Badge.Outline>
          ))}
        </Container.FlexRow>
        {/* TODO: 추후 bookmark기능 고친 후 적용 */}
        {/* <Icon type="mini-heart" /> */}
      </Container.FlexRow>

      <Container.FlexCol className="gap-y-2 rounded-b-xl bg-white p-4">
        <Container.FlexRow className="mb-3 gap-x-1 text-brown">
          <Typography.SubTitle2>
            {rentalTypesInfo[rental_type]}
          </Typography.SubTitle2>
          <Typography.SubTitle2>{`${deposit_price}/${monthly_price}`}</Typography.SubTitle2>
        </Container.FlexRow>

        <Container.Grid className="grid-cols-1 items-center gap-2 laptop:gap-1 monitor:grid-cols-[auto_1fr] ">
          <Typography.Span1 className="mb-1 text-brown">{`${region} ${district}`}</Typography.Span1>
          {/* TODO: 아파트, 12개월 이상 해당 영역 fetch House이후 집의 특징 rendering 기능 추가 */}
          <Container.FlexRow className="items-center justify-start gap-2">
            <Badge.Outline
              hover={false}
              active={false}
              focus={false}
              className="rounded-2xl px-[0.625rem] pb-[0.3125rem] pt-[0.5rem]"
            >
              <Typography.SpanMid2 className="translate-y-[-0.1rem]">
                {houseTypesInfo[house_type].text}
              </Typography.SpanMid2>
            </Badge.Outline>
            <Badge.Outline
              hover={false}
              active={false}
              focus={false}
              className="rounded-2xl px-[0.625rem] pb-[0.3125rem] pt-[0.5rem]"
            >
              <Typography.Span2 className="translate-y-[-0.1rem]">{`${term[0]}개월 이상`}</Typography.Span2>
            </Badge.Outline>
          </Container.FlexRow>
        </Container.Grid>
      </Container.FlexCol>
    </Link>
  );
}
