import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { pdfjs, Document } from "react-pdf";
import { PDFDocument } from 'pdf-lib'
import Swal from 'sweetalert2'

import './FileInput.css';

import { ImageConfig } from '../../config/ImageConfig'; 
import uploadImg from '../../assets/cloud_upload_icon.svg';

const hashList = ['ChaveHash9j214hcs9345', 'd[=7mYp!Tw5)d,KM']

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [currentFile, setCurrentFile] = useState(null);
    const [blockchainMetadata, setBlockchainMetadata] = useState()
    const [metadata, setMetadata] = useState();

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile.type.split('/')[1] === 'pdf'){
            if (newFile) {
                setCurrentFile(newFile);
                props.onFileChange(newFile);
            }
        }else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Incompatible file type'
              })
        }
    }

    async function onLoadSuccess(pdf) {
        setMetadata(await pdf.getMetadata());
        const existingPdfBytes = await fetch('PDF-file-demonstration.pdf').then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
          updateMetadata: false 
        })
        setBlockchainMetadata(pdfDoc.getTitle())
      }
    
    async function uploadingFile() {
        // {metadata.info.Title ? blockchainMetadata === JSON.stringify(metadata.info.Title).replace(/^"(.*)"$/, '$1') ? console.log('accept') : console.log('denied') : console.log('denied')}
        {metadata.info.Title ? hashList.includes(JSON.stringify(metadata.info.Title).replace(/^"(.*)"$/, '$1')) ? (
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Valid document!'
              })
        ) : (
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid document!'
              })
        ) : (
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid document!'
              })
        )}

        // console.log(blockchainMetadata)
        // console.log(JSON.stringify(metadata.info.Title).replace(/^"(.*)"$/, '$1'))
        // pdfDoc.getTitle() === JSON.stringify(metadata.info.Title).replace(/^"(.*)"$/, '$1') ? console.log('accept') : console.log('denied')
    }

    return (
        <>
        {
            currentFile === null ? (
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
                    <input type="file" value="" onChange={onFileDrop}/>
                </div>
                ):(
                    <div className="drop-file-preview">
                        <p className="drop-file-preview__title">
                            Ready to upload
                        </p>
                      
                                <div  className="drop-file-preview__item">
                                    <img src={ImageConfig[currentFile.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                    <div className="drop-file-preview__item__info">
                                        <p>{currentFile.name}</p>
                                        <p>{currentFile.size}B</p>
                                    </div>
                                    <span className="drop-file-preview__item__del" onClick={() => setCurrentFile(null)}>x</span>
                                </div>
                                <div className='upload-button' onClick={uploadingFile}>Upload</div>
                            
                    </div>
                )
            }
            <Document file={currentFile} onLoadSuccess={onLoadSuccess}></Document>
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;