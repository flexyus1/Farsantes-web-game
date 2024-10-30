import { isDebugEnabled } from "../constants";
import { BlobIntegrity, ClueAssertion, Blob } from "../models";

// export function getRandomColor(): BlobColor {
//   const random = Math.floor(Math.random() * blobColors.length);
//   return blobColors[random];
// }

export function convertBlobListToMap(blobs: Blob[]): Map<string, Blob> {
  const map = new Map();
  blobs.forEach((blob) => {
    map.set(blob.name, blob);
  });
  return map;
}



// export function moveElementToStart(array: string[], element: string): string[] {
//   const index = array.indexOf(element);
//   // If the element doesn't exist in the array, return the original array
//   if (index === -1) {
//     return array;
//   }
//   // Remove the element from its current position
//   array.splice(index, 1);
//   // Add the element to the beginning of the array
//   array.unshift(element);
//   return array;
// }

// export function getBlobType(boolean: boolean, blobClassification?: BlobType): BlobType {
//   if (blobClassification) {
//     if (blobClassification === blobType.TRUTH) {
//       return boolean ? blobType.TRUTH : blobType.LIE;
//     } else {
//       return boolean ? blobType.LIE : blobType.TRUTH;
//     }
//   }
//   return boolean ? blobType.TRUTH : blobType.LIE;
// }

// export function getRealClueType(blob0: BlobType, blob1: BlobType): BlobType {
//   if (blob0 === blob1) {
//     return blobType.TRUTH
//   }
//   return blobType.LIE
// }

// export function isStatementTrue(blob0: BlobType, blob1?: BlobType): boolean {
//   if (blob1) {
//     return blob0 === blob1;
//   }
//   return blob0 === blobType.TRUTH;
// }

export function getValidatedClueAssertion(clueAssertion: ClueAssertion, blobIntegrity: BlobIntegrity): ClueAssertion {
  return clueAssertion == blobIntegrity;
}


export function log(message: string, ...optionalParams: any[]): void {
  const debug = isDebugEnabled
  if (debug) {
    console.log(message, ...optionalParams);
  }
}

// export function addToLocalCount(name: string) {
//   const count = localStorage.getItem("count_" + name)
//   if (count) {
//     localStorage.setItem("count_" + name, (parseInt(count) + 1).toString())
//   } else {
//     localStorage.setItem("count_" + name, "1")
//   }
// }

// export function getCount(name: string): number {
//   const count = localStorage.getItem("count_" + name)
//   if (count) {
//     return parseInt(count)
//   }
//   return 0
// }

// export function resetCount(name: string) {
//   localStorage.setItem("count_" + name, "0")
// }
