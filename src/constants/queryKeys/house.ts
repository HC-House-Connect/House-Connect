const HOUSE_KEYS = {
  ALL: ['house'] as const, // 임시저장, 완전저장된 모든 house게시글
  HOUSE_POST: (houseId: string) =>
    [...HOUSE_KEYS.ALL, 'post', { id: houseId }] as const,
  HOUSE_DETAIL: (houseId: string | undefined) =>
    [...HOUSE_KEYS.ALL, 'detail', houseId] as const,
  HOUSE_DETAIL_BOOKMARK: (
    userId: string | undefined,
    houseId: string | undefined,
  ) => [...HOUSE_KEYS.ALL, 'house_bookmark', userId, houseId] as const,
  HOUSE_COMMENT_REPLY: (houseId: string | undefined) =>
    [...HOUSE_KEYS.ALL, 'comment', houseId] as const,
  HOUSE_LIST: () => [...HOUSE_KEYS.ALL, 'list'] as const,
};

export default HOUSE_KEYS;
