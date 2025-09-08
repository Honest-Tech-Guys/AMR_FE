import { Gauge, Lock } from "lucide-react";
import React from "react";

const getMeterAndLock = (item: Unit | Room) => {
  const hasMeters =
    item.meters.length > 0 ? (
      <>
        <Gauge className="size-4" /> on
      </>
    ) : (
      <>
        <Gauge className="size-4" /> off
      </>
    );
  const hasLocks =
    item.locks.length > 0 ? (
      <>
        <Lock className="size-4" /> on
      </>
    ) : (
      <>
        <Lock className="size-4" /> off
      </>
    );
  return (
    <div className="flex gap-2">
      {hasLocks}
      {hasMeters}
    </div>
  );
};

export default getMeterAndLock;
