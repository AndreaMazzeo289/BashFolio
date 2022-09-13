const bash = document.querySelector("#bash");
const bashContent = document.querySelector("#bash-content");

import jsonData from './../json/data.json' assert {type: 'json'};

const delay = ms => new Promise(res => setTimeout(res, ms));

/****************************************************************
 * EVENT LISTENER
*****************************************************************/
bash.addEventListener("keypress", async function(event)
{
  if(event.key === "Enter")
  {
    await delay(150);
    handleNewCommand();
  }
});

bash.addEventListener("click", function(event)
{
  const input = document.querySelector("input");
  if (input) input.focus();
});

/****************************************************************
 * START APPLICATION
*****************************************************************/
async function startBash()
{
  createText("Welcome to BashFolio v1995.09!");
  await delay(700);
  createText("Type <span class='lightblue-text'>\"help\"</span> to see available commands.");
  await delay(500);
  newLine();
}

/****************************************************************
 * PARSE THE INPUT COMMAND
*****************************************************************/
async function handleNewCommand()
{
  const [valid, readCommand, command] = getInputCommand();

  removeOldHeadingLine();
  
  if (valid)
  {
    newLineCommandOK(readCommand);
    handleCommand(command);
  }
  else
  {
    newLineCommandKO(readCommand);
    handleWrongCommand(readCommand);
  }

  newLine();
}

function getInputCommand()
{  
  const readCommand = document.querySelector("input").value;
  const command = readCommand.toLocaleLowerCase();
  const valid = validateCommand(command);
  return [valid, readCommand, command];
}

function validateCommand(command) 
{
  const projects = Object.keys(jsonData.projects);
  const papers = Object.keys(jsonData.papers);
  let availableCommands = [...jsonData.commands, ...projects, ...papers];

  return availableCommands.includes(command);
}

function handleCommand(command)
{
  if (command === "help")
  {
    createText("Available commands listed below. Type <span class='lightblue-text'>\"cls\"</span> to clear terminal.");
    printCommands();
  }
  else if (command === "projects")
  {
    createText("Type the project name to see details.");
    printProjects();
  }
  else if (command === "publications")
  {
    createText("Type the name of the publication to see details.");
    printResearch();
  }
  else if (command === "about me")
  {
    createText("In ipsum dolore do voluptate duis magna excepteur occaecat. Est adipisicing aliqua proident eu ut ex incididunt. Cillum enim consectetur sit deserunt Lorem reprehenderit tempor eiusmod laborum nostrud deserunt pariatur irure. Aute sunt reprehenderit occaecat aute incididunt. Minim consequat dolore veniam magna ad in magna est dolor ad do.");
  }
  else if (command === "social")
  {
    createText("<a class='social-link' href='https://github.com/AndreaMazzeo289' target='_blank'><i class='fab fa-github white'></i> github.com/AndreaMazzeo289</a>")
    createText("<a class='social-link' href='https://www.linkedin.com/in/andreamazzeo289/' target='_blank'><i class='fab fa-linkedin-in white'></i> linkedin.com/in/andreamazzeo289</a>")
    createText("<a class='social-link' href='https://www.instagram.com/andremazzeo95/' target='_blank'><i class='fab fa-instagram white'></i> instagram.com/andreamazzeo95</a>")
  }
  else if (command === "resume")
  {
    createText("Downloading resume.");
    downloadFile("./assets/docs/resume.pdf", "Resume_AndreaMazzeo.pdf");
  }
  else if (command === "cls")
  {
    bashContent.querySelectorAll("div").forEach(e => e.parentNode.removeChild(e));
    bashContent.querySelectorAll("p").forEach(e => e.parentNode.removeChild(e));
  }
  else if (isProject(command))
  {
    showProjectInfo(jsonData.projects[command]);
  }
  else if (isPublication(command))
  {
    showPublicationInfo(jsonData.papers[command]);
  }
}

function handleWrongCommand(command)
{
  createText(`Command not found: <span class="lightblue-text">${command}</span>`);
}

/****************************************************************
 * HANDLE DOM
*****************************************************************/
function newLine()
{ 
  let div = getLineHeading();
  const input = document.createElement("input");
  div.appendChild(input);
  bashContent.appendChild(div);
  input.focus();
}

function newLineCommandOK(command)
{
  const div = getLineHeading(false, false);
  writeCommand(div, command);
}

function newLineCommandKO(command)
{
  const div = getLineHeading(false, true);
  writeCommand(div, command);
}

