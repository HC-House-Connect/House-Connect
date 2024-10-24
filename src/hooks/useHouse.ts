import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
/* eslint-disable consistent-return */
import { FileObject } from '@supabase/storage-js';

import { routePaths } from '@/constants/route';
import {
  createToast,
  errorToast,
  removeToast,
  successToast,
} from '@/libs/toast';
import { supabase } from '@/libs/supabaseClient';
import { HouseFormType } from '@/types/house.type';
import {
  UserLifeStyleType,
  UserMateStyleType,
} from '@/components/pages/HouseRegister';
import USER_KEYS from '@/constants/queryKeys/user';
import HOUSE_KEYS from '@/constants/queryKeys/house';

// fetch functions
export const fetchTemporaryHouseId = async (
  userId: string,
): Promise<{ id: string }> => {
  const TEMPORARY = 0;
  const { data, error } = await supabase
    .from('house')
    .select('id')
    .match({ user_id: userId, temporary: TEMPORARY });
  if (error)
    throw new Error(`임시저장된 글 확인에 실패했습니다.: ${error.message}`);
  return { id: data[0].id };
};

const fetchHousePost = async (houseId: string): Promise<HouseFormType> => {
  const { data, error } = await supabase
    .from('house')
    .select('*')
    .eq('id', houseId)
    .single();

  if (error) throw new Error(`게시글을 가져올 수 없습니다.: ${error.message}`);
  if (!data) {
    throw new Error(`게시글이 존재하지 않습니다.`);
  }

  return {
    bookmark: data.bookmark,
    deposit_price: data.deposit_price,
    describe: data.describe,
    district: data.district,
    floor: data.floor as 0 | 1 | 2,
    house_appeal: data.house_appeal,
    house_img: data.house_img,
    house_size: data.house_size,
    house_type: data.house_type as 0 | 1 | 2 | 3,
    manage_price: data.manage_price,
    monthly_price: data.monthly_price,
    post_title: data.post_title,
    region: data.region,
    rental_type: data.rental_type as 0 | 1 | 2 | 3,
    representative_img: data.representative_img,
    room_num: data.room_num,
    temporary: data.temporary as 0 | 1,
    term: data.term as HouseFormType['term'],
    user_id: data.user_id,
  };
};

const fetchUserLifeStyle = async (
  userId: string,
): Promise<UserLifeStyleType> => {
  const { data, error } = await supabase
    .from('user_lifestyle')
    .select('*')
    .eq('id', userId)
    .single();

  if (error)
    throw new Error(
      `사용자 프로필을 불러오는데 실패했습니다.: ${error.message}`,
    );
  return {
    smoking: data.smoking,
    pet: data.pet as 0 | 1 | 2,
    appeals: data.appeals || [],
  };
};

const fetchUserMateStyle = async (
  userId: string,
): Promise<UserMateStyleType> => {
  const { data, error } = await supabase
    .from('user_mate_style')
    .select('*')
    .eq('id', userId)
    .single();

  if (error)
    throw new Error(
      `사용자 프로필을 불러오는데 실패했습니다.: ${error.message}`,
    );
  return {
    mate_gender: data.mate_gender as 0 | 1 | 2,
    mate_number: data.mate_number as 0 | 1 | 2 | 3,
    mate_appeals: data.mate_appeals || [],
    prefer_mate_age:
      data.prefer_mate_age as UserMateStyleType['prefer_mate_age'],
  };
};

// react-query hooks
export const useFetchProfileData = (userId: string) => {
  const queryResults = useQueries({
    queries: [
      {
        queryKey: USER_KEYS.USER_LIFESTYLE(userId),
        queryFn: () => fetchUserLifeStyle(userId),
        enabled: !!userId,
      },
      {
        queryKey: USER_KEYS.USER_MATE_STYLE(userId),
        queryFn: () => fetchUserMateStyle(userId),
        enabled: !!userId,
      },
    ],
  });

  return {
    userLifeStyleQuery: queryResults[0] as UseQueryResult<
      UserLifeStyleType,
      Error
    >,
    userMateStyleQuery: queryResults[1] as UseQueryResult<
      UserMateStyleType,
      Error
    >,
  };
};

