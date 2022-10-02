const { initializeApp } = require('firebase/app');
const dotenv = require('dotenv');
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require('firebase/storage');

//Model
const { PostImg } = require('../models/postImg.model');

dotenv.config({ path: './config.env' });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseapp = initializeApp(firebaseConfig);

// Storage firebase service
const storage = getStorage(firebaseapp);

const uploadPostImgs = async (imgs, postId) => {
  //Map async ->  Async operations with arrays, map, filter
  const imgsPromises = imgs.map(async (img) => {
    //Create firebase refrerence
    const [originalname, ext] = img.originalname.split('.');

    const filename = `posts/${postId}/${originalname}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    //Uplead image to Firebase
    const result = await uploadBytes(imgRef, img.buffer);

    await PostImg.create({
      postId,
      imgUrl: result.metadata.fullPath,
    });
  });

  await Promise.all(imgsPromises);
};

const getPostsImgsUrls = async (posts) => {
  // Loop trough posts to get to the postImgs
  const postsWithImgsPromises = posts.map(async (post) => {
    // Get img URLs
    const postImgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.imgUrl);
      const imgUrl = await getDownloadURL(imgRef);
      postImg.imgUrl = imgUrl;
      return postImg;
    });
    // Resolve imgs URLS
    const postImgs = await Promise.all(postImgsPromises);
    // Updtate old postImgs array with new array
    post.postImg = postImgs;
    return post;
  });
  //Resolve
  return await Promise.all(postsWithImgsPromises);
};
module.exports = { storage, uploadPostImgs, getPostsImgsUrls };
