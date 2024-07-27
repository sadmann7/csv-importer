import * as React from "react"
import * as Papa from "papaparse"

import { getErrorMessage } from "@/lib/handle-error"

interface UseParseCsvProps extends Papa.ParseConfig {
  fields: { label: string; value: string; required?: boolean }[]
  onSuccess?: (data: Record<string, unknown>[]) => void
  onError?: (message: string) => void
  showEmptyFields?: boolean
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
  fields,
  onSuccess,
  onError,
  showEmptyFields,
  ...props
}: UseParseCsvProps) {
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
      beforeFirstChunk: (chunk) => {
        const parsedChunk = Papa.parse<string[]>(chunk, {
          header: false,
          skipEmptyLines: true,
        })

        const rows = parsedChunk.data
        const columns = rows[0] ?? []

        const columnsWithNameAndValues = columns.filter((_, index) => {
          const values = rows.slice(1).map((row) => row[index])
          return columns[index] || values.some((value) => value !== "")
        })

        const newColumns = (
          showEmptyFields ? columns : columnsWithNameAndValues
        ).map((column, index) => {
          if (column.trim() === "") {
            return `Column ${index + 1}`
          }
          return column
        })

        rows[0] = newColumns
        return Papa.unparse(rows)
      },
      step: (results, parser) => {
        try {
          if (count === 0) {
            const mappings = (results.meta.fields ?? [])?.reduce(
              (acc, field) => ({
                ...acc,
                [field]: field,
              }),
              {}
            )

            setCsvState((prevState) => ({
              ...prevState,
              fieldMappings: {
                original: mappings,
                current: mappings,
              },
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
          const message = getErrorMessage(err)
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
    originalFieldMappings: csvState.fieldMappings.original,
    error: csvState.error,
    getSanitizedData,
    onParse,
    onFieldChange,
    onFieldToggle,
    onFieldsReset,
  }
}
