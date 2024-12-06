/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { supabase } from '@/libs/supabaseClient';
import { createToast, errorToast, successToast } from '@/libs/toast';
import HOUSE_KEYS from '@/constants/queryKeys/house';
import SupabaseCustomError from '@/libs/supabaseCustomError';
import USER_KEYS from '@/constants/queryKeys/user';

type Comment = {
  id?: string;
  topId?: string;
  content?: string;
  userId?: string;
  methodType: 'insert' | 'update' | 'delete';
  onCloseRegister?: () => void;
};

export const useComment = () => {
  const { houseId } = useParams();
  const queryClient = useQueryClient();
  const { mutate: updateComment, isPending: commentPending } = useMutation({
    mutationFn: async (payload: Comment) => {
      if (payload.methodType === 'insert') {
        const { error: insertError } = await supabase
          .from('house_comment')
          .insert([
            {
              house_id: payload.topId as string,
              content: payload.content as string,
              user_id: payload.userId as string,
            },
          ]);
        if (insertError) {
          throw new Error(insertError.message);
        }
      } else if (payload.methodType === 'update') {
        const { error: updateError } = await supabase
          .from('house_comment')
          .update({ content: payload.content })
          .eq('id', payload.id as string);
        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: deleteError } = await supabase
          .from('house_comment')
          .delete()
          .eq('id', payload.id as string);
        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }
    },
    onMutate: variables => {
      if (variables.methodType === 'insert') {
        createToast('comment', '댓글 등록 중');
      } else if (variables.methodType === 'update') {
        createToast('comment', '댓글 수정 중');
      } else {
        createToast('comment', '댓글 삭제 중');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: HOUSE_KEYS.HOUSE_COMMENT_REPLY(houseId),
      });
      successToast('comment', '댓글 변경 완료');
    },
    onError: () => {
      errorToast('comment', '댓글 에러 ');
    },
  });
  return { updateComment, commentPending };
};

export const useReply = () => {
  const { houseId } = useParams();
  const queryClient = useQueryClient();
  const { mutate: updateReply, isPending: replyPending } = useMutation({
    mutationFn: async (payload: Comment) => {
      if (payload.methodType === 'insert') {
        const { error: insertError } = await supabase
          .from('house_reply')
          .insert([
            {
              comment_id: payload.topId as string,
              content: payload.content as string,
              user_id: payload.userId as string,
            },
          ]);
        if (insertError) {
          throw new Error(insertError.message);
        }
      } else if (payload.methodType === 'update') {
        const { error: updateError } = await supabase
          .from('house_reply')
          .update({ content: payload.content })
          .eq('id', payload.id as string);
        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: deleteError } = await supabase
          .from('house_reply')
          .delete()
          .eq('id', payload.id as string);
        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }
    },
    onMutate: variables => {
      if (variables.methodType === 'insert') {
        createToast('reply', '답글 등록 중');
      } else if (variables.methodType === 'update') {
        createToast('reply', '답글 수정 중');
      } else {
        createToast('reply', '답글 삭제 중');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: HOUSE_KEYS.HOUSE_COMMENT_REPLY(houseId),
      });
      successToast('reply', '답글 변경 완료');
    },
    onError: () => {
      errorToast('reply', '답글 에러 ');
    },
  });
  return { updateReply, replyPending };
};

export const houseCommentQuery = (houseId: string | undefined) =>
  queryOptions({
    queryKey: HOUSE_KEYS.HOUSE_COMMENT_REPLY(houseId),
    queryFn: async () =>
      supabase
        .from('house_comment')
        .select(
          '*, house_reply(*,user(nickname,avatar)),user(nickname,avatar)',
          {
            count: 'exact',
          },
        )
        .eq('house_id', houseId ?? ''),
    enabled: !!houseId,
  });

/**
 ** user_house_comments rpc definition
  * ? house_reply, house_comment, house에 관련된 데이터를 supabase api를 통해서 가져오는 것은
  * ? 복잡한 쿼리가 필요하므로 sql로 supabase rpc로 정의 함.

 * CREATE
  OR REPLACE FUNCTION user_house_comments (input_user_id UUID) RETURNS TABLE (
    house_id UUID,
    user_id UUID,
    content TEXT,
    comment_updated_at TIMESTAMPTZ,
    house_data JSON
  ) AS $$
    with comments_union_result AS (
      select 
      house_id,
      user_id,
      content,
      updated_at as comment_updated_at
      from
        house_comment
      where
        user_id = input_user_id
        
      UNION ALL

      select
        hc.house_id as house_id,
        coalesce(hr.user_id, hc.user_id) as user_id,
        hr.content as content,
        hr.updated_at as comment_updated_at
      from 
        house_reply as hr 
      inner join 
        house_comment as hc 
      on 
        hr.comment_id = hc.id
      where
        hr.user_id = input_user_id
    )

    -- comments의 union결과를 house정보를 가져오기 위해 다시 join
    select
      cur.house_id,
      cur.user_id,
      cur.content,
      cur.comment_updated_at,
      row_to_json(h) as house_data
    from 
      comments_union_result as cur
    left join
      house as h
    on
      h.id = cur.house_id;
  $$ LANGUAGE sql;
 */

export const commentsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: USER_KEYS.USER_HOUSE_COMMENTS(userId),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error, status } = await supabase.rpc(
        'user_house_comments',
        { input_user_id: userId },
      );

      if (error) {
        throw new SupabaseCustomError(error, status);
      }

      return data;
    },
  });
