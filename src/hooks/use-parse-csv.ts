import * as React from "react"
import * as Papa from "papaparse"

interface UseParseCsvProps extends Papa.ParseConfig {
  onSuccess?: (data: Record<string, unknown>[]) => void
  onError?: (message: string) => void
}

export function useParseCsv({
  onSuccess,
  onError,
  ...props
}: UseParseCsvProps = {}) {
  const [fileName, setFileName] = React.useState("")
  const [parsedData, setParsedData] = React.useState<Record<string, unknown>[]>(
    []
  )
  const [mappedData, setMappedData] = React.useState<Record<string, unknown>[]>(
    []
  )
  const [error, setError] = React.useState<string | null>(null)
  const [headers, setHeaders] = React.useState<string[]>([])

  function onParse({ file, limit = Infinity }: { file: File; limit?: number }) {
    const allResults: Record<string, unknown>[] = []

    Papa.parse<Record<string, unknown>>(file, {
      ...props,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (results, parser) => {
        if (allResults.length < limit) {
          allResults.push(results.data)
          setHeaders(results.meta.fields ?? [])
        } else {
          parser.abort()
          setError(`Only ${limit} rows are allowed`)
        }
      },
      complete: (_, localFile: File) => {
        setFileName(
          localFile?.name ? localFile.name.replace(/\.[^/.]+$/, "") : "Untitled"
        )

        setParsedData(allResults)
        setMappedData(allResults)
        onSuccess?.(allResults)
      },
      error: (err) => {
        setError(err.message)
        onError?.(err.message)
      },
    })
  }

  function onMap({
    oldField,
    newField,
  }: {
    oldField: string
    newField: string
  }) {
    const originalFieldRows = parsedData.map((row) => row[oldField])

    setMappedData(
      mappedData.map((row, index) => ({
        ...row,
        [newField]: originalFieldRows[index],
      }))
    )
  }

  return {
    fileName,
    headers,
    parsedData: mappedData,
    error,
    onParse,
    onMap,
  }
}
