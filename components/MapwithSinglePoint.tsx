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

interface Props {
  url: string;
  onChange?: (point: { x: number; y: number } | null) => void;
}

export default function MapWithSinglePoint({ url, onChange }: Props) {
  const [point, setPoint] = useState<Point | null>(null);
  const [active, setActive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as HTMLElement).closest("button")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPoint = { x, y, color: "red" };
    setPoint(newPoint);
    onChange?.(newPoint);
  };

  const handleCommentChange = (value: string) => {
    if (!point) return;
    const updated = { ...point, comment: value };
    setPoint(updated);
    onChange?.(updated);
  };

  const handleColorChange = (color: string) => {
    if (!point) return;
    const updated = { ...point, color };
    setPoint(updated);
    onChange?.(updated);
  };

  const handleDelete = () => {
    setPoint(null);
    setActive(false);
    onChange?.(null);
  };

  const handleMouseDown = () => {
    dragTimeout.current = setTimeout(() => {
      setDragging(true);
    }, 200);
  };

  const handleMouseUp = () => {
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
      dragTimeout.current = null;
    }
    setDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!dragging || !containerRef.current || !point) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const updated = {
      ...point,
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
    };
    setPoint(updated);
    onChange?.(updated);
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
        alt="Apartment Map"
        className="w-full h-full cursor-pointer object-contain"
      />

      {point && (
        <div
          className="absolute"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: "translate(-50%, -50%)",
            cursor: dragging ? "grabbing" : "grab",
            zIndex: active ? 50 : 10,
          }}
          onMouseDown={handleMouseDown}
        >
          <Popover open={active && !dragging} onOpenChange={setActive}>
            <PopoverTrigger asChild>
              <button
                className="w-5 h-5 rounded-full border text-white text-xs border-white z-1000"
                style={{ backgroundColor: point.color || "red" }}
              ></button>
            </PopoverTrigger>

            <PopoverContent className="w-64 z-1000 space-y-3">
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
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
                <Button
                  size="icon"
                  className="bg-transparent text-red-500 hover:bg-transparent"
                  onClick={handleDelete}
                >
                  <Trash />
                </Button>
              </div>

              {/* <Textarea
                value={point.comment || ""}
                onChange={(e) => handleCommentChange(e.target.value)}
                placeholder="Enter comment..."
              /> */}

              <div className="flex justify-end mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActive(false)}
                >
                  Close
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
