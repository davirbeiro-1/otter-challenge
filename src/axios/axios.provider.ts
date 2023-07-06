import axios from 'axios';

export const AxiosProvider = {
  provide: 'AXIOS_INSTANCE',
  useValue: axios,
};