function writeCommand(div, value)
{
  const p = document.createElement("span");
  p.textContent = `${value}`;
  p.setAttribute("class", "input-value");
  div.appendChild(p);
  bashContent.appendChild(div);
}

function getLineHeading(newCommand = true, error = false)
{ 
  const div = document.createElement("div");
  let headingStyle = "line-heading ";
  headingStyle += newCommand ? "new" : "done";
  div.setAttribute("class", headingStyle);

  // >
  const i = document.createElement("i");
  let arrowStyle = "fas fa-angle-right arrow-icon ";
  arrowStyle += error ? "icon-error" : "icon-ok";
  i.setAttribute("class", arrowStyle);
  div.appendChild(i);

  // root
  const rootSpan = document.createElement("span");
  rootSpan.setAttribute("class", "darkred-text");
  rootSpan.textContent = "root";
  div.appendChild(rootSpan);

  // @AndreaMazzeo289 $
  const nameSpan = document.createElement("span");
  nameSpan.setAttribute("class", "darkyellow-text");
  nameSpan.textContent = "@AndreaMazzeo289 $";
  div.appendChild(nameSpan);

  return div;
}

function removeOldHeadingLine()
{
  const div = document.querySelector(".line-heading.new");
  bashContent.removeChild(div);
}

function createText(text)
{
  const p = document.createElement("p");
  p.innerHTML = text;
  bashContent.appendChild(p);
}

function printListItem(text, colorClass)
{ 
  const div = document.createElement("div");
  div.setAttribute("class", "list-item");

  const i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-right arrow-icon icon-list");
  div.appendChild(i);

  const anchor = document.createElement("a");
  anchor.setAttribute("class", colorClass);
  anchor.setAttribute("href", "#");
  anchor.addEventListener("click", function() {
    const input = document.querySelector("input");
    input.value = text;
  });
  anchor.textContent = text;
  div.appendChild(anchor);

  bashContent.appendChild(div);
}

function downloadFile(url, fileName) {
  fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
    .then(res => res.blob())
    .then(res => {
      const aElement = document.createElement('a');
      aElement.setAttribute('download', fileName);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      aElement.setAttribute('target', '_blank');
      aElement.click();
      URL.revokeObjectURL(href);
    });
};

function showProjectInfo(data)
{
  const div = document.createElement("div");
  div.setAttribute("class", "project-container");
  
  const h1 = document.createElement("h1");
  h1.textContent = data.name;

  const img = document.createElement("img");
  const imgSource = "./assets/img/projects/" + data.media + ".png";
  img.setAttribute("src", imgSource);

  const overviewH2 = document.createElement("h2");
  overviewH2.textContent = "Overview";

  const p = document.createElement("p");
  p.innerText = data.description;

  const divIcons = document.createElement("div");
  divIcons.setAttribute("class", "icons-container");

  const techH2 = document.createElement("h2");
  techH2.textContent = "Tech used:";

  for (let el in data.icons)
  {
    const span = document.createElement("span");
    const icon = document.createElement("img");
    const iconSource = "./assets/img/tech/" + data.icons[el] + ".svg";
    icon.setAttribute("src", iconSource);
    span.appendChild(icon);
    divIcons.appendChild(span);
  }

  div.appendChild(h1);
  div.appendChild(img);
  div.appendChild(overviewH2);
  div.appendChild(p);
  div.appendChild(techH2);
  div.appendChild(divIcons);

  bashContent.appendChild(div);
}

function showPublicationInfo(data)
{
  const div = document.createElement("div");
  div.setAttribute("class", "project-container");

  const h1 = document.createElement("h1");
  h1.textContent = data.name;

  const published = document.createElement("p");
  published.innerText = data.published;
  
  const abstract = document.createElement("p");
  abstract.innerText = data.abstract;

  div.appendChild(h1);
  div.appendChild(published);
  div.appendChild(abstract);
  bashContent.appendChild(div);
}

function printCommands()
{
  jsonData.commands.forEach(element => {
    printListItem(element, "lightblue-text");
  });
}

function printProjects() 
{
  const projects = Object.keys(jsonData.projects);
  projects.forEach(key => {
    printListItem(jsonData.projects[key].name, "lightgreen-text");
  });
}

function printResearch() 
{
  const papers = Object.keys(jsonData.papers);
  papers.forEach(key => {
    printListItem(jsonData.papers[key].shortName, "lightgreen-text");
  });
}

function isProject(command)
{
  const projects = Object.keys(jsonData.projects);
  return projects.includes(command);
}

function isPublication(command) 
{
  const papers = Object.keys(jsonData.papers)
  return papers.includes(command);
}

startBash();