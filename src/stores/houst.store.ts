import { atom, RecoilState } from 'recoil';

import { HouseListFilterType } from '@/types/house.type';

const HouseListFilterAtomState: RecoilState<HouseListFilterType> =
  atom<HouseListFilterType>({
    key: 'HouseListFilterAtomState',
    default: {
      house_type: 0,
      rental_type: 1,
      term: [0, 25],
      deposit_price: [0, 10100],
      monthly_rental_price: [0, 510],
      regions: undefined,
      mate_number: 0,
      mate_gender: 0,
    },
  });

export default HouseListFilterAtomState;
