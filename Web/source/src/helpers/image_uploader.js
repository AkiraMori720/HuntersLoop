import React, { Component } from "react";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
 
class ImageUploader extends Component {
  state = {
    files: []
  };
  
  handleUploadStart = file => {
    // console.log('file', file)
  }
  handleUploadError = error => {    
    console.log('upload error', error);
  };
  handleUploadSuccess = filename => {    
    firebase
      .storage()
      .ref(this.props.folder)
      .child(filename)
      .getDownloadURL()
      .then(url => {this.props.setImageUrl(url); console.log(url)});
  };

  render() {
    return (
      <div>
        <form>                    
          {/* {this.state.isUploading && <p>Progress: {this.state.progress}</p>} */}          
          <FileUploader            
            accept="image/*"
            name={this.props.filename}
            randomizeFilename
            storageRef={firebase.storage().ref(this.props.folder)}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
        </form>
      </div>
    );
  }
}
 
export default ImageUploader;