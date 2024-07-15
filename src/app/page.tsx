import { FileUploader } from "@/components/file-uploader"
import { Shell } from "@/components/shell"

export default function IndexPage() {
  return (
    <Shell>
      <FileUploader accept={{ "text/csv": [] }} />
    </Shell>
  )
}
