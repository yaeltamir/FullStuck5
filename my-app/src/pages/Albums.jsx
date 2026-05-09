import {
  useEffect,
  useState,
} from "react";

import Modal from "../pages/Modal";

import {
  apiGet,
  apiPost,
  apiDelete,
  apiPut,
} from "../api/api";

export default function Albums() {

  const [albums, setAlbums] =
    useState([]);

  const [photos, setPhotos] =
    useState([]);

  const [selectedAlbum,
    setSelectedAlbum] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [visibleCount,
    setVisibleCount] =
    useState(5);

  // ======================
  // ALBUM MODAL
  // ======================

  const [showAlbumModal,
    setShowAlbumModal] =
    useState(false);

  const [albumTitle,
    setAlbumTitle] =
    useState("");

  const [editingAlbum,
    setEditingAlbum] =
    useState(null);

  // ======================
  // PHOTO MODAL
  // ======================

  const [showPhotoModal,
    setShowPhotoModal] =
    useState(false);

  const [photoTitle,
    setPhotoTitle] =
    useState("");

  const [photoUrl,
    setPhotoUrl] =
    useState("");

  const [editingPhoto,
    setEditingPhoto] =
    useState(null);

  const currentUser = JSON.parse(
    localStorage.getItem(
      "currentUser"
    )
  );

  useEffect(() => {

    if (!currentUser) return;

    loadAlbums();

  }, []);

  // ======================
  // LOAD ALBUMS
  // ======================

  async function loadAlbums() {

    const data = await apiGet(
      `/albums?userId=${currentUser.id}`
    );

    setAlbums(data);
  }

  // ======================
  // SELECT ALBUM
  // ======================

  async function selectAlbum(album) {

    if (!album?.id) {
      return;
    }

    setSelectedAlbum(album);

    const data = await apiGet(
      `/photos?albumId=${album.id}`
    );

    setPhotos(data);

    setVisibleCount(5);
  }

  // ======================
  // ADD ALBUM
  // ======================

  function addAlbum() {

    setEditingAlbum(null);

    setAlbumTitle("");

    setShowAlbumModal(true);
  }

  // ======================
  // EDIT ALBUM
  // ======================

  function updateAlbum(album) {

    setEditingAlbum(album);

    setAlbumTitle(album.title);

    setShowAlbumModal(true);
  }

  // ======================
  // SAVE ALBUM
  // ======================

  async function saveAlbum() {

    if (!albumTitle.trim()) {
      return;
    }

    if (albumTitle.length < 2) {

      alert(
        "Album title too short"
      );

      return;
    }

    if (editingAlbum) {

      const updatedAlbum = {

        ...editingAlbum,

        title: albumTitle,
      };

      await apiPut(
        `/albums/${editingAlbum.id}`,
        updatedAlbum
      );

    } else {

      await apiPost(
        "/albums",
        {
          userId: currentUser.id,
          title: albumTitle,
        }
      );
    }

    await loadAlbums();

    setShowAlbumModal(false);

    setAlbumTitle("");

    setEditingAlbum(null);
  }

  // ======================
  // DELETE ALBUM
  // ======================

  async function deleteAlbum(id) {

    await apiDelete(
      `/albums/${id}`
    );

    setAlbums((prev) =>
      prev.filter(
        (a) => a.id !== id
      )
    );

    if (
      selectedAlbum?.id === id
    ) {

      setSelectedAlbum(null);

      setPhotos([]);
    }
  }

  // ======================
  // ADD PHOTO
  // ======================

  function addPhoto() {

    if (!selectedAlbum?.id) {
      return;
    }

    setEditingPhoto(null);

    setPhotoTitle("");

    setPhotoUrl("");

    setShowPhotoModal(true);
  }

  // ======================
  // EDIT PHOTO
  // ======================

  function updatePhoto(photo) {

    setEditingPhoto(photo);

    setPhotoTitle(photo.title);

    setPhotoUrl(photo.url);

    setShowPhotoModal(true);
  }

  // ======================
  // SAVE PHOTO
  // ======================

  async function savePhoto() {

    if (!selectedAlbum?.id) {
      return;
    }

    if (
      !photoTitle.trim() ||
      !photoUrl.trim()
    ) {
      return;
    }

    if (
      !photoUrl.startsWith(
        "http"
      )
    ) {

      alert(
        "Invalid URL"
      );

      return;
    }

    if (editingPhoto) {

      const updatedPhoto = {

        ...editingPhoto,

        title: photoTitle,

        url: photoUrl,

        thumbnailUrl:
          photoUrl,
      };

      await apiPut(
        `/photos/${editingPhoto.id}`,
        updatedPhoto
      );

    } else {

      await apiPost(
        "/photos",
        {
          albumId:
            selectedAlbum.id,

          title: photoTitle,

          url: photoUrl,

          thumbnailUrl:
            photoUrl,
        }
      );
    }

    await selectAlbum(
      selectedAlbum
    );

    setShowPhotoModal(false);

    setPhotoTitle("");

    setPhotoUrl("");

    setEditingPhoto(null);
  }

  // ======================
  // DELETE PHOTO
  // ======================

  async function deletePhoto(id) {

    await apiDelete(
      `/photos/${id}`
    );

    setPhotos((prev) =>
      prev.filter(
        (p) => p.id !== id
      )
    );
  }

  // ======================
  // SEARCH
  // ======================

  const filteredAlbums =
    albums.filter((album) => {

      const text =
        search.toLowerCase();

      return (

        album.title
          .toLowerCase()
          .includes(text) ||

        String(album.id)
          .includes(text)
      );
    });

  return (

    <div>

      <h1>
        Albums
      </h1>

      <button
        onClick={addAlbum}
      >
        Add Album
      </button>

      <br />
      <br />

      <input
        placeholder="
          Search album...
        "
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <hr />

      {/* ALBUMS */}

      {filteredAlbums.map(
        (album) => (

        <div
          key={album.id}
          className="card"
        >

          <button
            onClick={() =>
              selectAlbum(album)
            }
          >
            {album.title}
          </button>

          <button
            onClick={() =>
              updateAlbum(album)
            }
          >
            Edit
          </button>

          <button
            onClick={() =>
              deleteAlbum(
                album.id
              )
            }
          >
            Delete
          </button>

        </div>
      ))}

      <hr />

      {/* PHOTOS */}

      {selectedAlbum && (

        <div>

          <h2>
            {
              selectedAlbum.title
            }
          </h2>

          <button
            onClick={addPhoto}
          >
            Add Photo
          </button>

          <div
            className="
              photos-grid
            "
          >

            {photos
              .slice(
                0,
                visibleCount
              )
              .map((photo) => (

              <div
                key={photo.id}
                className="
                  photo-card
                "
              >

                <img
                  src={
                    photo.thumbnailUrl
                  }
                  alt={
                    photo.title
                  }
                  width="200"
                />

                <p>
                  {photo.title}
                </p>

                <button
                  onClick={() =>
                    updatePhoto(
                      photo
                    )
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deletePhoto(
                      photo.id
                    )
                  }
                >
                  Delete
                </button>

              </div>
            ))}

          </div>

          {visibleCount <
            photos.length && (

            <button
              onClick={() =>
                setVisibleCount(
                  (
                    prev
                  ) =>
                    prev + 5
                )
              }
            >
              Load More
            </button>
          )}

        </div>
      )}

      {/* ====================== */}
      {/* ALBUM MODAL */}
      {/* ====================== */}

      <Modal
        isOpen={
          showAlbumModal
        }
        onClose={() =>
          setShowAlbumModal(
            false
          )
        }
      >

        <h2>
          {editingAlbum
            ? "Edit Album"
            : "Add Album"}
        </h2>

        <input
          value={albumTitle}
          onChange={(e) =>
            setAlbumTitle(
              e.target.value
            )
          }
          placeholder="
            Album title
          "
        />

        <button
          onClick={saveAlbum}
        >
          Save
        </button>

      </Modal>

      {/* ====================== */}
      {/* PHOTO MODAL */}
      {/* ====================== */}

      <Modal
        isOpen={
          showPhotoModal
        }
        onClose={() =>
          setShowPhotoModal(
            false
          )
        }
      >

        <h2>
          {editingPhoto
            ? "Edit Photo"
            : "Add Photo"}
        </h2>

        <input
          value={photoTitle}
          onChange={(e) =>
            setPhotoTitle(
              e.target.value
            )
          }
          placeholder="
            Photo title
          "
        />

        <input
          value={photoUrl}
          onChange={(e) =>
            setPhotoUrl(
              e.target.value
            )
          }
          placeholder="
            Photo URL
          "
        />

        <button
          onClick={savePhoto}
        >
          Save
        </button>

      </Modal>

    </div>
  );
}