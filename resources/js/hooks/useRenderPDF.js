import { useEffect } from "react";
import { useAsync } from "react-use";
import { proxy, wrap } from "comlink";
import WorkerURL from "../worker/pdf.worker?worker&url";

const js =`import ${JSON.stringify(new URL(WorkerURL, import.meta.url))}`;
const blob = new Blob([js], { type: "application/javascript" })

function WorkaroundWorker() {
  const objURL = URL.createObjectURL(blob);
  const worker = new Worker(objURL, { type: "module" });
  worker.addEventListener("error", () => {
    URL.revokeObjectURL(objURL)
  })
  return worker;
}

export const pdfWorker = wrap(WorkaroundWorker());
pdfWorker.onProgress(proxy((info) => console.log(info)));


export const useRenderPDF = ({
  title = "",
  author = "",
  description = "",
  props = {}
}) => {
  const {
    value: url,
    loading,
    error,
  } = useAsync(async () => {
    return pdfWorker.renderPDFInWorker({ title, author, description, ...props });
  }, [title, author, description, props]);

  useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url]);
  return { url, loading, error };
};
