import React from 'react';
import FileViewer from 'react-file-viewer';

const ViewFile = ({ file, fileType, key, ...props }) => {
  const onError = (e) => {
    console.log(e, 'error in file-viewer');
  };
  return (
    <div key={key}>
      <FileViewer fileType={fileType} filePath={file} onError={onError} {...props} />
    </div>
  );
};

export default ViewFile;
