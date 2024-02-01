import { expose } from 'comlink';
import './workerShim';
let log = console.info;

const renderPDFInWorker = async (props) => {
  try {
    const { renderPDF } = await import('../Components/pdf/renderPDF');
    return URL.createObjectURL(await renderPDF(props));
  } catch (error) {
    log(error);
    throw error;
  }
};

const onProgress = (cb) => (log = cb);

expose({ renderPDFInWorker, onProgress });