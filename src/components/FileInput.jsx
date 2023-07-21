import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
// import { pdfjs, Document } from "react-pdf";
import Swal from 'sweetalert2'
import api from '../services/api'

import './FileInput.css';

import { ImageConfig } from '../config/ImageConfig'; 
import uploadImg from '../assets/cloud_upload_icon.svg';


//PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.js',
//     import.meta.url,
//   ).toString();

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [currentFile, setCurrentFile] = useState(null);
    // const [metadata, setMetadata] = useState();

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

    //Set the pdf metadata when laod
    // async function onLoadSuccess(pdf) {
    //     setMetadata(await pdf.getMetadata());
    // }
    
    //Upload the file in the API, receive the response, and print the metadata with a popup
    async function uploadingFile() {
        const formData = new FormData();
        formData.append('pdfFile', currentFile);

        api.post(formData, {headers: 
            {
                'x-api-key': '64e83f04-9bb6-4085-b34c-828ab2b5a769',
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response)
            Swal.fire({
                grow: 'fullscreen',
                html: 
                '<div >' +
                `<h2>Escola:</h2> <p>${response.data.InstitutionName}</p>` + 
                `<h2>Curso:</h2> <p>${response.data.CourseName}</p>` +
                `<h2>Nome do Aluno:</h2> <p>${response.data.StudentName}</p>` +
                `<h2>ID do Aluno:</h2> <p>${response.data.StudentId}</p>` +
                `<h2>CPF do Aluno:</h2> <p>${response.data.StudentCPF}</p>` +
                `<h2>Data de Conclusão:</h2> <p>${response.data.CourseCompletionDate}</p>` +
                `<h2>Horas de Curso:</h2> <p>${response.data.CourseHours}</p>` +
                `<h2>HASH do Certificado:</h2> <p>${response.data.CertificateHash}</p>` +
                '</div>'
                ,
                icon: 'success',
                title: 'Certificate validated successfully'
            })
        }).catch((err) => {
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid document!'
            })
        })
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
            {/* <Document file={currentFile} onLoadSuccess={onLoadSuccess}></Document> */}
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
