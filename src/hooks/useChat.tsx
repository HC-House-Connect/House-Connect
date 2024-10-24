/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { RefObject, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from '@/libs/supabaseClient';
import SupabaseCustomError from '@/libs/supabaseCustomError';
import { Tables } from '@/types/supabase';
import {
  OpenChannelProps,
  PostgresChangeCallback,
  PostgresChangeFilterOption,
  UserMessageType,
} from '@/types/chat.type';
import { CHAT_KEYS } from '@/constants/queryKeys';
import { MESSAGE_KEYS } from '@/constants/queryKeys/chat';

// TODO: suspense와 ErrorBoundary사용을 위해 throwOnError & suspense option활성화
// db join이 table구성 상 되지 않는 관계로 dependent fetch로 구성(chatRoomListPageData 내부 참조)
const fetchChatRoomList = async (userId: string) => {
  const { data, error, status } = await supabase
    .from('chat_room')
    .select('*')
    .contains('users', [userId])
    .order('last_message_date', { ascending: false });

  // * chatRoomList가 없을 때는 null로 들어옴
  if (error && !data) {
    throw new SupabaseCustomError(error, status);
  }

  return data;
};

const fetchChatPartnerInfo = async (chatPartnerId: string) => {
  const { data, error, status } = await supabase
    .from('user')
    .select('*')
    .eq('id', chatPartnerId)
    .single();

  if (!data && error) throw new SupabaseCustomError(error, status);

  return data;
};

const updateLastRead = async (
  userId: string,
  chatRoomId: string,
  lastReadDate?: string,
) => {
  const { data, error, status } = await supabase
    .from('user_chat')
    .update({ last_read: lastReadDate || JSON.stringify(new Date()) })
    .eq('user_id', userId)
    .eq('chat_room_id', chatRoomId);

  if (!data && error) {
    error.message = `${error?.message}\nfail to update last_read`;
    throw new SupabaseCustomError(error, status);
  }

  return data;
};

const fetchMessagesGroupByDate = async (chatRoomId: string) => {
  const { data, error, status } = await supabase.rpc(
    'get_messages_group_by_date',
    {
      input_chat_room_id: chatRoomId!,
    },
  );

  if (error) {
    throw new SupabaseCustomError(error, status);
  }

  return data as { date: string; messages: Tables<'messages'>[] }[];
};

const sendMessage = async ({
  chatRoomId,
  content,
  sendBy,
  createdAt,
}: {
  chatRoomId: string;
  content: string;
  sendBy: string;
  createdAt?: string;
}) => {
  const { data, error, status } = await supabase.from('messages').insert({
    created_at: createdAt || JSON.stringify(new Date()),
    chat_room_id: chatRoomId,
    message: content,
    send_by: sendBy,
  });

  if (error) {
    throw new SupabaseCustomError(error, status);
  }

  return data;
};

export const fetchUnReadMessageCount = async (
  userId: string,
  chatRoomId: string,
) => {
  // TODO: 추후 db 바꿀 시 join으로 수정
  const {
    data: lastReadDate,
    error: lastReadDateError,
    status: lastReadDateStatus,
  } = await supabase
    .from('user_chat')
    .select('last_read')
    .eq('user_id', userId)
    .eq('chat_room_id', chatRoomId)
    .single();

  if (lastReadDateError) {
    console.log('asdfasdfasdfasdf❌❌❌❌');
    throw new SupabaseCustomError(lastReadDateError, lastReadDateStatus);
  }

  const userLastRead = lastReadDate.last_read;

  const {
    data: unReadMessages,
    error: unReadMessagesError,
    status: unReadMessagesStatus,
  } = await supabase
    .from('messages')
    .select('id', { count: 'exact' })
    .eq('chat_room_id', chatRoomId)
    .gt('created_at', userLastRead);

  if (unReadMessagesError) {
    throw new SupabaseCustomError(unReadMessagesError, unReadMessagesStatus);
  }

  const unReadMessagesCount = unReadMessages.length;

  return unReadMessagesCount;
};

export const useChatRoomListPageData = (userId: string) => {
  const { data: chatRoomList, isLoading: isChatRoomListLoading } = useQuery({
    queryKey: CHAT_KEYS.LIST({ userId }),
    queryFn: () => fetchChatRoomList(userId),
    enabled: !!userId,
  });

  const { data: chatRoomListPageData, isLoading: isChatRoomListPageData } =
    useQueries({
      queries: chatRoomList
        ? chatRoomList.map(chatRoomInfo => {
            const {
              id: chatRoomId,
              last_message: lastMessage,
              last_message_date: lastMessageDate,
              users: userIds,
            } = chatRoomInfo;

            const chatPartnerId = userIds?.filter(
              eachUserId => eachUserId !== userId,
            )[0];

            if (!chatPartnerId)
              throw new Error(`couldn't find chat partner id`);

            return {
              queryKey: CHAT_KEYS.LIST_INFO({ userId, chatPartnerId }),
              queryFn: async () => {
                const newChatCount = await fetchUnReadMessageCount(
                  userId,
                  chatRoomId,
                );

                const chatPartnerInfo =
                  await fetchChatPartnerInfo(chatPartnerId);

                return {
                  newChatCount,
                  chatPartnerInfo,
                };
              },
              // * combine에서 하려 했지만, chatId, lastMessage 등 값을 scope 때문에 참조할 수 없어 select를 사용
              select: (data: {
                newChatCount: number;
                chatPartnerInfo: Tables<'user'>;
              }) => ({
                chatRoomId,
                lastMessage,
                lastMessageDate,
                userIds,
                newChatCount: data.newChatCount,
                chatPartnerInfo: { ...data.chatPartnerInfo },
              }),
              enabled: !!chatPartnerId,
            };
          })
        : [],
      // ? useQueries의 반환값이 각 배열 요소에 useQuery의 return 값이므로 combine을 통해 필요한 data로만 치환함.
      combine: results => ({
        // ! chatListPageData가 undefined[]와 같은 type으로도 추론되어 filter를 적용
        data: results
          .map(result => result.data)
          .filter(
            (data): data is NonNullable<typeof data> => data !== undefined,
          ),
        isLoading: results.some(result => result.isLoading),
      }),
    });

  return {
    chatRoomListPageData,
    isLoading: isChatRoomListLoading || isChatRoomListPageData,
    totalNewChatsCount: chatRoomListPageData?.reduce(
      (acc, cur) => acc + (cur.newChatCount || 0),
      0,
    ),
  };
};

// * 채팅리스트 중 하나 클릭할 시 호출할 hook
export const useUpdateLastRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      chatRoomId,
      lastReadDate,
    }: {
      userId: string;
      chatRoomId: string;
      lastReadDate?: string;
    }) => updateLastRead(userId, chatRoomId, lastReadDate),
    onError: () => console.error('error 발생'),
    onSuccess: () => {
      // * refetch chatListPageData
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.ALL });
    },
  });
};

