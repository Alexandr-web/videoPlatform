<template>
  <div class="playlist-page pt-100 pb-20">
    <div class="playlist-page__inner">
      <header class="playlist-page__header">
        <div class="playlist-page__background">
          <img
            class="playlist-page__background-poster"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpF-mNhihSds3MwEhpwEWusxfju3U_-kNAA&usqp=CAU"
            alt="название плейлиста"
          >
        </div>
        <div class="playlist-page__heading">
          <h1 class="playlist-page__title">Название плейлиста</h1>
          <h3 class="playlist-page__subtitle">Просмотр займет 41 минут</h3>
        </div>
        <div class="playlist-page__controls">
          <button class="playlist-page__controls-btn btn remove-btn">Удалить</button>
          <nuxt-link
            class="playlist-page__controls-btn btn edit-btn"
            to="/playlist/id/edit"
          >Изменить</nuxt-link>
        </div>
      </header>
      <main class="playlist-page__main">
        <div class="container">
          <ul
            v-if="videos.length"
            class="videos"
          >
            <vVideoCard
              v-for="(video, index) in videos"
              :key="index"
              :card="video"
            />
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import vVideoCard from "@/components/vVideoCard";

  export default {
    name: "PlaylistPage",
    components: { vVideoCard, },
    layout: "default",
    // Checking for the existence of a playlist
    validate({ store, params: { id, }, }) {
      if (!id || isNaN(+id)) {
        return false;
      }

      const token = store.getters["auth.store/getToken"];
      const res = store.dispatch("playlist.store/getOne", { token, id, });

      return res
        .then(({ ok, }) => ok)
        .catch((err) => {
          throw err;
        });
    },
    // Getting a playlist from the database
    async asyncData({ store, params: { id, }, }) {
      try {
        const token = store.getters["auth.store/getToken"];
        const { ok: resPlaylistIsOk, playlist, } = await store.dispatch("playlist.store/getOne", { token, id, });
        const { ok: resVideosIsOk, videos, } = await store.dispatch("playlist.store/getVideos", { token, id, });

        if (!resPlaylistIsOk || !resVideosIsOk) {
          return {
            playlist: {},
            videos: [],
          };
        }

        const poster = await store.dispatch("playlist.store/getValidUrlPlaylistPoster", playlist.poster);
        const promises = videos.map((video) => {
          return store.dispatch("video.store/getValidUrlVideoDataFile", video.poster)
            .then((videoPoster) => ({ ...video, poster: videoPoster, }))
            .catch((err) => {
              throw err;
            });
        });

        return Promise.all(promises)
          .then((videosArr) => {
            const donePlaylist = { ...playlist, poster, };

            // Set a playlist in the store
            store.commit("playlist.store/setPlaylist", donePlaylist);
            // Set a list videos in the store
            store.commit("playlist.store/setListVideos", videosArr);
            
            return {
              playlist: donePlaylist,
              videos: videosArr,
            };
          }).catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Просмотр плейлиста", },
  };
</script>