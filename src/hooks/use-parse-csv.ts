import * as React from "react"
import * as Papa from "papaparse"

interface UseParseCsvProps extends Papa.ParseConfig {
  fields?: string[]
  onSuccess?: (data: Record<string, unknown>[]) => void
  onError?: (message: string) => void
}

export function useParseCsv({
  fields,
  onSuccess,
  onError,
  ...props
}: UseParseCsvProps = {}) {
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
    mappingFields?: Record<string, string>
  }) {
    const allResults: Record<string, unknown>[] = []

    Papa.parse<Record<string, unknown>>(file, {
      ...props,
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
        setFileName(
          localFile?.name ? localFile.name.replace(/\.[^/.]+$/, "") : "Untitled"
        )

        setParsedData(allResults)
        onSuccess?.(allResults)
      },
      error: (err) => {
        setError(err.message)
        onError?.(err.message)
      },
    })
  }

  function onFieldChange({
    oldField,
    newField,
  }: {
    oldField: string
    newField: string
  }) {
    setParsedData((prevData) =>
      prevData.map((row) => {
        const newRow = { ...row }
        newRow[newField] = newRow[oldField]
        delete newRow[oldField]
        return newRow
      })
    )
  }

  return {
    fileName,
    parsedData,
    error,
    onParse,
    onFieldChange,
  }
}
