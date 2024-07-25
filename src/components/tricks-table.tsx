"use client"

import * as React from "react"

import { dataConfig, type DataConfig } from "@/config/data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CsvImporter } from "@/components/csv-importer"

export function TricksTable() {
  const [data, setData] = React.useState(dataConfig.speicalTricks)

  return (
    <div className="flex flex-col gap-4">
      <CsvImporter
        fields={[
          { label: "Name", value: "name", required: true },
          { label: "Description", value: "description" },
          { label: "Points", value: "points" },
          { label: "Difficulty", value: "difficulty" },
          { label: "Style", value: "style" },
        ]}
        onImport={(parsedData) => {
          const formattedData = parsedData.map((item) => ({
            id: crypto.randomUUID(),
            name: item.name,
            description: item.description,
            points: item.points,
            difficulty: item.difficulty,
            style: item.style,
          })) as unknown as DataConfig["speicalTricks"]

          setData((prev) => [...prev, ...formattedData])
        }}
        className="self-end"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Style</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <span className="line-clamp-1">{item.description}</span>
                </TableCell>
                <TableCell>{item.points}</TableCell>
                <TableCell>{item.difficulty}</TableCell>
                <TableCell>{item.style}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
