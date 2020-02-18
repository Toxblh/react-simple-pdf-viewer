import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import PDFViewer from '../index'

const pdfData = Uint8Array.from(
  atob(
    'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
      'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
      'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
      'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
      'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
      'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
      'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
      'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
      'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
      'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
      'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
      'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
      'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
  ),
  c => c.charCodeAt(0),
)

describe('PDF-viewer', () => {
  beforeAll(async () => {
    // @ts-ignore
    const pdfjs = await import('pdfjs-dist/build/pdf')
    // @ts-ignore
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')

    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

    // Will be a lot of notifiactions from library
    jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())
  })

  it('Correct file', () => {
    const { getByText } = render(<PDFViewer pdf={pdfData} />)
    const findText = getByText(/Loading PDF…/i)
    expect(findText).toBeInTheDocument()
  })

  it('Wrong file', () => {
    try {
      render(<PDFViewer pdf="<html>PDF FILE</html>" />)
    } catch (e) {
      expect(e).toEqual('InvalidPDFException')
    }
  })
})
