import * as React from "react"
import Papa from "papaparse"

export function useParseCsv() {
  const [fileName, setFileName] = React.useState("")
  const [parsedData, setParsedData] = React.useState<Record<string, unknown>[]>(
    []
  )
  const [error, setError] = React.useState<string | null>(null)

  function onParse({
    file,
    limit = Infinity,
  }: {
    file: File
    limit?: number
    mappingFields?: string[]
  }) {
    const allResults: Record<string, unknown>[] = []

    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (results, parser) => {
        if (allResults.length < limit) {
          allResults.push(results.data)
        } else {
          parser.abort()
          setError(`Only ${limit} rows are allowed`)
        }
      },
      complete: (_, localFile: File) => {
        setParsedData(allResults)
        setFileName(
          localFile?.name ? localFile.name.replace(/\.[^/.]+$/, "") : "Untitled"
        )
      },
      error: (err) => {
        setError(err.message)
      },
    })
  }

  return {
    fileName,
    parsedData,
    error,
    onParse,
  }
}
