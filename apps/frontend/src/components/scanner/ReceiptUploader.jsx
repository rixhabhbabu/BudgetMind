import { UploadCloud } from "lucide-react";
import { Card } from "../ui/Card.jsx";

export function ReceiptUploader({ onExtract, uploading = false }) {
  return (
    <Card>
      <label className="grid min-h-64 cursor-pointer place-items-center rounded-md border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={onExtract} disabled={uploading} />
        <span className="grid place-items-center gap-3">
          <UploadCloud className="text-ocean" size={38} />
          <strong>{uploading ? "Extracting bill..." : "Upload bill or receipt"}</strong>
          <small className="text-slate-500">PNG, JPG, or PDF extraction from your account</small>
        </span>
      </label>
    </Card>
  );
}
