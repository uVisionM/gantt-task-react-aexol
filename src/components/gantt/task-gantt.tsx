import React, { useRef, useEffect } from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  let isDown = false;
  let startX: number;
  let scrollLeft: number;
  const slider = document.querySelector("#containerwithgantt");

  const end = () => {
    isDown = false;
    if (slider) slider.classList.remove("active");
  };

  const start = (event: any) => {
    isDown = true;
    if (slider) {
      slider.classList.add("active");
      startX = event.pageX || event.touches[0].pageX;
      scrollLeft = slider.scrollLeft;
    }
  };

  const move = (event: any) => {
    if (!isDown) return;
    event.preventDefault();
    if (slider) {
      const x = event.pageX || event.touches[0].pageX;
      const dist = x - startX;
      slider.scrollLeft = scrollLeft - dist;
    }
  };

  (() => {
    slider?.addEventListener("mousedown", start);
    slider?.addEventListener("touchstart", start);

    slider?.addEventListener("mousemove", move);
    slider?.addEventListener("touchmove", move);

    slider?.addEventListener("mouseleave", end);
    slider?.addEventListener("mouseup", end);
    slider?.addEventListener("touchend", end);
  })();

  return (
    <div
      className={styles.ganttVerticalContainer}
      id="containerwithgantt"
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};
