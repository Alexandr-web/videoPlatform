<template>
  <div class="profile__tab profile__tab-channels pb-20 pt-20">
    <ul
      v-if="channels.length"
      class="profile__channels-list"
    >
      <vChannelCard
        v-for="(channel, index) in channels"
        :key="index"
        :channel="channel"
      />
    </ul>
    <vNothing v-else />
  </div>
</template>

<script>
  import vChannelCard from "@/components/vChannelCard";
  import vNothing from "@/components/vNothing";
  import getValidAvatarUrlMixin from "@/mixins/getValidAvatarUrl";

  export default {
    name: "ProfileChannelsComponent",
    components: {
      vChannelCard,
      vNothing,
    },
    mixins: [getValidAvatarUrlMixin],
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data: () => ({ channels: [], }),
    async fetch() {
      try {
        const token = this.$store.getters["auth.store/getToken"];
        const { id, } = this.user;
        const { ok, followings, } = await this.$store.dispatch("user.store/getFollowings", { token, id, });

        if (ok) {
          followings.map((following) => {
            const { avatar, } = following;

            // Filling channels with a valid avatar url
            this.getValidAvatarUrl(avatar)
              .then((newAvatar) => {
                this.channels.push({
                  ...following,
                  avatar: newAvatar,
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
  };
</script>