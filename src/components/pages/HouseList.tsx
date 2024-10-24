import HouseListTemplate from '@/components/templates/House/HouseList/HouseList.template';
import { useInfiniteHouseList } from '@/hooks/useHouse';
import { HouseCardType } from '@/types/house.type';

export default function HouseList() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteHouseList();

  return (
    <HouseListTemplate
      houseList={
        (data?.pages.flatMap(page => page.data) as HouseCardType[]) || []
      }
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