export const useFetchHouseData = (isEditMode: boolean, houseId: string) => {
  const houseQuery = useQuery<HouseFormType>({
    queryKey: HOUSE_KEYS.HOUSE_POST(houseId),
    queryFn: () => fetchHousePost(houseId),
    enabled: isEditMode && !!houseId,
  });
  return { houseQuery };
};

// storage 관련 함수
export const getStorageImage = async (
  storagePath: string,
): Promise<FileObject[] | undefined> => {
  const { data, error } = await supabase.storage
    .from('images')
    .list(storagePath, { limit: 1000, offset: 0 });
  if (error)
    throw new Error(`이미지를 가져오는데 실패했습니다: ${error.message}`);
  return data;
};

export const removeStorageFile = async (
  imageList: FileObject[],
  storagePath: string,
): Promise<void> => {
  const removePromises = imageList.map(imgObj =>
    supabase.storage.from('images').remove([`${storagePath}/${imgObj.name}`]),
  );
  const results = await Promise.all(removePromises);
  results.forEach(({ error }) => {
    if (error) throw new Error(`이미지 삭제에 실패했습니다: ${error.message}`);
  });
};

const moveImageStorage = async (
  images: string[],
  toStoragePath: string,
  fromStoragePath: string,
): Promise<boolean> => {
  const movePromises = images.map(imgName =>
    supabase.storage
      .from('images')
      .move(`${toStoragePath}/${imgName}`, `${fromStoragePath}/${imgName}`),
  );
  const results = await Promise.all(movePromises);
  results.forEach(({ error }, index) => {
    if (error)
      throw new Error(
        `이미지 ${images[index]} 이동에 실패했습니다: ${error.message}`,
      );
  });
  return true;
};

const saveImageStorage = async (
  userId: string,
  images: string[],
  postId: string,
): Promise<void> => {
  const postStoragePath = `house/${userId}/${postId}`;
  const tempStoragePath = `house/${userId}/temporary`;
  const moved = await moveImageStorage(
    images,
    tempStoragePath,
    postStoragePath,
  );
  if (moved) {
    const removeList = await getStorageImage(tempStoragePath);
    if (removeList) await removeStorageFile(removeList, tempStoragePath);
  }
};

// house data 생성 | 수정 | 삭제 hooks
export const useHouseRegist = () => {
  const navigate = useNavigate();
  const { mutate: registHouse, isPending: isRegistHouse } = useMutation({
    mutationFn: async (houseData: HouseFormType) => {
      const { data: insertedData, error } = await supabase
        .from('house')
        .insert(houseData)
        .select('id');

      if (error) throw new Error(`houseUploadError: ${error.message}`);
      const houseId = insertedData[0].id;
      return houseId;
    },
    onMutate: () => createToast('uploadHousePost', '게시글 업로드 중...'),
    onError: error =>
      errorToast(
        'uploadHousePost',
        `게시글 업로드에 실패했습니다.: ${error.message}`,
      ),
    onSuccess: async (houseId, variables) => {
      const { user_id, house_img, representative_img, temporary } = variables;
      if (representative_img !== '') {
        const images = [representative_img, ...house_img];
        await saveImageStorage(user_id, images, houseId);
      }
      successToast('uploadHousePost', '게시글이 저장되었습니다.');
      if (temporary === 1) navigate(routePaths.houseDetail(houseId));
      else navigate(routePaths.house);
    },
  });
  return { registHouse, isRegistHouse };
};

