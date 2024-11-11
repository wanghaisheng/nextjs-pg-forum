import React from "react"

import { Typography } from "ui"

export type PageTitleProps = {
  title: string
  description?: string
}

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="mb-4 flex flex-col">
      <Typography
        variant="h1"
        className="text-2xl"
      >
        {title}
      </Typography>
      {description && <Typography className="text-muted-foreground">{description}</Typography>}
    </div>
  )
}
