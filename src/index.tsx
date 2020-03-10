// import * as React from "react";
// import { useState, memo } from "react";

import React, { Component, Fragment } from "react";
import pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { AnnotationLayerBuilder } from "pdfjs-dist/lib/web/annotation_layer_builder";
import { PDFLinkService } from "pdfjs-dist/lib/web/pdf_link_service";
import NullL10n from "pdfjs-dist/lib/web/ui_utils.js";
import throttle from "lodash/throttle";
import { Props, State, pageType, SourceType } from "./types";
import {
  Wrap,
  Canvas,
  Document,
  TextAndAnnotationLayer,
  Controls,
  Previous,
  Next,
  Pages,
  Root,
  LeftRightControls
} from "./styles";
// import "./pdfViewer.sass";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const MAX_RELOAD_COUNT_ON_ERROR = 2;

class PdfViewer extends Component<Props, State> {
  state = {
    pdf: null,
    testFileContent: null,
    pagesCount: 0,
    currentPageNumber: 1,
    onCatchErrorReloadedCount: 0,
    switchPageBlocked: false,
    scale: 1,
    isPdfLoaded: false,
    isShowError: false,
    pdfLoadingError: false
  };

  isPageRendering = false;

  private wrap = React.createRef<HTMLDivElement>();
  private document = React.createRef<HTMLDivElement>();
  private canvas = React.createRef<HTMLCanvasElement>();
  private textAndAnnotationLayer = React.createRef<HTMLDivElement>();
  throttledChangeDocumentSize: () => void = () => {};

  componentDidMount() {
    this.fetchPdf(this.props.src)
      .then(() => this.pageRendering())
      .catch(() => this.setState({ pdfLoadingError: true }));

    this.throttledChangeDocumentSize = throttle(this.pageRendering, 100);
    window.addEventListener("resize", this.throttledChangeDocumentSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.throttledChangeDocumentSize);
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.src !== this.props.src) {
      this.setState({
        isShowError: false,
        pdfLoadingError: false,
        pdf: null,
        testFileContent: null,
        currentPageNumber: 1,
        pagesCount: 0
      });

      this.fetchPdf(nextProps.src)
        .then(() => this.pageRendering())
        .catch(() => this.setState({ pdfLoadingError: true }));
    }
  }

  componentDidCatch() {
    const { onCatchErrorReloadedCount } = this.state;

    if (onCatchErrorReloadedCount < MAX_RELOAD_COUNT_ON_ERROR) {
      this.setState({
        onCatchErrorReloadedCount: onCatchErrorReloadedCount + 1
      });
    } else {
      this.setState({ isShowError: true });
    }
  }

  private fetchPdf = async (src: SourceType) => {
    const loadingTask = pdfjs.getDocument(src);
    const pdf = await loadingTask.promise;
    this.setState({ pdf, isPdfLoaded: true, pagesCount: pdf.numPages });
  };

  private pageRendering = async () => {
    if (this.isPageRendering) return;
    this.setState({ switchPageBlocked: true });
    this.isPageRendering = true;

    const {
      state: { currentPageNumber, pdf }
    } = this;

    if (!pdf) return;
    // @ts-ignore
    const page: pageType = await pdf!.getPage(currentPageNumber);

    const scale = this.getScaleForCurrentWidth(page);
    const viewport = await page.getViewport({ scale });
    // @ts-ignore
    this.canvas.current.height = viewport.height;
    // @ts-ignore
    this.canvas.current.width = viewport.width;
    // @ts-ignore
    const context = this.canvas.current.getContext("2d");
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    // @ts-ignore
    const renderTask = page.render(renderContext);
    await renderTask.promise;

    const textContent = await page.getTextContent();
    this.textAndAnnotationLayer?.current!.innerHTML = "";

    pdfjs.renderTextLayer({
      textContent: textContent,
      container: this.textAndAnnotationLayer.current,
      viewport: viewport,
      textDivs: []
    });

    const linkService = await new PDFLinkService({
      externalLinkTarget: pdfjs.LinkTarget.BLANK
    });

    const annotation = new AnnotationLayerBuilder({
      pageDiv: this.textAndAnnotationLayer.current,
      linkService: linkService,
      pdfPage: page,
      l10n: NullL10n
    });

    annotation.render(viewport);

    this.setState({ switchPageBlocked: false });
    this.isPageRendering = false;
  };

  private getScaleForCurrentWidth(page: { getViewport: ({ scale }: { scale: number}) => { width: number }}) {
    const viewport = page.getViewport({ scale: this.state.scale });
    let newScale = this.state.scale;

    if (this.wrap?.current?.clientWidth === viewport.width) return newScale;

    this.setState({ scale: newScale });
    return newScale;
  }

  private switchPageHandler = (next = false) => {
    const { currentPageNumber, pagesCount, switchPageBlocked } = this.state;

    if (switchPageBlocked) return;

    let newPageNumber = next ? currentPageNumber + 1 : currentPageNumber - 1;
    if (newPageNumber < 1) newPageNumber = 1;
    if (newPageNumber > pagesCount) newPageNumber = pagesCount;

    this.setState(
      {
        currentPageNumber: newPageNumber,
        switchPageBlocked: currentPageNumber !== newPageNumber
      },
      () => this.pageRendering()
    );
  };

  render() {
    const {
      isShowError,
      isPdfLoaded,
      pdfLoadingError,
      switchPageBlocked,
      pagesCount,
      currentPageNumber
    } = this.state;

    if (isShowError) {
      return <div className="root">Failed to load PDF file</div>;
    }

    if (pdfLoadingError) {
      return <div className="root">Can't load pdf file</div>;
    }

    return (
      <Root>
        {isPdfLoaded ? (
          <Wrap ref={this.wrap}>
            <Document ref={this.document}>
              <Canvas ref={this.canvas} />
              <TextAndAnnotationLayer ref={this.textAndAnnotationLayer} />

              <Controls>
                <LeftRightControls>
                  {pagesCount > 1 && (
                    <Fragment>
                      <Previous
                        onClick={() =>
                          !switchPageBlocked ? this.switchPageHandler() : null
                        }
                      />

                      <Next
                        onClick={() =>
                          !switchPageBlocked
                            ? this.switchPageHandler(true)
                            : null
                        }
                      />
                    </Fragment>
                  )}
                  <Pages>
                    Page {currentPageNumber} of {pagesCount}
                  </Pages>
                </LeftRightControls>

                <LeftRightControls>
                  <a className="download" download />
                </LeftRightControls>
              </Controls>
            </Document>
          </Wrap>
        ) : (
          <div></div>
        )}
      </Root>
    );
  }
}

