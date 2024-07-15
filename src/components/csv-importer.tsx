"use client"

import { useParseCsv } from "@/hooks/use-parse-csv"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileUploader } from "@/components/file-uploader"

export function CsvImporter() {
  const { parsedData, onParse } = useParseCsv()

  console.log({ parsedData })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>
            Drag and drop your files here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          accept={{ "text/csv": [] }}
          multiple={false}
          maxSize={8 * 1024 * 1024}
          onValueChange={(files) => {
            const file = files[0]

            if (!file) return

            onParse({
              file,
            })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
