import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function searchNodeById(tree: any, id: string): any {
  // Iterate through each node in the tree
  for (let i = 0; i < tree.length; i++) {
    const currentNode = tree[i]

    // Check if the current node's ID matches the target ID
    if (currentNode.id === id) {
      return currentNode // Return the node if found
    }

    // If the current node has children, recursively search in them
    if (currentNode.children && currentNode.children.length > 0) {
      const foundNode = searchNodeById(currentNode.children, id)
      if (foundNode) {
        return foundNode // If found in children, return the node
      }
    }
  }

  // Return null if node with the specified ID is not found
  return null
}
