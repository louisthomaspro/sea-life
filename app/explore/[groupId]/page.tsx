"use client"

import Link from "next/link"
import { groups } from "@/constants/groups"

import { searchNodeById } from "@/lib/utils"

export default function GroupPage({ params }: { params: { groupId: string } }) {
  // get the group details from groups tree variable
  const group = searchNodeById(groups, params.groupId)
  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => window.history.back()}>Back</button>
      <div>FR: {group.title.en}</div>
      {group.children && (
        <div className="flex flex-col gap-2">
          {group.children.map((child: any) => {
            return (
              <Link key={child.id} href={`/explore/${child.id}`}>
                <div>{child.title.en}</div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
