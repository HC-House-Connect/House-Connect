import { useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import {
  InfiniteData,
  UseInfiniteQueryResult,
  useQueryClient,
} from '@tanstack/react-query';

import useIsOverSTabletBreakpoint from '@/hooks/useIsOverSTabletBreakpoint';
import { HouseCardType, HouseListPerPage } from '@/types/house.type';
import { houseBookmarkQuery, houseDetailQuery } from '@/hooks/useHouseDetail';
import HouseListFilter from '@/components/templates/house/house-list/HouseListFilter';
import Container from '@/components/atoms/Container';
import HouseCard from '@/components/organisms/HouseCard';
import useObserver from '@/hooks/useObserver';

export type HouseListTemplateProps = UseInfiniteQueryResult<
  InfiniteData<HouseListPerPage>
> & {
  houseList: HouseCardType[];
};

export default function HouseListTemplate({
  houseList,
  fetchNextPage,
  isFetching,
}: HouseListTemplateProps) {
  const observerTargetElement = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [isOverSTabletBreakPoint] = useIsOverSTabletBreakpoint();

  useObserver({ callback: fetchNextPage, targetRef: observerTargetElement });

  const prefetchHouseDetail = async (
    houseId: string | undefined,
    userId: string | undefined,
  ) => {
    await Promise.all([
      queryClient.prefetchQuery({ ...houseDetailQuery(queryClient, houseId) }),
      queryClient.prefetchQuery({
        ...houseBookmarkQuery(queryClient, userId, houseId),
      }),
    ]);
  };

  const onHoverPrefetchHouseDetail = async (
    userId: string | undefined,
    houseId: string | undefined,
  ) => {
    await prefetchHouseDetail(houseId, userId);
  };

  return (
    <Container.FlexCol>
      <HouseListFilter />
      <Container.Grid className="grid-cols-1 items-center justify-center gap-x-6 gap-y-10 px-8 pb-10 screen480:grid-cols-2 s-tablet:px-12 laptop:grid-cols-3 desktop:grid-cols-4 monitor:grid-cols-5">
        {houseList.map(
          item =>
            item && (
              <HouseCard
                onMouseEnter={() =>
                  onHoverPrefetchHouseDetail(item.user_id, item.id)
                }
                key={item.id}
                {...item}
              />
            ),
        )}
      </Container.Grid>
      <div
        ref={observerTargetElement}
        className="flex h-12 w-full items-start justify-center text-white"
      >
        {isFetching && (
          <ClipLoader
            key="ClipLoaderOverSTablet"
            size={isOverSTabletBreakPoint ? 40 : 20}
            loading
            color="#643927"
          />
        )}
      </div>
    </Container.FlexCol>
  );
}
