import './App.css';

import FileInput from './components/FileInput';

function App() {

    const onFileChange = (files) => {
        console.log(files);
    }


    return (
        <div className="box">
            <h2 className="header">
                Certificate validation:
            </h2>
            <FileInput
                onFileChange={(files) => onFileChange(files)}
            />
        </div>
    );
}

export default App;