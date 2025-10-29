"use client";

import React from "react";
import { Room } from "@/types/RoomType";

interface Props {
  url: string;
  rooms: Room[];
}

export default function MapRoomViewer({ url, rooms }: Props) {
  console.log(rooms);
  return (
    <div className="relative w-[500px] h-[300px] my-5 select-none">
      <img
        src={url}
        alt="Apartment Map"
        className="w-full h-full object-contain rounded-md border"
      />

      {rooms
        .filter((room) => room.coordinates)
        .map((room, index) => {
          const x = parseFloat(room.coordinates!.x);
          const y = parseFloat(room.coordinates!.y);
          const color = room.status === "Vacant" ? "green" : "red";
          console.log(y);
          console.log(x);
          return (
            <div
              key={room.id}
              className="absolute z-3000 flex flex-col items-center "
              style={{
                left: `${x}px`,
                top: `${y}px`,
                // transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 border-white shadow-md`}
                style={{ backgroundColor: color }}
                title={`${room.name} (${room.status})`}
              ></div>
              <span className="text-xs bg-white/80 px-1 mt-1 rounded">
                {room.name}
              </span>
            </div>
          );
        })}
    </div>
  );
}
