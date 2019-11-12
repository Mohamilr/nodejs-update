import React, { useState } from 'react';
import uuid from 'uuid/v4';
import './UploadSuccess.css';
import { connect } from 'react-redux';
import { sendEmail } from '../../actions/upload';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { setAlert } from '../../actions/alert';
import { CircularProgressbar } from 'react-circular-progressbar';
import { cancelUploadRequest } from '../../actions/upload';
import 'react-circular-progressbar/dist/styles.css';
const UploadSuccess = ({
  sendEmail,
  uploadstate,
  progressBar,
  setAlert,
  goBackToUpload
}) => {
  const [formData, setFormData] = useState({
    name: '',
    to: '',
    message: '',
    loading: !1,
    show: !1,
    share: !1,
    shortenUrl: ''
  });
  const { name, message, to, show, loading, share, shortenUrl } = formData;
  const email = shortUrl => {
    setFormData({ show: !0, shortenUrl: shortUrl });
  };
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onFormSubmit = (e, shortUrl) => {
    e.preventDefault();
    setFormData({ loading: !0, show: !0, name: '', to: '', message: '' });
    sendEmail(name, to, message, shortUrl);
    setTimeout(() => {
      setAlert(`The file was sent to ${to} successfully`, 'success');
      setFormData({ loading: !1, show: !0 });
      window.location.reload();
    }, 3000);
  };
  const showUploads = () => {
    setFormData({ show: !1 });
  };
  const shareUrl = event => {
    setFormData({ share: !0 });
  };
  const { uploadstate: uploadData } = uploadstate;
  const clipText =
    ' Please visit http://xshare.ga to share your files with ease';
  return (
    <>
      {!show ? (
        <div className='right-section-content d-flex flex-column justify-content-center align-items-center'>
          {uploadData.success ? (
            <>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <img
                  src='https://res.cloudinary.com/busola/image/upload/v1573039273/Webp.net-resizeimage_2.png'
                  alt=''
                  className='upload-success-img mr-3'
                />
                <p className='upload-success'>Upload Success</p>
              </div>
              <div className='short-links'>
                {uploadData.data.map(short => {
                  return (
                    <div
                      className=' d-flex align-items-center short-link'
                      key={uuid()}>
                      <div
                        className=' showhim mt-2 d-flex align-items-center upload-link mr-3'
                        id='upload-link'>
                        <div className='showme'>
                          <div className='showme-items'>
                            <p>{short.fileName}</p>
                            <p>{short.size}</p>
                          </div>
                        </div>
                        <h5 className='short-link-url'>{short.shortUrl}</h5>
                      </div>
                      <div className='d-flex align-items-center'>
                        {!share ? (
                          <>
                            <CopyToClipboard
                              text={short.shortUrl}
                              onCopy={() => {
                                setFormData({ copied: !0 });
                                short.shortUrl === null
                                  ? setAlert('Clipboard is empty', 'danger')
                                  : setAlert('Link Copied', 'success');
                              }}>
                              <div className='mr-3 d-flex align-items-center upload-success-copy'>
                                <img
                                  src='https://res.cloudinary.com/cavdy/image/upload/v1572343978/content_copy_24px_1_wuelex.png'
                                  alt=''
                                  className='mr-1'
                                />
                                Copy
                              </div>
                            </CopyToClipboard>
                            <div
                              className='d-flex align-items-center upload-success-share'
                              onClick={shareUrl}>
                              <img
                                src='https://res.cloudinary.com/cavdy/image/upload/v1572343978/XMLID_4_czlhcl.png'
                                alt=''
                                className='mr-2'
                              />
                              Share
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              onClick={() => {
                                setFormData({ share: !1 });
                              }}
                              className='mr-3 align-items-center'>
                              <i className='fas fa-chevron-left'></i>
                            </div>
                            <div
                              className='mr-3 d-flex align-items-center upload-success-copy'
                              onClick={() => {
                                email(short.shortUrl);
                              }}>
                              <img
                                src='https://res.cloudinary.com/cavdy/image/upload/v1572343978/mail_outline_24px_1_tq5nxb.png'
                                alt=''
                                className='mr-1'
                              />
                              Email
                            </div>
                            <div className='social-icons d-flex justify-content-center align-items-center'>
                              <a
                                className='socials'
                                href={`https://api.whatsapp.com/send?&text=${short.shortUrl} ${clipText}`}
                                target='_blank'
                                rel='noopener noreferrer'>
                                <img
                                  className='social-icon mr-3'
                                  src='https://res.cloudinary.com/busola/image/upload/v1573039450/Webp.net-resizeimage_5.png'
                                  alt=''
                                />
                              </a>
                              <a
                                className='socials'
                                href={`https://twitter.com/intent/tweet?text=${short.shortUrl} ${clipText}`}
                                data-size='large'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <img
                                  className='social-icon mr-3'
                                  src='https://res.cloudinary.com/busola/image/upload/v1573039442/Webp.net-resizeimage_4.png'
                                  alt=''
                                />
                              </a>
                              <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href={`https://www.facebook.com/sharer/sharer.php?u=${short.shortUrl}&amp;src=sdkpreparse`}
                                className='socials'>
                                <img
                                  className='social-icon'
                                  src='https://res.cloudinary.com/busola/image/upload/v1573039378/Webp.net-resizeimage_3.png'
                                  alt=''
                                />
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <p
                  className='upload-another'
                  onClick={() => {
                    window.location.reload();
                    return goBackToUpload;
                  }}>
                  <i className='fas fa-chevron-left'></i>{' '}Go Back
                </p>
              </div>
            </>
          ) : (
            <div className='d-flex justify-content-center align-items-center flex-column ml-2 mr-2'>
              <div style={{ width: '120px' }}>
                <CircularProgressbar
                  value={progressBar.progress || 0}
                  text={`${progressBar.progress || 0}%`}
                />
              </div>
              {}
              <div
                className='left-section-content mt-3'
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => {
                  window.location.reload();
                  setAlert('Upload cancelled', 'danger');
                  goBackToUpload();
                  cancelUploadRequest();
                }}>
                Cancel
              </div>
              {}
              <div
                className='left-section-content mt-3'
                style={{ textAlign: 'center' }}>
                <p>Please be patient while your file gets uploaded...</p>
                <p className='mt-2'>
                  Kindly note that larger files
                  <br />
                  will take longer to be completed
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='right-section-success d-flex flex-column justify-content-center'>
          <div className='d-flex align-items-center justify-content-between mail-top-content'>
            <h3 className='email-title'>Email Link</h3>
            <i className='fas fa-chevron-left' onClick={showUploads}></i>
          </div>
          <form onSubmit={e => onFormSubmit(e, shortenUrl)}>
            <input
              type='text'
              className='form-input'
              placeholder='Your Name'
              id='name'
              name='name'
              value={name}
              required
              onChange={e => onChange(e)}
            />
            <input
              type='email'
              className='form-input'
              name='to'
              value={to}
              required
              onChange={e => onChange(e)}
              placeholder="Receiver's email"
            />
            <textarea
              onChange={e => onChange(e)}
              name='message'
              id='message'
              value={message}
              required
              cols='30'
              rows='10'
              className='form-textarea'
              placeholder='Message'
            />
            {loading ? (
              <button
                className='upload-btn btn-secondary mt-4'
                type='button'
                disabled>
                <span
                  className='mr-2 spinner-grow spinner-grow-sm'
                  role='status'
                  aria-hidden='true'></span>
              </button>
            ) : (
              <button className='upload-btn mt-4'>Send</button>
            )}
          </form>
        </div>
      )}
    </>
  );
};
const mapStateToProps = state => ({
  uploadstate: state.upload,
  progressBar: state.progress
});
export default connect(
  mapStateToProps,
  { sendEmail, setAlert }
)(UploadSuccess);
