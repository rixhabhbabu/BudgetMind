import { FileDown } from "lucide-react";
import { Button } from "../ui/Button.jsx";

export function ReportExportButton() {
  return <Button><FileDown size={18} />Export PDF report</Button>;
}
