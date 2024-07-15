"use client"

import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CsvImporter } from "@/components/csv-importer"

export function ShoesTable() {
  const [data, setData] = React.useState([
    {
      id: "a1b2c3d4e5f6",
      runningShoe: "Asics Gel-Cumulus 25",
      bestFor: "Long, easy, and recovery runs; casual wear; walking",
      price: "$91.98 - $159.95",
      features:
        "- Engineered mesh upper made from about 90% recycled materials for sustainability and enhanced airflow\n- FlyteFoam Blast Plus midsole offering superior cushioning and shock absorption, with an included 8mm drop for a smooth running experience\n- New PureGel technology in the heel for an enhanced, responsive landing and overall softer running feel\n- Outsole designed with dual rubber compounds, AHAR Lo and AHAR Plus, to offer durability and grip\n- Additional features to increase support and comfort include a padded tongue, heel counter, and the Ortholite X-30 sockliner for extra cushioning underfoot",
      userReviews:
        "The Asics Gel-Cumulus 25 has garnered largely positive feedback across various platforms, reflected in its average user ratings of 4.2 to 4.7 out of 5 stars on sites like Amazon and the official Asics website. Users frequently praise its fit, confirming it stays true to size with a comfortable and secure feel. Highlighted strengths include its outstanding cushioning characterized by a 'pillowy effect' and 'bouncy cushioning,' which enhances stability and shock absorption. However, there are some concerns about the upper's warmth in hot weather, owing to significant padding and limited ventilation. Performance-wise, the shoe is versatile, suitable for everything from daily training to long runs, though it may initially present a slightly clunky heel transition that improves with use. Durability is reported to be strong, with many users noting the shoe maintains good condition well beyond 300 miles. When compared to previous models, such as the Gel-Cumulus 24, the 25th iteration is viewed as a significant upgrade with more cushioning, reduced weight, and an improved upper, making it a preferable choice for many over even more cushioned models like the Gel-Nimbus 25. Overall, the Asics Gel-Cumulus 25 is received as a dependable and comfortable option for varied running activities, offering a good mix of responsiveness and softness.",
      brand: "Asics",
      description:
        "Comfortable for long runs with great cushioning, though midsole may feel mushy after extensive use. Users praised fit and cushioning, but noted warmth in hot weather.",
    },
    {
      id: "g7h8i9j0k1l2",
      runningShoe: "Nike Pegasus 40",
      bestFor:
        "Daily running, casual wear, gym use, long-distance training, short and middle-distance runs",
      price: "$84 - $130",
      features:
        "- Material and Design: The Nike Pegasus 40 includes a breathable, single-layer mesh upper designed to enhance airflow and breathability. It features a redesigned midfoot band for better arch support and secure fit, along with extra padding in the collar and tongue for increased comfort. Available in multiple widths, the shoe accommodates various foot shapes.\n- Cushioning and Responsiveness: The shoe incorporates Nike's React foam technology, known for its durability and efficient energy return. It also contains two Zoom Air units, positioned in the heel and forefoot, to deliver a springy, responsive feel. The midsole has a cushioning scale score indicating lower plushness compared to maximalist shoes, but remains moderately soft.\n- Durability and Traction: Outfitted with a durable, waffle-patterned rubber outsole, the Pegasus 40 offers dependable traction on both roads and light trails. The outsole rubber's hardness indicates higher durability, and the upper material shows strong resistance to abrasion, enhancing the shoe's longevity even under extensive use.\n- Fit and Comfort: The shoe's design ensures a snug yet forgiving fit that comfortably wraps around the foot without restrictive feelings. While the feedback on the extra tongue padding is mixed, the overall initial fit is reported to be comfortably true to size.",
      userReviews:
        "The Nike Pegasus 40 has garnered positive reviews for its versatility as a daily trainer suitable for a variety of running activities. Reviewers appreciate the updated features such as increased foam for better fit, improved arch support with a redesigned midfoot band, and enhanced breathability due to the new mesh upper. Despite being described as not the most exciting or responsive compared to more modern shoes, the Pegasus 40 is praised for its firm, responsive ride, especially suitable for workouts and runs up to half marathon distances. While it may not offer the softness preferred by some for longer runs, its durability and overall performance at a reasonable price point make it a recommended choice for both casual and serious runners alike. However, the similarity to its predecessor, the Pegasus 39, suggests that an upgrade might not be necessary for those already using the previous model.",
      brand: "Nike",
      description:
        "Versatile daily trainer with good breathability and arch support. Suitable for various activities but similar to the previous model.",
    },
    {
      id: "m3n4o5p6q7r8",
      runningShoe: "Adidas Adizero Adios Pro 3",
      bestFor: "Marathons and Half-Marathons",
      price: "$250",
      features:
        "- The Adidas Adizero Adios Pro 3 features a durable outsole made of Continental rubber, with strategic placement in high-wear areas to enhance longevity and performance. The outsole is crafted for optimal road running traction, although its smooth texture may not perform as well on snow and ice. The midsole incorporates two layers of Adidas' Lightstrike Pro foam and carbon Energy Rods 2.0, providing a responsive cushioning that supports a smooth and stable ride, especially designed for longer distances like half marathons and marathons. The midsole's design includes strategic cutaways to reduce weight without compromising durability and performance.\n- The upper is made of a lightweight Celermesh material, offering breathability and comfort, though it may feel slightly scratchy against the skin. It includes no traditional heel counter but has added padding for enhanced heel security and comfort. An innovative adjustable heel flap allows customization around the Achilles, improving fit and support. Additionally, the shoe incorporates external overlays and an internal strap across the midfoot and forefoot to secure the fit. This combination of features makes the shoe both lightweight and responsive, ideal for long-distance running while ensuring durability and traction.",
      userReviews:
        "The Adidas Adizero Adios Pro 3 receives predominantly positive feedback for its light and comfortable wear, with an upper that feels ultra-lightweight. Users appreciate the customizable fit and the innovative internal ankle pods that help secure the foot, despite some issues with rubbing. The shoe's midsole is described as protective, light, and excellent at providing a feeling of propulsion, thanks to the carbon energy rods which enhance performance without the rigidity of a full-length carbon plate. It transitions well from landing to toe-off and supports a variety of running paces comfortably, making it suitable for both easy runs and speed workouts. Users also report reduced muscle soreness and fatigue even after long runs. Durability is another strong point, with the outsole remaining intact and the midsole and energy rods maintaining performance over hundreds of miles, based on one reviewer's experience exceeding 300 miles without significant wear. However, there are criticisms regarding the fit of the upper, with some finding it loose and problematic when cornering, and others noting sizing inconsistencies. Despite these issues, it remains popular among users seeking a high-performance running shoe that combines speed with comfort.",
      brand: "Adidas",
      description:
        "Lightweight and responsive, ideal for marathons. Some issues with fit and sizing; strong performance with reduced muscle soreness.",
    },
    {
      id: "s1t2u3v4w5x6",
      runningShoe: "Nike Vaporfly 3 Road Racing Shoes",
      bestFor: "Road racing, 10K to marathon",
      price: "$225",
      features:
        "- The Nike Vaporfly 3 boasts several high-performance features designed to enhance the running experience. It includes a ZoomX midsole foam known for its exceptional energy return and responsiveness, now increased by 2mm for better cushioning and bounce. The shoes also feature an updated midsole geometry for improved stability during runs, and the outsole’s new lighter rubber compound makes the shoe lighter while still providing durable traction on various surfaces. Additionally, the Vaporfly 3 has a Flyknit upper offering breathability and a snug fit with minimal stretch, mixed with strategically placed thicker yarns for enhanced durability. A full-length carbon fiber Flyplate is retained for propulsion and energy efficiency. These features collectively refine the shoe’s design, focusing on stability, enhanced cushioning, and energy return, making it a top choice for competitive road races.",
      userReviews:
        "The Nike Vaporfly 3 is highly praised for its performance and fit, with users and reviewers noting that it fits true to size, and its Flyknit material provides breathability and comfort. The integrated tongue and snug midfoot ensure a secure fit, while the slightly roomier forefoot adds comfort during runs. Performance-wise, the shoe's full-length ZoomX midsole offers a responsive and cushioned ride, ideal for faster paces and long races. Its carbon plate and forefoot rocker contribute to a propulsive toe-off, enhancing speed. However, the shoe is noted to show some wear on the midsole after moderate use, although its outsole offers improved durability and grip, even on wet surfaces. While it is on the pricey side and may not offer the most stability, the Vaporfly 3 is commonly described as one of the best road racing shoes available, suitable for competitive races ranging from 5K to marathon distances.",
      brand: "Nike",
      description:
        "High-performance racing shoe with exceptional energy return. Expensive and may show wear quickly, but highly recommended for competitive races.",
    },
  ])

  return (
    <div className="flex flex-col gap-4">
      <CsvImporter
        fields={["Running Shoe", "Best For", "Price", "Brand"]}
        onImport={(parsedData) => {
          console.log({ parsedData })
        }}
        className="self-end"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Running Shoe</TableHead>
              <TableHead>Best For</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Brand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.runningShoe}
                </TableCell>
                <TableCell>{item.bestFor}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.brand}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
