import { UploadCloud } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function ReceiptUploader({ onExtract }) {
  return (
    <Card>
      <label className="grid min-h-64 cursor-pointer place-items-center rounded-md border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
        <input type="file" className="hidden" onChange={onExtract} />
        <span className="grid gap-3 place-items-center">
          <UploadCloud className="text-ocean" size={38} />
          <strong>Upload bill or receipt</strong>
          <small className="text-slate-500">PNG, JPG, or PDF demo extraction</small>
        </span>
      </label>
    </Card>
  );
}
