import React from "react";
import Album from "./Show-Listings"

export default function HomePage() {
  return (
    <div>
          <Album inputFilter={{
            sold: false,
            category: [], size: [],
            color: [], condition: []
          }}/>
    </div>
  )
}
