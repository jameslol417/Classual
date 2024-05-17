'use client'

import { useEffect, useState } from 'react';

async function makeGraph(course){
    const root = await convertCourseToGraphNode(course.code, true, 0);
    if (root.state === "closed") {
        root.state = "open";
    }
    return root;
}
async function convertCourseToGraphNode(
    code,
    isNested,
    depth
  ) {
    const node = courseGraphNodeFactory(code, isNested);
    const course = await cache.getCourse(code);
    if (!course) {
      node.state = "unknown";
      return node;
    }
    if ((!course.prereqs && !course.coreqs) || depth > 15) {
      // depth limit is to stop infinite cycle edge case
      node.state = "noPrereqs";
      return node;
    }
  
    if (course.prereqs) {
      if (typeof course.prereqs === "string") {
        // single course
        node.child = await convertCourseToGraphNode(
          course.prereqs,
          false,
          depth + 1
        );
      } else {
        // course set
        node.child = await convertSetToGraphNode(
          course.prereqs,
          false,
          depth + 1
        );
      }
    }
    if (course.coreqs) {
      node.coreqs = await convertCorequisites(course.coreqs);
    }
    return node;
}

async function convertSetToGraphNode(
    set,
    isNested,
    depth
  ) {
    const node = setGraphNodeFactory(set.type, isNested);
    node.children = await Promise.all(
      set.courses.map(async (child) => {
        if (typeof child === "string") {
          // single course
          return convertCourseToGraphNode(
            child,
            isNested || set.type !== "all",
            depth
          );
        } else {
          // course set
          return convertSetToGraphNode(child, true, depth);
        }
      })
    );
    return node;
}

function courseGraphNodeFactory(code, isNested) {
    return {
      type: "course",
      code: code,
      child: null,
      coreqs: null,
      state: "closed",
      x: 0,
      y: 0,
      xIn: 0,
      xOut: 0,
      bounds: { xMin: 0, xMax: 0, yMin: 0, yMax: 0 },
      isNested: isNested,
    };
  }
  
  function setGraphNodeFactory(amount, isNested) {
    return {
      type: "set",
      amount: amount,
      children: [],
      x: 0,
      y: 0,
      xIn: 0,
      xOut: 0,
      bounds: { xMin: 0, xMax: 0, yMin: 0, yMax: 0 },
      isNested: isNested,
    };
  }
  


export default makeGraph