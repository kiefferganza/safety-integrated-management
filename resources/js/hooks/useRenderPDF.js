import { useEffect } from "react";
import { useAsync } from "react-use";
import { wrap } from "comlink";
import WorkerURL from "../worker/pdf.worker?worker&url";

const js = `import ${JSON.stringify(new URL(WorkerURL, import.meta.url))}`;
const blob = new Blob([js], { type: "application/javascript" });

function WorkaroundWorker() {
    const objURL = URL.createObjectURL(blob);
    const worker = new Worker(objURL, { type: "module" });
    worker.addEventListener("error", (e) => {
        URL.revokeObjectURL(objURL);
    });
    return worker;
}

const pdfWorker = wrap(WorkaroundWorker());
// import Worker from "../worker/pdf.worker?worker";
// const pdfWorker = wrap(new Worker());
// pdfWorker.onProgress(proxy((info) => console.log(info)));

export const useRenderPDF = (props, deps = []) => {
    const {
        value: url,
        loading,
        error,
    } = useAsync(async () => {
        return pdfWorker.renderPDFInWorker(props);
    }, deps);

    useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url]);
    return { url, loading, error };
};
