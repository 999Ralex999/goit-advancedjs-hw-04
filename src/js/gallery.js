import axios from 'axios';

const API_KEY = '42355472-3aa41b7abe4d1083b6d3aff39';
axios.defaults.baseURL = 'https://pixabay.com';
axios.defaults.params = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

export async function fetchImages(query, page) {
  const { data } = await axios.get('api/', {
    params: { q: query, page: page },
  });
  return {
    images: data.hits,
    totalImages: data.totalHits,
  };
}