export const useHouseUpdate = () => {
  const navigate = useNavigate();
  const { mutate: updateHouse, isPending: isUpdateHouse } = useMutation({
    mutationFn: async ({
      houseData,
      houseId,
    }: {
      houseData: HouseFormType;
      houseId: string;
    }) => {
      const { data, error } = await supabase
        .from('house')
        .update(houseData)
        .eq('id', houseId)
        .select();

      if (error)
        throw new Error(`게시글 업데이트에 실패했습니다.: ${error.message}`);
      return data;
    },
    onMutate: async ({
      houseData,
      houseId,
    }: {
      houseData: HouseFormType;
      houseId: string;
    }) => {
      const toastId = createToast('updateHouse', '게시글 업데이트 중...', {
        autoClose: false,
      });
      try {
        const postStoragePath = `house/${houseData.user_id}/${houseId}`;
        const tempStoragePath = `house/${houseData.user_id}/temporary`;
        const imageList = await getStorageImage(postStoragePath);
        if (imageList) {
          const postImages = imageList.map(imgObj => imgObj.name);
          const moved = await moveImageStorage(
            postImages,
            postStoragePath,
            tempStoragePath,
          );
          if (moved) removeToast(toastId as string);
        }
        return toastId;
      } catch (error) {
        errorToast(
          toastId as string,
          '게시글 수정 중 문제가 생겼습니다. 고객센터에 문의해주세요.',
        );
      }
    },
    onError: error => {
      errorToast(
        'updateHouse',
        `게시글 업데이트 중 문제가 생겼습니다.: ${error.message}`,
      );
    },
    onSuccess: async (_, { houseData, houseId }, toastId) => {
      if (houseData) {
        const { user_id, house_img, representative_img } = houseData;
        const images = [representative_img, ...house_img];
        await saveImageStorage(user_id, images, houseId);
        removeToast(toastId as string);
        successToast('uploadHousePost', '게시글이 업데이트되었습니다.');
        navigate(routePaths.houseEdit(houseId));
      }
    },
  });
  return { updateHouse, isUpdateHouse };
};

// Update user profile
export const useUserProfileUpdate = () => {
  const { mutate: updateUserProfile } = useMutation({
    mutationFn: async ({
      dbName,
      data,
      userId,
    }: {
      dbName: string;
      data: UserLifeStyleType | UserMateStyleType;
      userId: string;
    }) => {
      const { error } = await supabase
        .from(dbName)
        .update(data)
        .eq('id', userId);
      if (error) throw new Error(`Profile update error: ${error.message}`);
    },
    onMutate: () => createToast('updateProfile', '프로필 수정 중'),
    onError: error => {
      console.error('Update profile error:', error);
      errorToast('updateProfile', error.message);
    },
    onSuccess: () => successToast('updateProfile', '프로필이 수정되었습니다.'),
  });
  return { updateUserProfile };
};

export const useDeleteHousePost = () => {
  const { mutate: deleteHousePost } = useMutation({
    mutationFn: async (houseId: string) => {
      const { error } = await supabase.from('house').delete().eq('id', houseId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onMutate: () => createToast('deletePost', '임시저장된 글 삭제 중...'),
    onError: () =>
      errorToast('deletePost', '임시저장된 글 삭제에 실패했습니다.'),
    onSuccess: () =>
      successToast('deletePost', '임시저장된 글이 삭제되었습니다.'),
  });
  return { deleteHousePost };
};

// houseList hooks
const fetchHouseList = async ({ pageParam = 0 }) => {
  const { data, error } = await supabase
    .from('house')
    .select(
      'id, representative_img, region, district, house_appeal, house_type, rental_type, term, deposit_price, monthly_price, user_id',
    )
    .eq('temporary', 1)
    .range(pageParam * 12, pageParam * 12 + 11);

  if (error) throw new Error(error.message);
  return { data, nextPage: pageParam + 1, hasMore: data.length !== 0 };
};

export const useInfiniteHouseList = () =>
  useInfiniteQuery({
    queryKey: HOUSE_KEYS.HOUSE_LIST(),
    queryFn: fetchHouseList,
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
