import { Level } from "@farsantes/common";

export async function fetchLevel(level: string): Promise<{ level: Level, liarCount: any }> {
  try {
    const response = await fetch(`https://farsant.es/level/${level}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch level data. Status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error fetching level:', error);
    throw error;
  }
}
