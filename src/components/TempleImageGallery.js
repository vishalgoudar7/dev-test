import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const TempleImageGallery = ({ images, galleryHeight = 220, imageHeight = 180 }) => {
  if (!images || images.length === 0) return <p>No images available.</p>;
  const galleryImages = images.map(img => ({
    original: img.image,
    thumbnail: img.image,
    originalAlt: 'Temple image',
    thumbnailAlt: 'Temple thumbnail',
    originalClass: 'temple-gallery-img',
    thumbnailClass: 'temple-gallery-thumb',
  }));
  return (
    <div style={{ maxWidth: '100%', height: galleryHeight }}>
      <ImageGallery
        items={galleryImages}
        showPlayButton={false}
        showFullscreenButton={true}
        showIndex={true}
        additionalClass="temple-gallery-wrapper"
        renderLeftNav={(onClick, disabled) => (
          <button
            type="button"
            className="image-gallery-custom-nav image-gallery-custom-nav-left"
            disabled={disabled}
            onClick={onClick}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              zIndex: 2,
              cursor: 'pointer',
              fontSize: 20,
              color: '#333',
              outline: 'none',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            &#8592;
          </button>
        )}
        renderRightNav={(onClick, disabled) => (
          <button
            type="button"
            className="image-gallery-custom-nav image-gallery-custom-nav-right"
            disabled={disabled}
            onClick={onClick}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              zIndex: 2,
              cursor: 'pointer',
              fontSize: 20,
              color: '#333',
              outline: 'none',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            &#8594;
          </button>
        )}
      />
      <style>{`
        .temple-gallery-img img {
          max-height: ${imageHeight}px !important;
          object-fit: contain;
        }
        .temple-gallery-thumb img {
          max-height: 48px !important;
          object-fit: contain;
        }
        .temple-gallery-wrapper .image-gallery-slide {
          display: flex;
          justify-content: center;
        }
        .image-gallery-custom-nav {
          transition: background 0.2s, opacity 0.2s;
        }
        .image-gallery-custom-nav:active {
          background: #ffe082 !important;
        }
      `}</style>
    </div>
  );
};

export default TempleImageGallery;
