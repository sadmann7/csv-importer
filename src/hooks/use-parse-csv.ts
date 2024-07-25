import * as React from "react"
import * as Papa from "papaparse"

interface UseParseCsvProps extends Papa.ParseConfig {
  onSuccess?: (data: Record<string, unknown>[]) => void
  onError?: (message: string) => void
}

interface CsvState {
  fileName: string
  data: {
    parsed: Record<string, unknown>[]
    mapped: Record<string, unknown>[]
  }
  fieldMappings: {
    original: Record<string, string | undefined>
    current: Record<string, string | undefined>
  }
  error: string | null
}

export function useParseCsv({
  onSuccess,
  onError,
  ...props
}: UseParseCsvProps = {}) {
  const [csvState, setCsvState] = React.useState<CsvState>({
    fileName: "",
    data: {
      parsed: [],
      mapped: [],
    },
    fieldMappings: {
      current: {},
      original: {},
    },
    error: null,
  })

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
            const mappings = (results.meta.fields ?? []).reduce(
              (acc, field) => ({ ...acc, [field]: field }),
              {}
            )
            const checkedHeaders = (results.meta.fields ?? []).reduce(
              (acc, field) => ({ ...acc, [field]: true }),
              {}
            )
            setCsvState((prevState) => ({
              ...prevState,
              fieldMappings: {
                original: mappings,
                current: mappings,
              },
              checkedHeaders,
            }))
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
          setCsvState((prevState) => ({ ...prevState, error: message }))
          onError?.(message)
        }
      },
      complete: (_, localFile: File) => {
        setCsvState((prevState) => ({
          ...prevState,
          fileName: localFile?.name
            ? localFile.name.replace(/\.[^/.]+$/, "")
            : "Untitled",
          data: {
            parsed: allResults,
            mapped: allResults,
          },
        }))
        onSuccess?.(allResults)
      },
    })
  }

  function onFieldChange({
    oldValue,
    newValue,
  }: {
    oldValue: string
    newValue: string
  }) {
    setCsvState((prevState) => ({
      ...prevState,
      fieldMappings: {
        ...prevState.fieldMappings,
        current: { ...prevState.fieldMappings.current, [newValue]: oldValue },
      },
      data: {
        ...prevState.data,
        mapped: prevState.data.mapped.map((row, index) => ({
          ...row,
          [newValue]: prevState.data.parsed[index]?.[oldValue],
        })),
      },
    }))
  }

  function onFieldToggle({
    value,
    checked,
  }: {
    value: string
    checked: boolean
  }) {
    setCsvState((prevState) => ({
      ...prevState,
      fieldMappings: {
        ...prevState.fieldMappings,
        current: {
          ...prevState.fieldMappings.current,
          [value]: checked ? "" : undefined,
        },
      },
      data: {
        ...prevState.data,
        mapped: prevState.data.mapped.map((row) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [value]: _, ...rest } = row
          return rest
        }),
      },
    }))
  }

  function onFieldsReset() {
    setCsvState((prevState) => ({
      ...prevState,
      fieldMappings: {
        ...prevState.fieldMappings,
        current: prevState.fieldMappings.original,
      },
      data: {
        ...prevState.data,
        mapped: prevState.data.parsed,
      },
    }))
  }

  function getSanitizedData({ data }: { data: Record<string, unknown>[] }) {
    return data.map((row) =>
      Object.keys(row).reduce(
        (acc, key) => ({
          ...acc,
          [key]: row[key] === null ? "" : row[key],
        }),
        {}
      )
    )
  }

  return {
    fileName: csvState.fileName,
    data: csvState.data.mapped,
    fieldMappings: csvState.fieldMappings.current,
    error: csvState.error,
    getSanitizedData,
    onParse,
    onFieldChange,
    onFieldToggle,
    onFieldsReset,
  }
}
