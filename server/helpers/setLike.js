/**
  * Determines the rating of the video if the user has given a positive rating
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
      const likesWithCurrentUser = copyLikesVideo.concat(req.userId);

      await video.update({ likes: likesWithCurrentUser, });

      return {
        posRating: true,
        likesVideo: likesWithCurrentUser,
        dislikesVideo: video.dislikes,
      };
    }

    // Video already rated positively by this user
    if (userLikedThisVideo) {
      const likesWithoutCurrentUser = copyLikesVideo.filter((id) => id !== req.userId); // Removing a user rating

      await video.update({ likes: likesWithoutCurrentUser, });

      return {
        likesVideo: likesWithoutCurrentUser,
        dislikesVideo: video.dislikes,
      };
    }

    // The video has already been rated negatively by this user
    if (userDislikedThisVideo) {
      const dislikesWithoutCurrentUser = copyDislikesVideo.filter((userId) => userId !== req.userId); // Removing a user rating
      const likesWithCurrentUser = copyLikesVideo.concat(req.userId);

      await video.update({
        dislikes: dislikesWithoutCurrentUser,
        likes: likesWithCurrentUser,
      });

      return {
        posRating: true,
        likesVideo: likesWithCurrentUser,
        dislikesVideo: dislikesWithoutCurrentUser,
      };
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", status: 500, type: "error", });
  }
};