import Container from '@/components/atoms/Container';
import Link from '@/components/atoms/Link';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import cn from '@/libs/cn';

export default function HouseListFilter() {
  const filterBtnCommonStyle =
    'cursor-pointer items-center gap-3 rounded-full bg-white shadow-badge text-brown hover:ring hover:ring-point active:bg-point1 active:text-white';
  return (
    <Container.FlexRow className="mb-[3.75rem] justify-center gap-5">
      <Container.FlexRow className="gap-x-4">
        <IconButton.Ghost
          iconType="filter"
          direction="left"
          className={cn(filterBtnCommonStyle, 'px-[1.6rem] py-[1rem]')}
        >
          <Typography.SpanMid2 className="text-[1rem]">
            필터
          </Typography.SpanMid2>
        </IconButton.Ghost>
        <Link to="/house/regist">
          <IconButton.Ghost
            iconType="add"
            direction="left"
            className={cn(filterBtnCommonStyle, 'px-[1.6rem] py-[1rem] ')}
          >
            <Typography.SpanMid2 className="text-[1rem]">
              하우스 등록
            </Typography.SpanMid2>
          </IconButton.Ghost>
        </Link>
      </Container.FlexRow>
    </Container.FlexRow>
  );
}
