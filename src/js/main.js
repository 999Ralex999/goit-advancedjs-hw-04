import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';
import resetGallery from './gallery';
axios.defaults.baseURL = 'https://pixabay.com/';

const elements = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const AppState = {
  query: '',
  page: 1,
  loader: document.querySelector('.load-more'),
  showLoader: function () {
    this.loader.style.visibility = 'visible';
  },
  hideLoader: function () {
    this.loader.style.visibility = 'hidden';
  },
  updateQuery: function (newQuery) {
    this.query = newQuery;
  },
  nextPage: function () {
    this.page++;
  },
  resetPage: function () {
    this.page = 1;
  },
};

AppState.hideLoader();

async function fetchImages(q, page) {
  return await axios.get('api/', {
    params: {
      key: '42355472-3aa41b7abe4d1083b6d3aff39',
      page: page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      q: q,
    },
  });
}
function createGallery({ hits, total, totalHits }) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="photo-card" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
          <p class="info-item">
              <b>Likes</b>
              ${likes}
          </p>
              <p class="info-item">
          <b>Views</b>
          ${views}
          </p>
          <p class="info-item">
              <b>Comments</b>
              ${comments}
          </p>
          <p class="info-item">
              <b>Downloads</b>
              ${downloads}
          </p>
      </div>`;
      }
    )
    .join('');
}

elements.form.addEventListener('submit', handleSubmitForm);

function handleSubmitForm(e) {
  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;
  const trimValue = searchQuery.value.trim();
  if (!trimValue) return;
  AppState.updateQuery(trimValue);
  AppState.resetPage();

  handleFetchImages();
}

async function handleFetchImages() {
  AppState.hideLoader();
  try {
    const { data } = await fetchImages(AppState.query, AppState.page);
    if (!data.hits.length) {
      elements.gallery.innerHTML = '';
      iziToast.show({
        color: 'red',
        position: 'topRight',
        message: `"We're sorry, repeat search."`,
      });
      throw new Error('Error');
    }
    const pages = Math.ceil(data.totalHits / 40);
    if (AppState.page === pages) {
      AppState.hideLoader();
      iziToast.show({
        color: 'red',
        position: 'topRight',
        message: `"We're sorry, but you've reached the end of search results."`,
      });
    } else {
      AppState.showLoader();
    }
    iziToast.show({
      color: 'green',
      position: 'topRight',
      message: `"Hooray! We found ${data.totalHits} images."`,
    });
    elements.gallery.innerHTML = createGallery(data);
    observer.observe(AppState.loader);
    resetGallery();
  } catch (error) {
    console.log(error);
  }
}

let observer = new IntersectionObserver(handleObserve, {
  rootMargin: '500px',
});

function handleObserve(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      AppState.nextPage();
      handleLoadMoreFetchImages();
    }
  });
}

async function handleLoadMoreFetchImages() {
  try {
    const { data } = await fetchImages(AppState.query, AppState.page);
    const pages = Math.ceil(data.totalHits / 40);
    if (AppState.page === pages) {
      AppState.hideLoader();
      observer.unobserve(AppState.loader);
      iziToast.show({
        color: 'red',
        position: 'topRight',
        message: `"We're sorry, but you've reached the end of search results."`,
      });
    }

    elements.gallery.insertAdjacentHTML('beforeend', createGallery(data));

    const { height: cardHeight } =
      elements.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2.5,
      behavior: 'smooth',
    });
    resetGallery();
  } catch (error) {
    console.log(error);
  }
}
