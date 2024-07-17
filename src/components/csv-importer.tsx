"use client"

import * as React from "react"
import { ArrowLeftIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { CommandList } from "cmdk"

import { cn } from "@/lib/utils"
import { useParseCsv } from "@/hooks/use-parse-csv"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileUploader } from "@/components/file-uploader"

interface CsvImporterProps
  extends React.ComponentPropsWithoutRef<typeof DialogTrigger>,
    ButtonProps {
  fields: string[]
  onImport: (data: Record<string, unknown>[]) => void
}

export function CsvImporter({
  fields,
  onImport,
  className,
  ...props
}: CsvImporterProps) {
  const [step, setStep] = React.useState<"upload" | "map">("upload")
  const { headers, data, onParse, onFieldChange, onFieldsReset } = useParseCsv()

  console.log({ data })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("w-fit", className)} {...props}>
          Import CSV
        </Button>
      </DialogTrigger>
      {step === "upload" ? (
        <DialogContent className="p-8 sm:max-w-xl">
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
                limit: 1001,
              })

              setStep("map")
            }}
          />
        </DialogContent>
      ) : (
        <DialogContent className="overflow-hidden p-8 sm:max-w-6xl">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <DialogHeader className="flex-1">
              <DialogTitle>Map Fields</DialogTitle>
              <DialogDescription>
                Map the CSV fields to the database fields
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="outline"
              className="w-full sm:w-fit"
              onClick={onFieldsReset}
            >
              Reset
            </Button>
          </div>
          <div className="grid h-[26.25rem] w-full overflow-hidden rounded-md border">
            <Table className="border-b">
              <TableHeader className="sticky top-0 z-10 bg-background shadow">
                <TableRow className="bg-muted/50">
                  {fields.map((field) => (
                    <PreviewTableHead
                      key={field}
                      field={field}
                      onFieldChange={(value) => {
                        onFieldChange({
                          oldField: value,
                          newField: field,
                        })
                      }}
                      parsedFields={headers}
                      className="border-r last:border-r-0"
                    />
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i} className="h-10">
                    {fields.map((field) => (
                      <TableCell
                        key={field}
                        className="border-r last:border-r-0"
                      >
                        <span className="line-clamp-1">
                          {typeof row[field] === "string"
                            ? row[field]
                            : JSON.stringify(row[field])}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button variant="outline" onClick={() => setStep("upload")}>
              Back
            </Button>
            <Button
              onClick={() => {
                onImport(data)
              }}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

interface PreviewTableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  field: string
  onFieldChange: (value: string) => void
  parsedFields: string[]
}

function PreviewTableHead({
  field,
  onFieldChange,
  parsedFields,
  className,
  ...props
}: PreviewTableHeadProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(field)

  return (
    <TableHead
      key={field}
      className={cn("whitespace-nowrap py-2", className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        <span className="line-clamp-1">{field}</span>
        <ArrowLeftIcon className="ml-1 size-4" aria-hidden="true" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-[12.5rem] justify-between"
            >
              {value
                ? (parsedFields.find((field) => field === value) ??
                  "Select field...")
                : "Select field..."}
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder="Search field..." />
              <CommandEmpty>No field found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {parsedFields.map((field) => (
                    <CommandItem
                      key={field}
                      value={field}
                      onSelect={(currentValue) => {
                        setValue(currentValue)
                        onFieldChange(currentValue)
                        setOpen(false)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 size-4",
                          value === field ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="line-clamp-1">{field}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  )
}
