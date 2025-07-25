"use client";

import React, { useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface Point {
  x: number;
  y: number;
  comment?: string;
  color?: string;
}

const COLORS = ["red", "green", "#32a8a8", "#f57c02", "purple"];

export default function MapWithPoints() {
  const [points, setPoints] = useState<Point[]>([]);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as HTMLElement).closest("button")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPoints((prev) => [...prev, { x, y, color: "red" }]);
  };

  const handleCommentChange = (index: number, value: string) => {
    const updated = [...points];
    updated[index].comment = value;
    setPoints(updated);
  };

  const handleColorChange = (index: number, color: string) => {
    const updated = [...points];
    updated[index].color = color;
    setPoints(updated);
  };

  const handleDeletePoint = (index: number) => {
    setPoints((prev) => prev.filter((_, i) => i !== index));
    setActivePointIndex(null);
  };

  const handleMouseDown = (index: number) => {
    dragTimeout.current = setTimeout(() => {
      setDraggingIndex(index);
    }, 200); // long press to drag
  };

  const handleMouseUp = () => {
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
      dragTimeout.current = null;
    }
    setDraggingIndex(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (draggingIndex === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const updated = [...points];
    updated[draggingIndex] = {
      ...updated[draggingIndex],
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
    };
    setPoints(updated);
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
        src="/houseMap.png"
        alt="Apartment Map"
        className="w-full h-full cursor-pointer object-cover"
      />

      {points.map((point, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: "translate(-50%, -50%)",
            cursor: draggingIndex === index ? "grabbing" : "grab",
            zIndex: activePointIndex === index ? 50 : 10,
          }}
          onMouseDown={() => handleMouseDown(index)}
        >
          <Popover
            open={activePointIndex === index && draggingIndex === null}
            onOpenChange={(open) => setActivePointIndex(open ? index : null)}
          >
            <PopoverTrigger asChild>
              <button
                className="w-5 h-5 rounded-full border text-white text-xs border-white"
                style={{ backgroundColor: point.color || "red" }}
              >
                {index + 1}
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-64 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  🎨
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-5 h-5 cursor-pointer rounded-full border-2 ${
                        point.color === color
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(index, color)}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button
                    size="icon"
                    className="flex-1 w-3 max-w-3 h-5 bg-transparent cursor-pointer text-red-500 hover:bg-transparent    shadow-none"
                    onClick={() => handleDeletePoint(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>

              <Textarea
                value={point.comment || ""}
                onChange={(e) => handleCommentChange(index, e.target.value)}
                placeholder="Enter comment or command..."
              />
              <div className="flex justify-end mt-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="flex-1 w-5"
                  onClick={() => setActivePointIndex(null)}
                >
                  Command
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
}
