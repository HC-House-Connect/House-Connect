import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import HouseDetailTemplate, {
  HouseData,
} from '@/components/templates/House/HouseDetail/HouseDetailTemplate';
import { houseBookmarkQuery, houseDetailQuery } from '@/hooks/useHouseDetail';
import { UserAtom } from '@/stores/auth.store';
import CommentTemplate from '@/components/templates/CommentTemplate';
import { houseCommentQuery } from '@/hooks/useCommentReply';
import { CommentType } from '@/types/houseComment.type';
import Loading from '@/components/pages/Loading';

function HouseDetail() {
  const { houseId } = useParams();
  const user = useRecoilValue(UserAtom);
  const queryClient = useQueryClient();
  const data = useQueries({
    queries: [
      houseDetailQuery(queryClient, houseId),
      houseBookmarkQuery(queryClient, user?.id, houseId),
    ],
  });

  const isPending = data.some(result => result.isFetching);

  const { data: comments } = useQuery(houseCommentQuery(houseId));

  const [houseDetail, houseBookmark] = data;
  const { data: houseData } = houseDetail;
  const { data: bookmark } = houseBookmark;

  if (isPending)
    return <Loading text="Loading..." textStyle="tracking-widest" />;

  return (
    <>
      {houseData && (
        <HouseDetailTemplate
          houseData={houseData?.data as HouseData}
          bookmark={bookmark?.data as boolean}
          houseId={houseId as string}
        />
      )}
      <CommentTemplate
        comments={comments?.data as unknown as CommentType[]}
        commentsCount={comments?.count as unknown as string}
      />
    </>
  );
}

export default HouseDetail;
