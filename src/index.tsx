import * as React from "react";
import { useState, memo } from "react";
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { PDFDocument, OverflowWrap, Container, Toolbar } from "./styles";

import "react-pdf/dist/Page/AnnotationLayer.css";

type Props = {
  // Blob works only in Browser enviroment
  pdf: string | Blob | Uint8Array
};

function PDFViewer(props: Props) {
  let _pageContainer: HTMLDivElement | null = null;
  let _container: HTMLDivElement | null = null;

  const [_numPages, setNumPages] = useState(0);
  const [_scale, setScale] = useState(1.25);
  const [_width, setWidth] = useState(0);

  const { pdf } = props;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    if (numPages !== _numPages) {
      setNumPages(numPages);
    }
  };

  const onRenderSuccess = () => {
    let width = _container?.offsetWidth || 0;
    _pageContainer?.childNodes.forEach(element => {
      // @ts-ignore Doesnt work extend Node correctly https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts all Childs should have the same property like a Node
      const elWidth = element.offsetWidth;
      if (width < elWidth) {
        width = elWidth;
      }
    });

    if (width !== _width) {
      setWidth(width);
    }
  };

  return (
    <Container
      ref={(container: HTMLDivElement) => {
        _container = container;
      }}
    >
      {ToolbarBox({ scale: _scale, setScale })}
      <OverflowWrap>
        <PDFDocument width={_width}>
          <Document
            file={pdf}
            onLoadSuccess={onDocumentLoadSuccess}
            externalLinkTarget="_blank"
            inputRef={node => {
              _pageContainer = node;
            }}
          >
            {Array.from(new Array(_numPages), (_, index) => (
              <Page
                onRenderSuccess={onRenderSuccess}
                scale={_scale}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
        </PDFDocument>
      </OverflowWrap>
    </Container>
  );
}

const ToolbarBox = ({
  scale,
  setScale
}: {
  scale: number;
  setScale: (scale: number) => void;
}) => (
  <Toolbar>
    <button
      type="button"
      onClick={() => {
        setScale(scale - 0.25 <= 0 ? 0.1 : scale - 0.25);
      }}
    >
      -
    </button>
    <button
      type="button"
      onClick={() => {
        setScale(scale + 0.25);
      }}
    >
      +
    </button>
  </Toolbar>
);

export default memo(PDFViewer);
