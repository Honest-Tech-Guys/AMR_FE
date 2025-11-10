"use client";

import React, { useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface Point {
  room_id: number;
  x: number;
  y: number;
  comment?: string;
  color?: string;
}

const COLORS = ["red", "green", "#32a8a8", "#f57c02", "purple"];

interface Props {
  url: string;
  selectedRoomId: number; // Pass selected room ID from parent
  points?: Point[];
  onChange?: (points: Point[]) => void;
}

export default function MapWithPoints({
  url,
  selectedRoomId,
  points: initialPoints = [],
  onChange,
}: Props) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!selectedRoomId) return; // No room selected
    if ((e.target as HTMLElement).closest("button")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPoint: Point = {
      room_id: selectedRoomId,
      x,
      y,
      color: "red",
    };

    // Replace existing point for the same room
    const newPoints = [
      ...points.filter((p) => p.room_id !== selectedRoomId),
      newPoint,
    ];

    setPoints(newPoints);
    onChange?.(newPoints);
  };

  const handleMouseDown = (id: number) => {
    dragTimeout.current = setTimeout(() => setDraggingId(id), 200);
  };

  const handleMouseUp = () => {
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
      dragTimeout.current = null;
    }
    setDraggingId(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (draggingId === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPoints((prev) =>
      prev.map((p) =>
        p.room_id === draggingId
          ? {
              ...p,
              x: Math.min(Math.max(x, 0), 100),
              y: Math.min(Math.max(y, 0), 100),
            }
          : p
      )
    );
    onChange?.(points);
  };

  const handleDelete = (id: number) => {
    const newPoints = points.filter((p) => p.room_id !== id);
    setPoints(newPoints);
    onChange?.(newPoints);
    if (activeId === id) setActiveId(null);
  };

  const handleColorChange = (id: number, color: string) => {
    setPoints((prev) =>
      prev.map((p) => (p.room_id === id ? { ...p, color } : p))
    );
    onChange?.(points);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[500px] h-[300px] my-5 select-none"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        src={url}
        alt="Map"
        className="w-full h-full cursor-pointer object-contain"
      />

      {points.map((p) => (
        <div
          key={p.room_id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: "translate(-50%, -50%)",
            cursor: draggingId === p.room_id ? "grabbing" : "grab",
            zIndex: activeId === p.room_id ? 50 : 10,
          }}
          onMouseDown={() => handleMouseDown(p.room_id)}
        >
          <Popover
            open={activeId === p.room_id && draggingId !== p.room_id}
            onOpenChange={(open) => setActiveId(open ? p.room_id : null)}
          >
            <PopoverTrigger asChild>
              <button
                className="w-5 h-5 rounded-full border border-white z-50"
                style={{ backgroundColor: p.color || "red" }}
              />
            </PopoverTrigger>

            <PopoverContent className="w-64 z-50 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  🎨
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-5 h-5 cursor-pointer rounded-full border-2 ${
                        p.color === color
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(p.room_id, color)}
                    />
                  ))}
                </div>
                <Button
                  size="icon"
                  className="bg-transparent text-red-500 hover:bg-transparent"
                  onClick={() => handleDelete(p.room_id)}
                >
                  <Trash />
                </Button>
              </div>

              <div className="flex justify-end mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveId(null)}
                >
                  Close
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
}
