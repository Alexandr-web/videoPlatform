<template>
  <div class="profile__tab profile__tab-playlists pb-20 pt-20">
    <ul
      v-if="playlists.length"
      class="cards"
    >
      <vPlaylistCard
        v-for="(playlist, index) in playlists"
        :key="index"
        :card="playlist"
      />
    </ul>
    <vNothing v-else />
  </div>
</template>

<script>
  import vNothing from "@/components/vNothing";
  import vPlaylistCard from "@/components/vPlaylistCard";

  export default {
    name: "ProfilePlaylistsComponent",
    components: {
      vPlaylistCard,
      vNothing,
    },
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({ playlists: [], }),
    // Getting playlists from the server
    async fetch() {
      try {
        const token = this.getToken;
        const { id: userId, } = this.user;
        const { ok, playlists, } = await this.$store.dispatch("user.store/getPlaylists", { token, id: userId, });
        
        if (ok) {
          playlists.map((playlist) => {
            const { poster, } = playlist;

            this.$store.dispatch("playlist.store/getValidUrlPlaylistPoster", poster)
              .then((validPoster) => {
                this.playlists.push({
                  ...playlist,
                  poster: validPoster,
                });
              }).catch((err) => {
                throw err;
              });
          });
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getToken() {
        return this.$store.getters["auth.store/getToken"];
      },
    },
  };
</script>