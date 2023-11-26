import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { InfinitySpin } from 'react-loader-spinner';
import { Searchbar } from './Seacrhbar/Searchbar';
import { Header } from './Header/Header';
import { Gallery } from './Gallery/Gallery';
import { GalleryItem } from './GalleryItem/GalleryItem';
import { LoadMore } from './LoadMore/LoadMore';
import Modal from './Modal/Modal';
import * as ImageService from 'service/pixabay-api';

export default function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }
    const getImage = async () => {
      setLoading(true);
      setLoadMore(false);
      try {
        const dataImage = await ImageService.getImage(query, page);
        if (dataImage.hits.length === 0) {
          toast.error('No images found!');
          return;
        }
        const { hits, totalHits } = dataImage;
        setImages(prevState => (prevState ? [...prevState, ...hits] : hits));
        setLoadMore(page < Math.ceil(totalHits / 12) ? true : false);
      } catch (error) {
        setImages(null);
        toast.error('Oops! Something went wrong!');
      } finally {
        setLoading(false);
      }
    };

    getImage();
  }, [query, page]);

  const addValue = value => {
    if (value === query) {
      setShowModal(false);
      return;
    }
    setQuery(value);
    setImages(null);
    setPage(1);
    setLoadMore(false);
    setShowModal(false);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const toggleModal = selectedImage => {
    setShowModal(prevState => !prevState);
    setSelectedImage(selectedImage);
  };

  return (
    <>
      <Header>
        <Searchbar onSubmit={addValue} />
      </Header>
      <Gallery>
        {images && <GalleryItem images={images} onClick={toggleModal} />}
      </Gallery>
      {loading && <InfinitySpin width="200" color="blue" />}
      {loadMore && <LoadMore onClick={handleLoadMore} />}
      {showModal && <Modal onClose={toggleModal} ImageUrl={selectedImage} />}
      <ToastContainer autoClose={3000} />
    </>
  );
}
