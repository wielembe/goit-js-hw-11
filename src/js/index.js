`use strict`;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
//test
const moreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');
moreBtn.style.display = 'none';
const clearGallery = ``;
let inputValue = ``;
let currentPage = 1;

export const fetchResults = async (userInput, currentPage) => {
  const apiKey = `39919801-cd3556a07d6c2157d605c68ff`;
  const url = `https://pixabay.com/api/`;
  const options = {
    params: {
      key: apiKey,
      q: userInput,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: 40,
    },
  };
  const response = await axios(url, options);
  return response.data;
};

const galleryFunctionality = async () => {
  try {
    if (inputValue === ``) {
      Notiflix.Notify.info('Input cannot be empty!');
      return;
    }
    const response = await fetchResults(inputValue, currentPage);
    if (response.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createGallery(response.hits);
      moreBtn.style.display = 'block';
      if (currentPage === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images.`
        );
      }
      if (gallery.childNodes.length >= response.totalHits) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        moreBtn.style.display = 'none';
      }
    }
    if (currentPage >= 2) {
      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    Notiflix.Notify.failure('An error occured...');
  }
};
const createGallery = images => {
  const markup = images
    .map(
      image =>
        `<div class="photo-card">
        <a class="photo-card__link" href="${image.largeImageURL}">
        <img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${image.downloads}
          </p>
        </div>
      </div>`
    )
    .join(``);
  gallery.innerHTML += markup;
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = clearGallery;
  currentPage = 1;
  inputValue = event.currentTarget.elements.searchQuery.value;

  galleryFunctionality();
});
moreBtn.addEventListener('click', () => {
  currentPage++;
  galleryFunctionality();
});
