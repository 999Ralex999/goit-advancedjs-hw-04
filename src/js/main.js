import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages } from './gallery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const state = {
  page: 1,
  query: '',
  cardHeight: 0,
};

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

elements.form.addEventListener('submit', handleSubmit);
elements.loadMore.addEventListener('click', loadMoreHandler);

function notify({ message, type = 'error' }) {
  iziToast[type]({ message, position: 'topRight' });
}

function toggleLoadMoreButton(isVisible = true) {
  elements.loadMore.classList.toggle('is-hidden', !isVisible);
}

async function fetchAndDisplayImages() {
  try {
    const { images, totalImages } = await fetchImages(state.query, state.page);

    if (!images.length) {
      notify({
        message:
          'Sorry, there are no images matching your search query. Please try again.',
      });
      return;
    }

    if (state.page === 1) {
      notify({
        message: `Hooray! We found ${totalImages} images.`,
        type: 'success',
      });
    }

    elements.gallery.insertAdjacentHTML(
      'beforeend',
      generateMarkupForImages(images)
    );
    lightbox.refresh();

    toggleLoadMoreButton(state.page < Math.ceil(totalImages / 40));

    state.cardHeight = elements.gallery.firstElementChild.clientHeight;
    window.scrollBy({ top: state.cardHeight - 200, behavior: 'smooth' });
  } catch (error) {
    notify({
      message: "We're sorry, but you've reached the end of search results.",
    });
    toggleLoadMoreButton(false);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  toggleLoadMoreButton(false);
  elements.gallery.innerHTML = '';
  const searchValue = elements.input.value.trim();

  if (!searchValue) {
    notify({ message: 'Please enter a search query.' });
    return;
  }

  state.query = searchValue;
  state.page = 1;
  fetchAndDisplayImages();
}

function loadMoreHandler() {
  state.page++;
  fetchAndDisplayImages();
}

function generateMarkupForImages(images) {
  return images
    .map(
      ({
        largeImageURL,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) => `
    <a class="photo-card" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes</b> ${likes}</p>
        <p class="info-item"><b>Views</b> ${views}</p>
        <p class="info-item"><b>Comments</b> ${comments}</p>
        <p class="info-item"><b>Downloads</b> ${downloads}</p>
      </div>
    </a>`
    )
    .join('');
}
