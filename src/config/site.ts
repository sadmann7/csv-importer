import { absoluteUrl } from "@/lib/utils"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "CSV Importer",
  description:
    "CSV importer built with shadcn-ui, react-dropzone, and papaparse.",
  url: absoluteUrl(""),
  links: { github: "https://github.com/sadmann7/csv-importer" },
}
