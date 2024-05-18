// Assuming the Course type is an object with a 'code' property.

export const getCourseCodeDigits = (course) => {
    const digitsMatch = course.code.match(/[0-9]+/g);
    if (!digitsMatch) {
      throw new Error(`Bad course code: ${course.code}`);
    }
    return digitsMatch[0];
  };
  
  export const courseComparator = (a, b) => {
    return courseCodeComparator(a.code, b.code);
  };
  
  export const courseCodeComparator = (a, b) => {
    const [aSubject, aNumber] = a.split(" ");
    const [bSubject, bNumber] = b.split(" ");
    if (aSubject !== bSubject) {
      return aSubject.localeCompare(bSubject);
    }
    const aInt = parseInt(aNumber);
    const bInt = parseInt(bNumber);
    if (aInt !== bInt) {
      return aInt - bInt;
    }
    return aNumber.localeCompare(bNumber);
  };
  
  export const slugifyCourseCode = (code) =>
    encodeURIComponent(code.replace(/ /g, "_").replace(/\u2013/g, "-"));
  