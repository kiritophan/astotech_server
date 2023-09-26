import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* Your Config */
const firebaseConfig = {
  apiKey: "AIzaSyDCRcJbANr8ecACEFqfPvhK0eCdMycv3SU",
  authDomain: "typescript-pr-98dff.firebaseapp.com",
  projectId: "typescript-pr-98dff",
  storageBucket: "typescript-pr-98dff.appspot.com",
  messagingSenderId: "692960288298",
  appId: "1:692960288298:web:b3124e9b341d917ec22d53",
  measurementId: "G-RDZ1W9D1VQ"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToStorage(file: any, folderName: any, bufferData: any = undefined) {
  // nếu file là null thì không làm gì hết
  if (!file) {
    return false
  }

  let fileRef;
  let metadata;
  if (!bufferData) {
    // tên file trên file base
    fileRef = ref(storage, `${folderName}/` + file.name);
  } else {
    // tên file trên file base
    fileRef = ref(storage, `${folderName}/` + (file as any).filename);
    metadata = {
      contentType: (file as any).mimetype,
    };
  }
  let url;
  if (bufferData) {
    // upload file lên fire storage
    url = await uploadBytes(fileRef, bufferData, metadata).then(async res => {
      // khi up thành công thì tìm URL
      return await getDownloadURL(res.ref)
        .then(url => url)
        .catch(er => false)
    })
  } else {
    // upload file lên fire storage
    url = await uploadBytes(fileRef, file).then(async res => {
      // khi up thành công thì tìm URL
      return await getDownloadURL(res.ref)
        .then(url => url)
        .catch(er => false)
    })
  }


  return url
}