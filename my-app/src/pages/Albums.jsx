import { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    loadAlbums(user.id);
  }, []);

  async function loadAlbums(userId) {
    const data = await apiGet(`/albums?userId=${userId}`);
    setAlbums(data);
  }

  async function selectAlbum(album) {
    setSelectedAlbum(album);
    setVisibleCount(5);

    const data = await apiGet(`/photos?albumId=${album.id}`);
    setPhotos(data);
  }

  function addAlbum() {
    const title = prompt("Album title:");
    if (!title?.trim()) return;

    const newAlbum = {
      id: Date.now(),
      title,
    };

    setAlbums([newAlbum, ...albums]);
  }

  function deletePhoto(id) {
    setPhotos(photos.filter((p) => p.id !== id));
  }

  function updatePhoto(id) {
    const newTitle = prompt("New photo title:");
    if (!newTitle?.trim()) return;

    setPhotos(
      photos.map((p) =>
        p.id === id ? { ...p, title: newTitle } : p
      )
    );
  }

  function addPhoto() {
    if (!selectedAlbum) return;

    const title = prompt("Photo title:");
    const url = prompt("Photo URL:");

    if (!title?.trim() || !url?.trim()) return;

    const newPhoto = {
      id: Date.now(),
      albumId: selectedAlbum.id,
      title,
      url,
      thumbnailUrl: url,
    };

    setPhotos([newPhoto, ...photos]);
  }

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.toLowerCase()) ||
    String(album.id).includes(search)
  );

  const visiblePhotos = photos.slice(0, visibleCount);

  return (
    <div>
      <h1>Albums</h1>

      <button onClick={addAlbum}>Add Album</button>

      <br /><br />

      <input
        placeholder="Search album by id/title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Albums List</h2>

      {filteredAlbums.map((album) => (
        <div key={album.id}>
          <button onClick={() => selectAlbum(album)}>
            {album.id} - {album.title}
          </button>
        </div>
      ))}

      <hr />

      {selectedAlbum && (
        <div>
          <h2>{selectedAlbum.title}</h2>

          <button onClick={addPhoto}>Add Photo</button>

          <div>
            {visiblePhotos.map((photo) => (
              <div key={photo.id}>
                <h4>{photo.title}</h4>

                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  width="120"
                />

                <br />

                <button onClick={() => updatePhoto(photo.id)}>
                  Update
                </button>

                <button onClick={() => deletePhoto(photo.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>

          {visibleCount < photos.length && (
            <button onClick={() => setVisibleCount(visibleCount + 5)}>
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}