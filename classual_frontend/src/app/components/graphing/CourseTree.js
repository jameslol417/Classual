'use client'

import { useEffect, useState } from 'react';
import * as cache from './cache';

async function makeGraph(course) {
  const root = await convertCourseToGraphNode(course.code, true, 0);
  console.log("call make graph " + course.code);
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

async function convertCorequisites(coreqs) {
  const coreqsList = [];
  flattenCorequisites(coreqs, coreqsList);
  return Promise.all(
    coreqsList.map(async (coreqCode) => {
      const course = await cache.getCourse(coreqCode);
      return {
        code: coreqCode,
        exists: course !== null,
      };
    })
  );
}

function flattenCorequisites(coreqs, result) {
  if (typeof coreqs === "string") {
    result.push(coreqs);
  } else {
    for (const child of coreqs.courses) {
      if (typeof child === "string") {
        result.push(child);
      } else {
        flattenCorequisites(child, result);
      }
    }
  }
}


export default makeGraph;