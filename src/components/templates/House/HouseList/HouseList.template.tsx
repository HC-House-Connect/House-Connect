import Container from '@/components/atoms/Container';
import HouseCard from '@/components/organisms/HouseCard';
import HouseListFilter from '@/components/templates/House/HouseList/HouseListFilter';
import { HouseCardType } from '@/types/house.type';

export type HouseListTemplateProps = {
  houseList: HouseCardType[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export default function HouseListTemplate(props: HouseListTemplateProps) {
  const { houseList } = props;

  return (
    <Container.FlexCol>
      <HouseListFilter />
      <Container.Grid className="grid-cols-1 items-center justify-center gap-x-6 gap-y-10 px-8 pb-10 screen480:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 monitor:grid-cols-5 [&>img]:object-contain">
        {houseList.map(item => item && <HouseCard key={item.id} {...item} />)}
      </Container.Grid>
    </Container.FlexCol>
  );
}
