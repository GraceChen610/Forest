/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import './tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import { useEffect, useState, useRef } from 'react';
import {
  getStorage, ref, getDownloadURL, uploadString,
} from 'firebase/storage';
import styled from 'styled-components';
import firebaseStores from '../firebase';
import baseImg from './base.png';

const UploadBtn = styled.button`
    background-color: #fdba3b;
    border: 1px solid #fdba3b;
    color: #000;
    font-family: 'Noto Sans', sans-serif;
    font-size: 12px;
    display: inline-block;
    position: absolute;
    top: 10px;
    left: 130px;
    width: 120px;
    height: 40px;
    padding: 0;
    line-height: 40px;
    outline: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    vertical-align: middle;
    letter-spacing: .3px;
    text-align: center;
`;

const EditBtn = styled(UploadBtn)`
    background-color: #fff;
    border: 1px solid #ddd;
    color: #222;
    left: 2px;
`;
export default function Canvas() {
  const userID = 'THwS7xjxkLtR5N7t8CRA';
  const editorRef = useRef();
  //   const [myImgUrl, setMyImgUrl] = useState();
  const [historyImg, setHistoryImg] = useState();
  console.log('存入到Cloud Firestore');

  function removeLogo() {
    const logoImg = document.querySelector('.tui-image-editor-header-logo > img');
    logoImg?.remove();
  }

  useEffect(() => {
    removeLogo();
  }, []);

  // >>>>>>> 尚未重寫邏輯
  // 編輯器抓圖 > storge > 拿storge的URL > 存入Cloud Firestore

  const handleSubmit = (e) => {
    e.preventDefault();

    // 抓編輯器的圖URL
    const editorInstance = editorRef.current.getInstance();
    const dataURL = editorInstance.toDataURL();

    // 暫存入Cloud >>>>後續要刪除這段
    firebaseStores.updateDoc(userID, { pic: dataURL });

    // 存圖到storage
    const storage = getStorage();
    const storageRef = ref(storage, 'files');

    // eslint-disable-next-line no-unused-vars
    uploadString(storageRef, dataURL, 'data_url').then((snapshot) => {
      console.log('Uploaded a data_url string!');
    });

    // 隱藏編輯器
    const imgEdit = document.querySelector('.tui-image-editor-container');
    imgEdit.style.display = 'none'; // inherit
  };

  const getImgUrl = () => {
    // 從Cloud 拿歷史圖的網址，顯示出來
    firebaseStores.getOneDoc('users', userID)
      .then((res) => setHistoryImg(res.data().pic))
      .catch((e) => console.log(e));

    // 顯示編輯器
    const imgEdit = document.querySelector('.tui-image-editor-container');
    imgEdit.style.display = 'inherit';

    //  從資料庫讀圖 >>>>> "來源網址"要再改成對應的url
    const storage = getStorage();
    getDownloadURL(ref(storage, 'gs://forest-406b4.appspot.com/files'))
      .then((url) => {
        // `url` is the download URL for 'images/name.jpg'
        setHistoryImg(url);
        // 把圖放入編輯器
        const editorInstance = editorRef.current.getInstance();
        editorInstance.loadImageFromURL(`https://cors-anywhere.herokuapp.com/${url}`, 'historyImg')
          .then((result) => { console.log(result); })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      });

    // 正確流程 >>>> 把storage的圖片url再存入firebase
    // firebaseStores.updateDoc(userID, { pic: '圖的url' });
  };

  return (
    <div>
      <ImageEditor
        includeUI={{
          loadImage: {
            path: baseImg,
            name: 'SampleImage',
          },
          menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
          initMenu: 'text',
          uiSize: {
            width: '1000px',
            height: '700px',
          },
          menuBarPosition: 'bottom',
        }}
        cssMaxHeight={500}
        cssMaxWidth={700}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        loadImage={{
          path: 'URL',
          name: 'SampleImage',
        }}
        usageStatistics
        ref={editorRef}
      />
      <div>
        <EditBtn type="button" onClick={getImgUrl}> Edit</EditBtn>
        <UploadBtn type="submit" onClick={handleSubmit}>Upload</UploadBtn>
      </div>
      {
        historyImg
        && <img src={historyImg} alt="myImg" height={200} />
      }
    </div>
  );
}
