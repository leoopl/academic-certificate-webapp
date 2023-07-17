import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from "react-pdf";
import Swal from 'sweetalert2';
import api from '../services/api';

import './FileInput.css';

import { ImageConfig } from '../config/ImageConfig'; 
import uploadImg from '../assets/cloud_upload_icon.svg';

const DropFileInput = (props) => {
	  const wrapperRef = useRef(null);

	  const [currentFile, setCurrentFile] = useState(null);
	  const [blockchainMetadata, setBlockchainMetadata] = useState(null);
	  const [metadata, setMetadata] = useState(null);

	  const onDragEnter = () => wrapperRef.current.classList.add('dragover');
	  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
	  const onDrop = () => wrapperRef.current.classList.remove('dragover');

	  const onFileDrop = (e) => {
		      const newFile = e.target.files[0];
		      if (newFile.type.split('/')[1] === 'pdf') {
			            setCurrentFile(newFile);
			            props.onFileChange(newFile);
			          } else {
					        Swal.fire({
							        icon: 'warning',
							        title: 'Oops...',
							        text: 'Incompatible file type'
							      });
					      }
		    };

	  const onLoadSuccess = async (pdf) => {
		      setMetadata(await pdf.getMetadata());
		    };
	    
	  const uploadingFile = async () => {
		      if (!metadata || !metadata.info || !metadata.info.Title) {
			            Swal.fire({
					            icon: 'error',
					            title: 'Oops...',
					            text: 'Invalid document!'
					          });
			            return;
			          }
		      
		      const docHash = JSON.stringify(metadata.info.Title).replace(/^"(.*)"$/, '$1');
		      try {
			            const response = await api.get(docHash, {
					            headers: {
							              'x-api-key': '64e83f04-9bb6-4085-b34c-828ab2b5a769'
							            }
					          });
			            setBlockchainMetadata(response.data);
			            if (blockchainMetadata?.CertificateHash === docHash) {
					            Swal.fire({
							              grow: 'fullscreen',
							              icon: 'success',
							              title: 'Success',
							              text: 'Valid document!'
							            });
					          } else {
							          Swal.fire({
									            icon: 'error',
									            title: 'Oops...',
									            text: 'Invalid document!'
									          });
							        }
			          } catch (err) {
					        console.error("Oops! An error occurred", err);
					      }
		    };

	  useEffect(() => {
		      if (metadata?.info?.Title) {
			            const docHash = JSON.stringify(metadata.info.Title).replace(/^"(.*)"$/, '$1');
			            api.get(docHash, {
					            headers: {
							              'x-api-key': '64e83f04-9bb6-4085-b34c-828ab2b5a769'
							            }
					          })
			            .then((response) => {
					            setBlockchainMetadata(response.data);
					          })
			            .catch((err) => {
					            console.error("Oops! An error occurred", err);
					          });
			          }
		    }, [metadata]);

	  return (
		      <>
		        {currentFile === null ? (
				        <div
				          ref={wrapperRef}
				          className="drop-file-input"
				          onDragEnter={onDragEnter}
				          onDragLeave={onDragLeave}
				          onDrop={onDrop}
				        >
				          <div className="drop-file-input__label">
				            <img src={uploadImg} alt="" />
				            <p>Drag & Drop your file here</p>
				          </div>
				          <input type="file" value="" onChange={onFileDrop} />
				        </div>
				      ) : (
					              <div className="drop-file-preview">
					                <p className="drop-file-preview__title">
					                  Ready to upload
					                </p>
					                <div className="drop-file-preview__item">
					                  <img src={ImageConfig[currentFile.type.split('/')[1]] || ImageConfig['default']} alt="" />
					                  <div className="drop-file-preview__item__info">
					                    <p>{currentFile.name}</p>
					                    <p>{currentFile.size}B</p>
					                  </div>
					                  <span className="drop-file-preview__item__del" onClick={() => setCurrentFile(null)}>x</span>
					                </div>
					                <div className='upload-button' onClick={uploadingFile}>Upload</div>
					              </div>
					            )}
		        <Document file={currentFile} onLoadSuccess={onLoadSuccess}>
		          <Page pageNumber={1} />
		        </Document>
		      </>
		    );
};

DropFileInput.propTypes = {
	  onFileChange: PropTypes.func
};

export default DropFileInput;

