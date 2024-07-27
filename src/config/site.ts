import { absoluteUrl } from "@/lib/utils"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Csv Importer",
  description:
    "A csv importer built with shadcn-ui, react-dropzone, and papaparse",
  url: absoluteUrl("/"),
  links: { github: "https://github.com/sadmann7/file-uploader" },
}
