import styled from "styled-components";

export const Container = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(82, 86, 89);
`;

export const OverflowWrap = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export const Toolbar = styled.div`
  position: absolute;
  right: 20px;
  bottom: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column-reverse;

  button {
    background: white;
    color: black;
    width: 40px;
    height: 40px;
    border-radius: 25px;
    margin: 5px 0 0;
    box-shadow: 0px 1px 6px -2px black;
    outline: none;
    font-size: 21px;
    padding-bottom: 4px;
    user-select: none;
  }
`;

export const PDFDocument = styled.div<{ width?: number; container?: number }>`
  width: ${({ width, container }: { width?: number; container?: number }) => {
    if (width !== undefined && container !== undefined) {
      if (width < container) {
        return `calc(${width}px)`;
      } else {
        return `calc(${width}px + 3em)`;
      }
    }

    return "fit-content";
  }};

  && {
    .react-pdf {
      &__Document {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &__Page {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        margin: 10px 20px 0px 20px;

        canvas {
          height: auto !important;
        }
        &:last-child {
          margin-bottom: 20px;
        }
      }

      &__message {
        padding: 20px;
        color: white;
      }
    }
  }
`;
