import {
  useEffect,
  useState,
} from "react";

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

  const currentUser = JSON.parse(
    localStorage.getItem(
      "currentUser"
    )
  );

  useEffect(() => {

    if (!currentUser) return;

    loadAlbums();

  }, []);

  async function loadAlbums() {

    const data = await apiGet(
      `/albums?userId=${currentUser.id}`
    );

    setAlbums(data);
  }

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

  async function addAlbum() {

    const title = prompt(
      "Album title:"
    );

    if (!title?.trim()) {
      return;
    }

    if (title.length < 2) {

      alert(
        "Album title too short"
      );

      return;
    }

    const newAlbum = {
      userId: currentUser.id,
      title,
    };

    await apiPost(
      "/albums",
      newAlbum
    );

    await loadAlbums();
  }

  async function updateAlbum(album) {

    const title = prompt(
      "New album title:",
      album.title
    );

    if (!title?.trim()) {
      return;
    }

    const updatedAlbum = {
      ...album,
      title,
    };

    await apiPut(
      `/albums/${album.id}`,
      updatedAlbum
    );

    await loadAlbums();

    if (
      selectedAlbum?.id ===
      album.id
    ) {
      setSelectedAlbum(
        updatedAlbum
      );
    }
  }

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

  async function addPhoto() {

    if (!selectedAlbum?.id) {
      return;
    }

    const title = prompt(
      "Photo title:"
    );

    const url = prompt(
      "Photo URL:"
    );

    if (
      !title?.trim() ||
      !url?.trim()
    ) {
      return;
    }

    if (
      !url.startsWith("http")
    ) {

      alert(
        "Invalid URL"
      );

      return;
    }

    const newPhoto = {

      albumId:
        selectedAlbum.id,

      title,

      url,

      thumbnailUrl: url,
    };

    await apiPost(
      "/photos",
      newPhoto
    );

    await selectAlbum(
      selectedAlbum
    );
  }

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

  async function updatePhoto(photo) {

    const title = prompt(
      "New title:",
      photo.title
    );

    if (!title?.trim()) {
      return;
    }

    const updatedPhoto = {
      ...photo,
      title,
    };

    await apiPut(
      `/photos/${photo.id}`,
      updatedPhoto
    );

    await selectAlbum(
      selectedAlbum
    );
  }

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
        placeholder="Search album..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <hr />

      {filteredAlbums.map(
        (album) => (

        <div
          key={album.id}
          style={{
            marginBottom:
              "10px",
          }}
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

    </div>
  );
}