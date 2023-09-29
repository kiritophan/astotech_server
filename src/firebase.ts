import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//congif firebase
const firebaseConfig = {
  apiKey: "AIzaSyBC1KAVcuX7kcqMcA567l7NCvKCS7gDsiM",
  authDomain: "astotech-87421.firebaseapp.com",
  projectId: "astotech-87421",
  storageBucket: "astotech-87421.appspot.com",
  messagingSenderId: "217948861505",
  appId: "1:217948861505:web:cb250eee3785a534b9c2c0",
  measurementId: "G-N93YR6X0LM"
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
    fileRef = ref(storage, `${folderName}/` + Math.random() * file.originalname);
  } else {
    // tên file trên file base
    fileRef = ref(storage, `${folderName}/` + `${Date.now() * Math.ceil(Math.random())}` + file.originalname);
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