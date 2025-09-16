(() => {
  // Extract visible text from the page
  let text = document.body.innerText;
  return text.slice(0, 4000); // limit characters to avoid API overload
})();
