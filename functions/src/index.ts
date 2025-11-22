import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Example: Send notification on like
export const onLikeSendNotification = functions.firestore
  .document("posts/{postId}/likes/{userId}")
  .onCreate(async (snap, context) => {
    const postId = context.params.postId;
    const likerId = context.params.userId;

    const postDoc = await admin.firestore().doc(`posts/${postId}`).get();
    if (!postDoc.exists) return;

    const post = postDoc.data();
    const authorId = post?.authorId;

    if (authorId === likerId) return; // Don't notify if user likes their own post

    // Get liker info
    const likerDoc = await admin.firestore().doc(`users/${likerId}`).get();
    if (!likerDoc.exists) return;

    const liker = likerDoc.data();

    // Get author's notifications
    const notificationsRef = admin.firestore().doc(`notifications/${authorId}`);
    const notificationsDoc = await notificationsRef.get();

    const newNotification = {
      id: `${postId}_like_${likerId}`,
      type: "like",
      fromUserId: likerId,
      fromUsername: liker?.username || "someone",
      fromUserPhoto: liker?.photoURL,
      postId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (notificationsDoc.exists) {
      const data = notificationsDoc.data();
      const list = data?.list || [];
      const unreadCount = data?.unreadCount || 0;

      await notificationsRef.update({
        list: admin.firestore.FieldValue.arrayUnion(newNotification),
        unreadCount: unreadCount + 1,
      });
    } else {
      await notificationsRef.set({
        list: [newNotification],
        unreadCount: 1,
      });
    }
  });

// Example: Auto-ban for repeated reports
export const autoBanRepeatedReports = functions.firestore
  .document("reports/{postId}/{reporterId}")
  .onCreate(async (snap, context) => {
    const postId = context.params.postId;

    // Count reports for this post
    const reportsSnapshot = await admin
      .firestore()
      .collection("reports")
      .where("postId", "==", postId)
      .get();

    if (reportsSnapshot.size >= 5) {
      // Get post author
      const postDoc = await admin.firestore().doc(`posts/${postId}`).get();
      if (!postDoc.exists) return;

      const authorId = postDoc.data()?.authorId;
      if (!authorId) return;

      // Ban user
      await admin.firestore().doc(`users/${authorId}`).update({
        isBanned: true,
      });

      // Delete the post
      await admin.firestore().doc(`posts/${postId}`).delete();
    }
  });

