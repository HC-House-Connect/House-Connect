import { z } from 'zod';

import { SignUpProfileForm } from '@/types/signUp.type';

export const HouseForm = z.object({
  house_img: z
    .array(z.string())
    .min(4, { message: '최소 4개 이상의 하우스 사진을 등록해주세요.' })
    .max(10, { message: '최대 10개의 사진만 등록 가능합니다.' }),
  representative_img: z.string(),
  post_title: z.string().min(2, { message: '제목은 2글자 이상이어야 합니다.' }),
  region: z.string().refine(value => value !== '지역', {
    message: '주거지의 지역을 입력해주세요.',
    path: ['region'],
  }),
  district: z.string().refine(value => value !== '시, 구', {
    message: '주거지의 지역을 입력해주세요.',
    path: ['region'],
  }),
  /**
   * ### 찾는 집 유형
   * - 0: 원룸/오피스텔
   * - 1: 빌라/연립
   * - 2: 아파트
   * - 3: 단독주택
   * - undefined: 지정되지 않음(초기값)
   */
  house_type: z.preprocess(
    val => {
      const numVal = Number(val);
      return [0, 1, 2, 3].includes(numVal) ? numVal : undefined;
    },
    z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  ),
  /**
   * ### 집 대여 유형
   * - 0: 상관없음
   * - 1: 월세
   * - 2: 전세
   * - 3: 반 전세
   * - undefined: 지정되지 않음(초기값)
   */
  rental_type: z.preprocess(
    val => {
      const numVal = Number(val);
      return [0, 1, 2, 3].includes(numVal) ? numVal : undefined;
    },
    z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  ),

  house_size: z.number({
    invalid_type_error: '공유 주거의 넓이(평 단위)를 숫자로 입력해주세요.',
  }),
  room_num: z.number({
    invalid_type_error: '공유 주거 내 방의 갯수를 숫자로 입력해주세요.',
  }),
  /**
   * ### 층 옵션
   * - 0: 지하
   * - 1: 반지하
   * - 2: 지상
   * - undefined: 지정되지 않음(초기값)
   */
  floor: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  deposit_price: z.number({
    invalid_type_error: '보증금을 만원 단위 숫자로 입력해주세요.',
  }),
  monthly_price: z.number({
    invalid_type_error: '월세를 만원 단위 숫자로 입력해주세요.',
  }),
  manage_price: z.number({
    invalid_type_error: '관리비를 만원 단위 숫자로 입력해주세요.',
  }),
  house_appeal: z
    .array(z.string(), { required_error: '우리 집의 매력을 작성해주세요.' })
    .min(1, { message: '1개 이상의 특징을 작성해주세요.' })
    .max(5),
  term: z
    .tuple([
      z
        .number()
        .min(0, { message: '최소값은 0개월 입니다.' })
        .max(25, { message: '최대값은 2년 이상 입니다.' }),
      z
        .number()
        .min(0, { message: '최소값은 0개월 입니다.' })
        .max(25, { message: '최대값은 2년 이상 입니다.' }),
    ])
    .refine(data => data[0] <= data[1], {
      message: '최소 기간이 최대 기간보다 클 수 없습니다.',
    }),
  describe: z.string(),
  /**
   * ### 저장 유형
   * - 0: 임시 저장(default)
   * - 1: 완전 저장
   */
  temporary: z.union([z.literal(0), z.literal(1)]).default(0),
  bookmark: z.number(),
  user_id: z.string(),
});

export type HouseFormType = z.infer<typeof HouseForm>;

const HouseCard = HouseForm.pick({
  representative_img: true,
  house_type: true,
  rental_type: true,
  deposit_price: true,
  monthly_price: true,
  house_appeal: true,
  region: true,
  district: true,
  term: true,
  user_id: true,
}).required();

export type HouseCardType = z.infer<typeof HouseCard> & { id: string };

export const HouseListFilterForm = HouseForm.pick({
  house_type: true,
  rental_type: true,
  term: true,
})
  .merge(
    SignUpProfileForm.innerType().innerType().pick({
      regions: true,
      deposit_price: true,
      monthly_rental_price: true,
      mate_number: true,
      mate_gender: true,
    }),
  )
  .partial();

export type HouseListFilterType = z.infer<typeof HouseListFilterForm>;
