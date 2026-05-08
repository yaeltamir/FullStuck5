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
    useState(
      localStorage.getItem(
        "albumsSearch"
      ) || ""
    );

  const [visibleCount, setVisibleCount] =
    useState(
      Number(
        localStorage.getItem(
          "visiblePhotosCount"
        )
      ) || 5
    );

  const currentUser = JSON.parse(
    localStorage.getItem(
      "currentUser"
    )
  );

  useEffect(() => {

    localStorage.setItem(
      "albumsSearch",
      search
    );

  }, [search]);

  useEffect(() => {

    localStorage.setItem(
      "visiblePhotosCount",
      visibleCount
    );

  }, [visibleCount]);

  useEffect(() => {

    if (selectedAlbum) {

      localStorage.setItem(
        "selectedAlbum",
        JSON.stringify(selectedAlbum)
      );

    }

  }, [selectedAlbum]);

  useEffect(() => {

    if (!currentUser) return;

    loadAlbums(currentUser.id);

    const savedAlbum =
      localStorage.getItem(
        "selectedAlbum"
      );

    if (savedAlbum) {

      const parsedAlbum =
        JSON.parse(savedAlbum);

      selectAlbum(parsedAlbum);
    }
  }, []);

  // LOAD ALBUMS
  async function loadAlbums(userId) {

    const data = await apiGet(
      `/albums?userId=${userId}`
    );

    setAlbums(data);
  }

  // SELECT ALBUM
  async function selectAlbum(album) {

    if (!album?.id) return;

    setSelectedAlbum(album);

    const data = await apiGet(
      `/photos?albumId=${album.id}`
    );

    setPhotos(data);

    setVisibleCount(5);
  }

  // ADD ALBUM
  async function addAlbum() {

    const title = prompt(
      "Album title:"
    );

    if (!title?.trim()) {
      return;
    }

    const newAlbum = {
      userId: currentUser.id,
      title,
    };

    const savedAlbum =
      await apiPost(
        "/albums",
        newAlbum
      );

    setAlbums((prev) => [
      savedAlbum,
      ...prev,
    ]);
  }

  // DELETE ALBUM
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

  // ADD PHOTO
  async function addPhoto() {

    if (!selectedAlbum) {
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

    const newPhoto = {
      albumId:
        selectedAlbum.id,

      title,

      url,

      thumbnailUrl: url,
    };

    const savedPhoto =
      await apiPost(
        "/photos",
        newPhoto
      );

    setPhotos((prev) => [
      savedPhoto,
      ...prev,
    ]);
  }

  // DELETE PHOTO
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

  // UPDATE PHOTO
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

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photo.id
          ? updatedPhoto
          : p
      )
    );
  }

  // SEARCH
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

      <h1>Albums</h1>

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

      {/* ALBUMS LIST */}
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
            {album.id} -{" "}
            {album.title}
          </button>

          {album.userId ===
            currentUser.id && (

            <button
              onClick={() =>
                deleteAlbum(
                  album.id
                )
              }
            >
              Delete
            </button>
          )}

        </div>
      ))}

      <hr />

      {/* SELECTED ALBUM */}
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