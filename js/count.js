function htmlCount() {
  const htmlCount = document.querySelector("body").textContent;

  const lines = htmlCount.split("\n").map((line) => {
    return line.trim();
  });

  const codeLines = lines.filter((line) => {
    return (
      line.length > 0 &&
      !line.startsWith("//") &&
      !line.startsWith("/*") &&
      !line.startsWith("*") &&
      !line.startsWith("*/") &&
      !line.startsWith("script")
    );
  });

  return codeLines.length - jsCount();
}

function cssCount() {
    try {
        
        const cssCount = document.querySelector("style").textContent;
    } catch (error) {
       console.log(error);
        
       if (!cssCount) {
         return;
       }
    }


  const lines = cssCount.split("\n").map((line) => {
    return line.trim();
  });

  const codeLines = lines.filter((line) => {
    return (
      line.length > 0 &&
      !line.startsWith("//") &&
      !line.startsWith("/*") &&
      !line.startsWith("*") &&
      !line.startsWith("*/")
    );
  });

  return codeLines.length;
}

function jsCount() {
  const jsCount = document.querySelectorAll("script")[1].textContent;

  const lines = jsCount.split("\n").map((line) => {
    return line.trim();
  });

  const codeLines = lines.filter((line) => {
    return (
      line.length > 0 &&
      !line.startsWith("//") &&
      !line.startsWith("/*") &&
      !line.startsWith("*") &&
      !line.startsWith("*/")
    );
  });

  return codeLines.length;
}

function caller() {
  return htmlCount() || 0 + cssCount() || 0 + jsCount() || 0;
}

console.log(caller());
