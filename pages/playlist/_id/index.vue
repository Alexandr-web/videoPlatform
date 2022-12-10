<template>
  <div class="playlist-page pt-100 pb-20">
    <div class="playlist-page__inner">
      <header class="playlist-page__header">
        <div class="playlist-page__background">
          <div
            class="playlist-page__background-poster"
            :class="{ 'skeleton': loadingElement, }"
          >
            <img
              class="playlist-page__background-img"
              :src="getPlaylist.poster"
              :alt="getPlaylist.title"
              @load="dataElementIsLoaded"
            >
          </div>
        </div>
        <div class="playlist-page__heading">
          <h1 class="playlist-page__heading-item playlist-page__title">{{ getPlaylist.title }}</h1>
          <h3 class="playlist-page__heading-item playlist-page__subtitle">Общее время {{ getPlaylist.time }}</h3>
          <h3 class="playlist-page__heading-item playlist-page__subtitle">Всего {{ getPlaylist.videosId.length }} видео</h3>
        </div>
        <div
          v-if="!isGuest"
          class="playlist-page__controls"
        >
          <vRemoveBtn
            :classes="['playlist-page__controls-btn']"
            :pending="pendingRemove"
            @remove="removePlaylist"
          />
          <nuxt-link
            class="playlist-page__controls-btn btn edit-btn"
            :to="`/playlist/${getPlaylist.id}/edit`"
          >Изменить</nuxt-link>
        </div>
      </header>
      <main class="playlist-page__main">
        <div class="container">
          <ul
            v-if="getPlaylistVideos.length"
            class="cards"
          >
            <vVideoCard
              v-for="(video, index) in getPlaylistVideos"
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
  import vRemoveBtn from "@/components/vRemoveBtn";
  import loadingElementDataMixin from "@/mixins/loadingElementData";
  import setPlaylistToLocalStorageMixin from "@/mixins/setPlaylistToLocalStorage";

  export default {
    name: "PlaylistPage",
    components: {
      vVideoCard,
      vRemoveBtn,
    },
    mixins: [loadingElementDataMixin, setPlaylistToLocalStorageMixin],
    layout: "default",
    // Checking for the existence of a playlist
    validate({ store, params: { id, }, }) {
      if (!id || isNaN(+id)) {
        return false;
      }

      const token = store.getters["auth.store/getToken"];
      const res = store.dispatch("playlist.store/getOne", { token, id, });

      return res
        .then(({ ok, playlist, }) => Boolean(playlist) && ok)
        .catch((err) => {
          throw err;
        });
    },
    // Getting a playlist from the database
    async asyncData({ store, params: { id, }, }) {
      try {
        const token = store.getters["auth.store/getToken"];
        const currentUser = store.getters["user.store/getUser"];
        const { ok: resPlaylistIsOk, playlist, } = await store.dispatch("playlist.store/getOne", { token, id, });
        const { ok: resVideosIsOk, videos, } = await store.dispatch("playlist.store/getVideos", { token, id, });

        if (!resPlaylistIsOk || !resVideosIsOk) {
          return {
            isGuest: true,
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
              isGuest: playlist.userId !== currentUser.id,
              videos: videosArr,
            };
          }).catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    },
    data: () => ({ pendingRemove: false, }),
    head: { title: "Просмотр плейлиста", },
    computed: {
      getPlaylist() {
        return this.$store.getters["playlist.store/getPlaylist"];
      },
      getPlaylistVideos() {
        return this.$store.getters["playlist.store/getListVideos"];
      },
      getUser() {
        return this.$store.getters["user.store/getUser"];
      },
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
    },
    mounted() {
      if (this.videos) {
        this.setPlaylistToLocalStorage(this.videos);
      }
    },
    methods: {
      // Deleting a playlist
      removePlaylist() {
        const token = this.getToken;
        const { id: playlistId, } = this.$route.params;
        const { id: userId, } = this.getUser;
        const res = this.$store.dispatch("playlist.store/remove", { token, id: playlistId, });

        this.pendingRemove = true;

        res.then(({ ok, }) => {
          this.pendingRemove = false;

          if (ok) {
            this.$router.push(`/user/${userId}?tab=playlists`);
          }
        }).catch((err) => {
          throw err;
        });
      },
    },
  };
</script>