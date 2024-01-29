import { expose } from 'comlink';
import './workerShim';
let log = console.info;

const renderPDFInWorker = async (props) => {
  try {
    const { renderPDF } = await import('../Components/pdf/renderPDF');
    const renderProps = await renderPDF(props);
    return URL.createObjectURL(renderProps);
  } catch (error) {
    log(error);
    throw error;
  }
};

const onProgress = (cb) => (log = cb);

expose({ renderPDFInWorker: renderPDFInWorker, onProgress });