export const useGetMessagesGroupByDate = (chatRoomId: string | undefined) => {
  const { data } = useQuery({
    queryKey: MESSAGE_KEYS.CHAT_ROOM({ chatRoomId }),
    queryFn: () => fetchMessagesGroupByDate(chatRoomId!),
    enabled: !!chatRoomId,
    select: messagesGroupByDate => {
      // * 시간 복잡도 O(N), N => messages database row의 개수
      /**
       * 
        type ASIS = {
          date: string;
          messages: Tables<'messages'>[],
        }[] 

        type TOBE = {
          date: string; 
          userMessages: {
            userId: string;
            messages: Tables<'messages'>[];
            lastCreatedAt: Date;
          }
        }

        - ASIS에서 TOBE형태로 parsing하는 로직이며 같은 date내 user가 연달아 보낸 메세지들을 구하는 로직.
        - created_at기준으로 오름차순 정렬이 되어 들어와 순서는 이미 정렬되어 있는 상태
      */
      const parsedMessages = [];
      const initialLastCreatedAt = new Date('1970-01-01T00:00:00.000Z');
      for (const dateMessages of messagesGroupByDate) {
        const tempUserMessages = [];
        let tempUserMessageObj: UserMessageType = {
          userId: '',
          messages: [],
          lastCreatedAt: initialLastCreatedAt,
        };

        let currentUserId = null;

        for (const message of dateMessages.messages) {
          if (message.send_by !== currentUserId) {
            if (tempUserMessageObj?.messages?.length > 0) {
              tempUserMessages.push({ ...tempUserMessageObj });
              tempUserMessageObj.userId = '';
              tempUserMessageObj.messages = [];
            }
            currentUserId = message.send_by;
            tempUserMessageObj = {
              userId: currentUserId,
              messages: [],
              lastCreatedAt: initialLastCreatedAt,
            };
          }

          if (tempUserMessageObj.lastCreatedAt < new Date(message.created_at)) {
            tempUserMessageObj.lastCreatedAt = new Date(message.created_at);
          }

          tempUserMessageObj.messages.push(message);
        }

        // 마지막 남은 값 처리
        if (tempUserMessageObj?.messages?.length > 0) {
          tempUserMessages.push(tempUserMessageObj);
        }

        parsedMessages.push({
          date: new Date(dateMessages.date),
          userMessages: tempUserMessages,
        });
      }

      return parsedMessages;
    },
  });

  return data;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: {
      chatRoomId: string;
      content: string;
      sendBy: string;
      createdAt?: string;
    }) => sendMessage(props),
    onError: error => console.error({ error }),
    onSuccess: () => {
      // * refetch updated messages
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.ALL,
      });
    },
  });
};

export const useScrollToBottom = (
  ref: RefObject<HTMLElement>,
  dependencies: unknown[],
) => {
  useEffect(() => {
    if (ref.current) {
      // eslint-disable-next-line no-param-reassign
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref, ...dependencies]);
};

export const useOpenChatChannel = <Payload extends { [key: string]: string }>({
  channelName,
  realtimeEventFilters,
  useEffectDependencies,
}: OpenChannelProps<Payload>) => {
  useEffect(() => {
    const chatChannel = supabase.channel(channelName);

    realtimeEventFilters.forEach(({ filterOption, callbackFn }) => {
      // ! postgres_changes라고 인자를 주어도 on method의 overloading이 정확하지 않아 단언으로 해결
      (
        chatChannel.on as (
          type: 'postgres_changes',
          filter: PostgresChangeFilterOption,
          callback: PostgresChangeCallback<Payload>,
        ) => RealtimeChannel
      )('postgres_changes', { ...filterOption }, callbackFn);
    });

    chatChannel.subscribe();

    return () => {
      chatChannel.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...useEffectDependencies]);
};
