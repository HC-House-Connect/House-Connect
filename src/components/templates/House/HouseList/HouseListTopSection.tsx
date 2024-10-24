import Container from '@/components/atoms/Container';
import Icon from '@/components/atoms/Icon';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import cn from '@/libs/cn';

type HouseListTopSectionProps = {
  className?: string;
};

export default function HouseListTopSection({
  className,
}: HouseListTopSectionProps) {
  return (
    <Container.FlexCol
      className={cn(
        'justify-between relative gap-y-28 bg-bg-beige pt-20',
        's-tablet:pt-[8rem] s-tablet:gap-y-32',
        'laptop:h-screen',
        className,
      )}
    >
      {/* text 부분 */}
      <Container.FlexCol
        className={cn(
          'max-w-[79rem] items-start gap-4 px-8 pt-12',
          's-tablet:gap-8 s-tablet:pt-14',
        )}
      >
        <Typography.Head2
          lang="en"
          className="text-xl font-medium text-point1 s-tablet:text-[2rem]"
        >
          HOUSE THE COLLECTION
        </Typography.Head2>
        <Container.FlexCol className="text-point1">
          <Typography.Head1
            lang="en"
            className="mb-1 translate-x-[-0.2rem] text-[3rem] font-medium s-tablet:translate-x-[-0.5rem] s-tablet:text-[7rem] laptop:text-[8rem]"
          >
            HOUSE
          </Typography.Head1>
          <Typography.Head1
            lang="en"
            className="translate-x-[-0.2rem] text-[3rem] font-medium s-tablet:translate-x-[-0.5rem] s-tablet:text-[7rem] laptop:text-[8rem]"
          >
            -CONNECT
          </Typography.Head1>
        </Container.FlexCol>
      </Container.FlexCol>
      <Container.FlexRow
        className={cn(
          'h-[8rem] w-full justify-center bg-bg-orange pt-10 [clip-path:polygon(50%_0%,100%_48%,100%_100%,0_100%,0%_48%)]',
          's-tablet:h-[10rem]',
          'laptop:h-[12rem]',
        )}
      >
        <Container.FlexCol className="items-center gap-8">
          <IconButton.Ghost
            iconType="down-arrow"
            iconClassName="h-7 w-auto s-tablet:size-8"
          />
          <Typography.SubTitle1
            lang="en"
            className="text-[1rem] font-normal text-point1 s-tablet:text-[1.5rem]"
          >
            Find Your Roommate.
          </Typography.SubTitle1>
        </Container.FlexCol>
      </Container.FlexRow>
      <Icon
        type="character"
        className={cn(
          'absolute bottom-[3.5rem] right-[1rem] z-20 h-[10rem] w-[8rem] transition-all',
          'mobile:h-[12rem] mobile:w-[10rem] mobile:right-[2rem]',
          's-tablet:w-[13rem] s-tablet:h-[16rem] s-tablet:bottom-[2rem]',
          'laptop:h-[22.5rem] laptop:w-[17.75rem] laptop:bottom-[3rem]',
          'desktop:h-[30rem] desktop:w-[22.5rem]',
        )}
      />
    </Container.FlexCol>
  );
}

HouseListTopSection.defaultProps = {
  className: '',
};
