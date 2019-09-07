import React, { Component } from "react"
// import { graphql } from "gatsby"
// import axios from "axios"
import * as faceapi from "face-api.js"
import Header from "../components/header"
class HeadCount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: "",
      numberOfPeople: null,
      isModuleLoaded: false,
      imageProcessingLoader: false,
      imageProcessingStage: "not_started",
      dataUri: "",
    }
  }

  componentDidMount() {
    Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ]).then(this.start)
  }

  start = () => {
    console.log("Successfully loaded all data from start")
    this.setState({
      isModuleLoaded: true,
    })
  }

  analyzeImage() {
    const input = document.getElementById("myImg")
    let fullFaceDescriptions = faceapi.detectAllFaces(input)
    console.log("input", input)
    console.log("fullFaceDescriptions", fullFaceDescriptions)
  }
  handleChange = event => {
    let tmpAddress = URL.createObjectURL(event.target.files[0])
    this.setState({
      imageUrl: tmpAddress,
      imageProcessingStage: "image_processing",
    })
    let that = this
    async function f() {
      const imageUpload = document.getElementById("imageUpload")
      console.log("imageUpload", imageUpload.files[0])
      const analysisImage = await faceapi.bufferToImage(imageUpload.files[0])
      console.log("analysisImage", analysisImage)
      const detections = await faceapi.detectAllFaces(analysisImage)
      console.log("Number of people in image " + detections.length)
      that.setState({
        numberOfPeople: detections.length,
        imageProcessingStage: "image_processing_complete",
      })
    }
    f()
  }

  render() {
    return (
      <div>
        {this.state.isModuleLoaded && (
          <div
            style={{
              margin: "0px",
              padding: "0px",
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1>Upload picture of students</h1>
            <div className="App"></div>
            <img src={this.state.imageUrl} heigth="200" width="400" />
            <input type="file" id="imageUpload" onChange={this.handleChange} />
            <br />
            {this.state.imageProcessingStage == "image_processing_complete" && (
              <h1> Number of people detected {this.state.numberOfPeople} </h1>
            )}
            {this.state.imageProcessingStage == "image_processing" && (
              <div>
                <h1> Processing the image... </h1>
              </div>
            )}
          </div>
        )}
        {!this.state.isModuleLoaded && (
          <img
            style={{
              margin: "0px",
              padding: "0px",
              display: "flex",
              height: "100vh",
              width: "100vw",

              justifyContent: "center",
              alignItems: "center",
            }}
            src="https://www.downgraf.com/wp-content/uploads/2019/05/Loader-animation-principle-freebie.gif"
          />
        )}
      </div>
    )
  }
}

export default HeadCount