import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './Upload.css';
import { connect } from 'react-redux';
import { uploadFile, uploadFolder } from '../../actions/upload';
import { setAlert } from '../../actions/alert';
import UploadSuccess from '../UploadSuccess/UploadSuccess';
import UploadType from './uploadType';
import JSZip from 'jszip';

const Upload = ({ uploadFile, uploadFolder, setAlert, user }) => {
  const [formData, setFormData] = useState({
    file: '',
    show: false,
    loader: true,
    fileType: ''
  });
  const { file, show } = formData;
  if (!user) {
    user = '';
  }
  let { email } = user;
  const upload = fileType => {
    if (file === '' || file === undefined || file === null) {
      setAlert('Please select a file/folder to upload', 'danger');
      setFormData({ show: false });
      return null;
    }

    // Convert Uploaded Files to Array
    const uploadedFile = Object.values(file);

    // upload file
    if (fileType === 'file') {
      setFormData({ show: true });
      uploadFile(uploadedFile, email);
      const sizes = uploadedFile.map(file => {
        return file.size;
      });
      const totalSize = sizes.reduce((a, b) => a + b, 0);
      if (totalSize > 2147483648) {
        window.location.replace('http://xshare.ga/register');
        setAlert(
          'You have to be registered to send files larger than 2GB',
          'danger'
        );
        // return <Redirect to='/register' />;
      } else if (totalSize === 0) {
        setAlert('Please select a file/folder to upload', 'danger');
        setFormData({ show: false });
        window.location.replace('http://xshare.ga');
      }

      return null;
    }

    // Upload Folder
    if (fileType === 'folder') {
      const zip = new JSZip();
      let img;

      if (Object.keys(uploadedFile).length !== 0) {
        // Check if input field
        var sizesss = uploadedFile.map(i => {
          // img.file(i.name, i, { base64: true });
          return i.size;
        });
        const totalSizes = sizesss.reduce((a, b) => a + b, 0);
        if (totalSizes > 2147483648) {
          window.location.replace('http://xshare.ga/register');
          setAlert(
            'You have to be registered to send files larger than 2GB',
            'danger'
          );
        } else if (uploadedFile[0].webkitRelativePath !== '') {
          const folderName = uploadedFile[0].webkitRelativePath.split('/');
          img = zip.folder(folderName[0]);
        } else {
          // checks if drag and drop
          const folderName = uploadedFile[0].path.split('/');
          img = zip.folder(folderName[1]);
        }
        uploadedFile.map(i => {
          return(
          img.file(i.name, i, { base64: true }))
        });

        zip.generateAsync({ type: 'blob' }).then(content => {
          const folderArray = uploadedFile[0].webkitRelativePath.split('/');
          let folderName = folderArray[0];
          uploadFolder([content], email, folderName);
        });

        setFormData({ show: true });
      }

      return null;
    }
  };
  const onChange = e => {
    let files = e.target.files;

    // checking if the files is an array
    if (!Array.isArray(e.target.files)) {
      files = Object.values(e.target.files);
    }
    const newData = [...file];
    newData.push(...files);
    setFormData({
      file: newData,
      fileType: e.target.files
    });
  };

  // Remove File
  const removeFile = (event, id, fileName) => {
    const newFiles = file.filter(f => f.name !== fileName);
    setFormData({
      file: newFiles
    });
  };

  const goBackToUpload = () => {
    setFormData({ show: false });
  };

  const onDrop = useCallback(File => {
    setFormData({
      file: File,
      fileType: File
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <main
      style={{ marginTop: '70px' }}
      className='wrapper home-section d-flex justify-content-between align-items-center'>
      <div className='left-section'>
        <h1 className='left-section-title'>
          The most seamless
          <br />
          file transfer experience
        </h1>
        <h4 className='left-section-content'>
          Fast, Safe and Secure.... <br />
          Simply upload a file and share it via email or a generated link{' '}
        </h4>
        <img
          className='left-section-image'
          rel='preconnect'
          src='https://res.cloudinary.com/cavdy/image/upload/v1573077364/Webp.net-resizeimage_c04t3c.webp'
          alt=''
        />
      </div>
      <div className='right-section d-flex justify-content-center align-items-center'>
        {!show ? (
          <UploadType
            upload={upload}
            onChange={onChange}
            file={file}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            getRootProps={getRootProps}
            removeFile={removeFile}
          />
        ) : (
          <UploadSuccess
            upload={upload}
            file={file}
            goBackToUpload={goBackToUpload}
          />
        )}
      </div>
    </main>
  );
};

const mapStateToProps = state => ({
  uploadstate: state.upload,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { uploadFile, setAlert, uploadFolder }
)(Upload);
