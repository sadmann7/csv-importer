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
  const { parsedData, onParse } = useParseCsv()

  const parsedFields = Object.keys(parsedData[0] ?? {})

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("w-fit", className)} {...props}>
          Import CSV
        </Button>
      </DialogTrigger>
      {step === "upload" ? (
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
                limit: 1001,
              })

              setStep("map")
            }}
          />
        </DialogContent>
      ) : (
        <DialogContent className="max-h-[80%] sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Map Fields</DialogTitle>
            <DialogDescription>
              Map the CSV fields to the database fields
            </DialogDescription>
          </DialogHeader>
          <Table className="overflow-auto border">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                {fields.map((field) => (
                  <PreviewTableHead
                    key={field}
                    field={field}
                    parsedFields={parsedFields}
                    className="border-r last:border-r-0"
                  />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedData.map((data, i) => (
                <TableRow key={i}>
                  {fields.map((field) => (
                    <TableCell key={field} className="border-r last:border-r-0">
                      {typeof data[field] === "string"
                        ? data[field]
                        : JSON.stringify(data[field])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button variant="outline" onClick={() => setStep("upload")}>
              Back
            </Button>
            <Button
              onClick={() => {
                onImport(parsedData)
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
  extends React.ComponentPropsWithoutRef<typeof TableHead> {
  field: string
  parsedFields: string[]
}

function PreviewTableHead({
  field,
  parsedFields = [],
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
        {field}
        <ArrowLeftIcon className="ml-1 size-4" aria-hidden="true" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? (parsedFields.find((field) => field === value) ??
                  "Select field...")
                : "Select field..."}
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search field..." />
              <CommandEmpty>No field found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {parsedFields.map((field) => (
                    <CommandItem
                      key={field}
                      value={field}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 size-4",
                          value === field ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {field}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  )
}
