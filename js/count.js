function htmlCount() {
  const htmlCount = document.querySelector("body").innerHTML;
  
  const lines = htmlCount.split("\n").map((line) => {
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

   return codeLines.length - jsCount();
}

function cssCount() {
  let cssCount = "";
  if (document.querySelector("style")) {
    cssCount = document
      .querySelector("style")
      .textContent.trim()
      .replace(/\r\n/g, "\n");
  }

  if (!cssCount) {
    return 0;
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

  if (codeLines.length === undefined) {
    return 0;
  } else {
    return parseInt(codeLines.length);
  }
}

function jsCount() {
  let eachTagText = "";
  const jsCount = document.querySelectorAll("script");

  jsCount.forEach((v) => {
    if (!v.innerHTML.includes("refreshCSS()")) {
      eachTagText += v.textContent;
    }
  });

  const lines = eachTagText.split("\n").map((line) => {
    return line.trim();
  });

  let codeLines = lines.filter((line) => {
    return (
      line.length > 0 &&
      !line.startsWith("//") &&
      !line.startsWith("/*") &&
      !line.startsWith("*") &&
      !line.startsWith("*/")
    );
  });

  return parseInt(codeLines.length);
}

const displayer = document.querySelectorAll('.percentage span');

displayer[0].innerHTML = htmlCount() || 0;
displayer[1].innerHTML = cssCount() || 0;
displayer[2].innerHTML = jsCount() || 0;



