import Badge from '@/components/atoms/Badge';
import Container from '@/components/atoms/Container';
import Divider from '@/components/atoms/Divider';
import Icon from '@/components/atoms/Icon';
import Typography from '@/components/atoms/Typography';
import BadgeIcon from '@/components/molecules/BadgeIcon';
import { HouseData } from '@/components/templates/House/HouseDetail/HouseDetailTemplate';
import {
  floorInfo,
  genderInfo,
  houseTypesInfo,
  mateNumInfo,
  rentalTypesInfo,
} from '@/constants/profileDetailInfo';

type HouseInfoCardProps = {
  houseData: HouseData;
};

export default function HouseInfoCard({ houseData }: HouseInfoCardProps) {
  const { user_mate_style: userMateStyle } = houseData;

  const termArray = houseData?.term.map(value => {
    const years = Math.floor(value / 12);
    const months = value % 12;
    if (years === 0) {
      return `최소 ${months}개월에서 `;
    }
    if (months === 0) {
      return `${years}년 이상`;
    }
    return `${years}년 ${months}개월 이상`;
  });

  return (
    <Container.FlexCol className="gap-10 rounded-lg bg-brown6 p-6 text-brown laptop:gap-11 laptop:p-8">
      <Container.FlexCol className="gap-5 ">
        <Container.FlexRow className="gap-4">
          <Container.FlexRow className="gap-2">
            <Typography.Head3 className="text-[1.3846153846rem] tablet:text-Head3">
              {rentalTypesInfo[houseData.rental_type]}
            </Typography.Head3>
            <Typography.Head3 className="text-[1.3846153846rem] tablet:text-Head3">
              {houseData.deposit_price}/{houseData.monthly_price}
            </Typography.Head3>
          </Container.FlexRow>
          <Divider.Col />
          <Typography.P1 className="leading-6">
            관리비 {houseData.manage_price}만원
          </Typography.P1>
        </Container.FlexRow>
        <Typography.P2>
          {houseData.region}시 {houseData.district}
        </Typography.P2>
      </Container.FlexCol>
      <Container.FlexCol className="gap-5">
        <Typography.SubTitle1>하우스 소개</Typography.SubTitle1>
        <Container.FlexRow className="flex-wrap items-center gap-3">
          <Icon type={houseTypesInfo[houseData.house_type].icon} />
          <Badge.Fill
            active={false}
            focus={false}
            hover={false}
            className="rounded-3xl px-5 py-2 text-white"
          >
            <Typography.P2>
              {houseTypesInfo[houseData.house_type].text}
            </Typography.P2>
          </Badge.Fill>
          <Container.FlexRow className="gap-3 ">
            <Typography.P2>{houseData.house_size}평</Typography.P2>
            <Divider.Col className="border-t-0" />
            <Typography.P2>방 {houseData.room_num}개</Typography.P2>
            <Divider.Col />
            <Typography.P2>{floorInfo[houseData.floor]}</Typography.P2>
          </Container.FlexRow>
        </Container.FlexRow>
      </Container.FlexCol>
      <Container.FlexCol className="gap-5">
        <Typography.SubTitle1>이런 특징이 있어요</Typography.SubTitle1>
        <Container.FlexRow className="flex-wrap gap-x-2 gap-y-3">
          {houseData.house_appeal.map(appeal => (
            <Badge.Fill
              focus={false}
              hover={false}
              active={false}
              className="rounded-3xl px-5 py-2 text-white"
              key={appeal}
            >
              <Typography.P2>{appeal}</Typography.P2>
            </Badge.Fill>
          ))}
        </Container.FlexRow>
      </Container.FlexCol>
      <Container.FlexCol className="gap-6">
        <Typography.SubTitle1>원하는 룸메이트</Typography.SubTitle1>
        <Container.FlexRow className="items-center gap-5">
          <Typography.SubTitle3>기간</Typography.SubTitle3>
          <Badge.Outline
            className="rounded-full px-4"
            focus={false}
            active={false}
            hover={false}
          >
            <Typography.P2 className="py-2.5">{termArray}</Typography.P2>
          </Badge.Outline>
        </Container.FlexRow>
        <Container.FlexCol className="gap-3">
          <Container.FlexRow className="items-center gap-5">
            <Typography.SubTitle3 className="whitespace-nowrap">
              특징
            </Typography.SubTitle3>
            <Container.FlexRow className="flex-wrap gap-2">
              {userMateStyle.mate_gender !== null &&
                userMateStyle.mate_gender !== undefined && (
                  <BadgeIcon.Outline
                    iconType={genderInfo[userMateStyle.mate_gender].icon}
                  >
                    <Typography.P2 className="py-2.5">
                      {genderInfo[userMateStyle.mate_gender].text}
                    </Typography.P2>
                  </BadgeIcon.Outline>
                )}
              {userMateStyle.mate_number !== null &&
                userMateStyle.mate_number !== undefined && (
                  <BadgeIcon.Outline
                    iconType={mateNumInfo[userMateStyle.mate_number].icon}
                  >
                    <Typography.P2 className="py-2.5">
                      {mateNumInfo[userMateStyle.mate_number].text}
                    </Typography.P2>
                  </BadgeIcon.Outline>
                )}
              <Badge.Outline
                className="rounded-full px-4"
                focus={false}
                active={false}
                hover={false}
              >
                <Typography.P2 className="py-2.5">
                  {userMateStyle.prefer_mate_age[0] + 20}살-
                  {userMateStyle.prefer_mate_age[1] + 20}살
                </Typography.P2>
              </Badge.Outline>
            </Container.FlexRow>
          </Container.FlexRow>
          <Container.FlexRow className="flex-wrap items-center gap-x-2 gap-y-3 pl-[3.125rem]">
            {userMateStyle.mate_appeals.map(appeal => (
              <Badge.Outline
                focus={false}
                active={false}
                hover={false}
                className="rounded-full px-4"
                key={appeal}
              >
                <Typography.P2 className="py-2.5">{appeal}</Typography.P2>
              </Badge.Outline>
            ))}
          </Container.FlexRow>
        </Container.FlexCol>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
