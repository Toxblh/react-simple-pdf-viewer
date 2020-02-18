import React, { Component } from "react";
import PDFViewer from "react-simple-pdf-viewer";
import styled from "styled-components";

const SomeSmallBox = styled.div`
  display: block;
  position: absolute;
  top: 100px;
  left: 250px;
  width: 500px;
  height: 600px;
  border: 1px solid red;
`;

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <p>PDF Viewer</p>

        <SomeSmallBox>
          <PDFViewer url="sample.pdf" />
        </SomeSmallBox>
      </div>
    );
  }
}
