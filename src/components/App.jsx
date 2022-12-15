import { useState, useEffect } from 'react';

import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import Notification from './Notification';
import imagesFetch from '../services/imagesFetch';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [largeImageUrlAndTags, setLargeImageUrlAndTags] = useState(null);
  const [totalImages, setTotalImages] = useState(null);

  useEffect(() => {
    if (!query) {
      return;
    }

    imagesFetch(query, page)
      .then(dataImages => {
        setImages(prevImages => [...prevImages, ...dataImages.hits]);

        setTotalImages(dataImages.totalHits);
      })
      .catch(error => {
        console.log(error);
      });
  }, [query, page]);

  const handleSubmitSearch = newQuery => {
    if (query === newQuery) {
      return;
    }

    setQuery(newQuery);
    setImages([]);
    setPage(1);

    window.scrollTo({ top: 0, left: 0 });
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleGetLargeImageUrlAndTags = newImageUrlAndTags => {
    setLargeImageUrlAndTags(newImageUrlAndTags);
  };

  const handleModalClose = () => {
    setLargeImageUrlAndTags(null);
  };

  return (
    <>
      <Searchbar onSubmit={handleSubmitSearch} />

      {totalImages === null && (
        <Notification>Please Enter search query</Notification>
      )}

      {totalImages === 0 && (
        <Notification eventColor="red">Enter something normal :)</Notification>
      )}

      {images.length > 0 && (
        <>
          <ImageGallery
            images={images}
            onGetLargeImageUrlAndTags={handleGetLargeImageUrlAndTags}
          />
          {images.length < totalImages ? (
            <Button onClick={handleLoadMore} />
          ) : (
            <Notification>The images are end!</Notification>
          )}
        </>
      )}

      {largeImageUrlAndTags && (
        <Modal
          onModalClose={handleModalClose}
          largeImage={largeImageUrlAndTags}
        />
      )}
    </>
  );
};

export default App;
