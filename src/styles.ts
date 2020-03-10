import styled from "styled-components";

export const Header = styled.div`
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: normal;
`;

export const Root = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrap = styled.div`
  width: 900px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;

  &:fullscreen {
    display: flex;
  }

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const Canvas = styled.canvas`
  display: block;
`;

export const TextAndAnnotationLayer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  line-height: 1;
  border: 1px solid #ececec;

  & section {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }

  & section > a {
    display: block;
    width: 100%;
    height: 100%;
  }

  & > span {
    color: transparent;
    pointer-events: all;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }
`;

export const Document = styled.div`
  position: relative;

  &:hover {
    .controls {
      opacity: 1;
    }
  }

  &:fullscreen {
    border: none;

    &:hover {
      .controls {
        opacity: 0;
      }
    }

    .controls {
      &:hover {
        opacity: 1 !important;
      }
    }

    &.vertical {
      .page {
        height: 100%;
        overflow-x: auto;

        canvas {
          margin: 0 auto;
        }
      }
    }

    &.horizontal {
      .page {
        height: 100%;
        overflow-y: auto;
        display: flex;
        align-items: center;
      }
    }
  }
`;

export const Controls = styled.div`
  height: 42px;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const LeftRightControls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

export const Previous = styled.div`
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row nowrap;
  cursor: pointer;
  margin-left: 10px;

  &::before {
    content: "";
    background-image: url("./images/arrow.svg");
    width: 8px;
    height: 13px;
  }
`;

export const Next = styled.div`
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row nowrap;
  cursor: pointer;
  transform: rotate(180deg);
  margin-left: 8px;

  &::before {
    content: "";
    background-image: url("./images/arrow.svg");
    width: 8px;
    height: 13px;
  }
`;

export const Pages = styled.div`
  margin-left: 20px;
  color: #fff;
  font-size: 14px;
`;
