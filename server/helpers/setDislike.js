/**
  * Determines the rating of the video if the user has given a negative rating
  * @param {object}  res Response object
  * @param {object}  req Request object
  * @param {boolean}  userLikedThisVideo The user has already given a positive rating
  * @param {boolean}  userDislikedThisVideo The user has already given a negative rating
  * @param {object}  video Video model
  * @param {array}  copyLikesVideo Copy of positive video ratings
  * @param {array}  copyDislikesVideo Copy of negative video ratings
  * @returns {promise} Object with correct video rating
*/
module.exports = async ({ res, req, userLikedThisVideo, userDislikedThisVideo, video, copyLikesVideo, copyDislikesVideo, }) => {
  try {
    // User rates video for the first time
    if (!userLikedThisVideo && !userDislikedThisVideo) {
      const dislikesWithCurrentUser = copyDislikesVideo.concat(req.userId);

      await video.update({ dislikes: dislikesWithCurrentUser, });

      return {
        dislikesVideo: dislikesWithCurrentUser,
        negRating: true,
      };
    }

    // The video has already been rated negatively by this user
    if (userDislikedThisVideo) {
      const dislikesWithoutCurrentUser = copyDislikesVideo.filter((userId) => userId !== req.userId); // Removing a user rating

      await video.update({ dislikes: dislikesWithoutCurrentUser, });

      return { dislikesVideo: dislikesWithoutCurrentUser, };
    }

    // Video already rated positively by this user
    if (userLikedThisVideo) {
      const likesWithoutCurrentUser = copyLikesVideo.filter((userId) => userId !== req.userId); // Removing a user rating
      const dislikesWithCurrentUser = copyDislikesVideo.concat(req.userId);

      await video.update({
        dislikes: dislikesWithCurrentUser,
        likes: likesWithoutCurrentUser,
      });

      return {
        likesVideo: likesWithoutCurrentUser,
        dislikesVideo: dislikesWithCurrentUser,
        negRating: true,
      };
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
  }
};