export default PdfViewer;

// type Props = {
//   // Blob works only in Browser enviroment
//   pdf: string | Blob | Uint8Array;
// };

// function PDFViewer(props: Props) {
//   let _pageContainer: HTMLDivElement | null = null;
//   let _container: HTMLDivElement | null = null;

//   const [_numPages, setNumPages] = useState(0);
//   const [_scale, setScale] = useState(1.25);
//   const [_width, setWidth] = useState(0);

//   const { pdf } = props;

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     if (numPages !== _numPages) {
//       setNumPages(numPages);
//     }
//   };

//   const onRenderSuccess = () => {
//     let width = _container?.offsetWidth || 0;
//     _pageContainer?.childNodes.forEach(element => {
//       // @ts-ignore Doesnt work extend Node correctly https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts all Childs should have the same property like a Node
//       const elWidth = element.offsetWidth;
//       if (width < elWidth) {
//         width = elWidth;
//       }
//     });

//     if (width !== _width) {
//       setWidth(width);
//     }
//   };

//   return (
//     <Container
//       ref={(container: HTMLDivElement) => {
//         _container = container;
//       }}
//     >
//       {ToolbarBox({ scale: _scale, setScale })}
//       <OverflowWrap>
//         <PDFDocument width={_width}>
//           <Document
//             file={pdf}
//             onLoadSuccess={onDocumentLoadSuccess}
//             externalLinkTarget="_blank"
//             inputRef={(node: any) => {
//               _pageContainer = node;
//             }}
//           >
//             {Array.from(new Array(_numPages), (_, index) => (
//               <Page
//                 onRenderSuccess={onRenderSuccess}
//                 scale={_scale}
//                 key={`page_${index + 1}`}
//                 pageNumber={index + 1}
//               />
//             ))}
//           </Document>
//         </PDFDocument>
//       </OverflowWrap>
//     </Container>
//   );
// }

// const ToolbarBox = ({
//   scale,
//   setScale
// }: {
//   scale: number;
//   setScale: (scale: number) => void;
// }) => (
//   <Toolbar>
//     <button
//       type="button"
//       onClick={() => {
//         setScale(scale - 0.25 <= 0 ? 0.1 : scale - 0.25);
//       }}
//     >
//       -
//     </button>
//     <button
//       type="button"
//       onClick={() => {
//         setScale(scale + 0.25);
//       }}
//     >
//       +
//     </button>
//   </Toolbar>
// );

// export default memo(PDFViewer);
