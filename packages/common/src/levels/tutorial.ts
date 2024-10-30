import { blobColor, blobIntegrity, groupSide } from "../constants";
import { blob, clueSpecific } from "../factories";
import { Level } from "../models";

export function tutorial1(): Level {
  const minimumLiars = 1;
  const maximumLiars = 1;

  const left_0 = blob("Bob", blobColor.BLUE,
    clueSpecific("Leozin", blobIntegrity.TRUE),
    groupSide.LEFT
  );

  const right_0 = blob("Leozin", blobColor.GREEN,
    clueSpecific("Jaiminho", blobIntegrity.TRUE),
    groupSide.RIGHT
  );

  const left_1 = blob("Bielzinho", blobColor.RED,
    clueSpecific("Jaiminho", blobIntegrity.FALSE),
    groupSide.LEFT
  );

  const right_1 = blob("Jaiminho", blobColor.GREEN,
    clueSpecific("Bielzinho", blobIntegrity.FALSE),
    groupSide.RIGHT
  );

  const blobs = [left_0, left_1, right_0, right_1];

  return {
    name: "Level 0",
    minimumLiars,
    maximumLiars,
    blobs,
  };

}
