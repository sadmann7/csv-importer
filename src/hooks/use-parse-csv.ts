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
  const [headers, setHeaders] = React.useState<string[]>([])
  const [parsedData, setParsedData] = React.useState<Record<string, unknown>[]>(
    []
  )
  const [mappedData, setMappedData] = React.useState<Record<string, unknown>[]>(
    []
  )
  const [fieldMappings, setFieldMappings] = React.useState<{
    [key: string]: string
  }>({})
  const [error, setError] = React.useState<string | null>(null)

  function onParse({ file, limit = Infinity }: { file: File; limit?: number }) {
    let count = 0
    const allResults: Record<string, unknown>[] = []

    Papa.parse<Record<string, unknown>>(file, {
      ...props,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (results, parser) => {
        try {
          if (count === 0) {
            setHeaders(
              props.header
                ? (results.meta.fields ?? [])
                : Object.keys(results.data)
            )
            count++
          } else if (count <= limit) {
            allResults.push(results.data)
            count++
          } else {
            parser.abort()
            throw new Error(`Only ${limit} rows are allowed`)
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error parsing CSV"
          setError(message)
          onError?.(message)
        }
      },
      complete: (_, localFile: File) => {
        setFileName(
          localFile?.name ? localFile.name.replace(/\.[^/.]+$/, "") : "Untitled"
        )
        setParsedData(allResults)
        setMappedData(allResults)
        setFieldMappings({})
        onSuccess?.(allResults)
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
    setFieldMappings((prevMappings) => ({
      ...prevMappings,
      [newField]: oldField,
    }))
    setMappedData(
      mappedData.map((row, index) => ({
        ...row,
        [newField]: parsedData[index]?.[oldField],
      }))
    )
  }

  function onFieldsReset() {
    setMappedData(parsedData)
    setFieldMappings({})
  }

  return {
    fileName,
    headers,
    data: mappedData,
    fieldMappings,
    error,
    onParse,
    onFieldChange,
    onFieldsReset,
  }
}
