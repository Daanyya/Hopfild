//! BASIC CONFIGURATION
const NUMBER_OF_INPUTS = 25;
const NUMBER_OF_PIXELS_IN_LINE = 5;
const PIXEL_SIZE = 50;

//! INPUTS
const INPUTS = new Array(NUMBER_OF_INPUTS).fill(0);
class InputPixel {
  constructor(number) {
    this.number = number;
    this.isSelected = false;
  }
  //? pixel onclick
  pick() {
    this.isSelected = !this.isSelected;
  }
  reset() {
    this.isSelected = false;
  }
  //? display pixel as transmitted element on page 
  display(elementOnPage) {
    if (this.isSelected) {
      elementOnPage.style.background = '#444444';
    } else {
      elementOnPage.style.background = '#ffffff';
    }
  }
}
// initializing inputs
for (let i = 0; i < INPUTS.length; i++) {
  INPUTS[i] = new InputPixel(i);
} 
// get the page element contains all pixels
let input = document.querySelector('#input');
// displaying inputs
INPUTS.forEach(pixel => {
  // creating new element for each pixel and putting it inside the container on page
  let pixelElement = document.createElement('p');
  pixelElement.id = `pixel${pixel.number}`;
  pixelElement.className = "input-pixel pixel";
  input.appendChild(pixelElement);
  // ading listener for each pixel element to make it clickable
  pixelElement.addEventListener('click', function() {
    pixel.pick();
    pixel.display(document.querySelector(`#pixel${pixel.number}`));
  });
  // displaying each pixel with right color
  pixel.display(pixelElement);
});
// clear button listener
let clearButtonElement = document.querySelector('#clear-button');

let output = document.querySelector('#output');

clearButtonElement.addEventListener('click', function() {
  INPUTS.forEach(pixel => {
    pixel.reset();
    pixel.display(document.querySelector(`#pixel${pixel.number}`));
    output.innerHTML = "";
  });
});

//! DATASET
const DATASET = [
  [[-1,-1,-1,-1,-1,
    -1,-1, 1,-1,-1,
    -1, 1, 1, 1,-1,
    -1,-1, 1,-1,-1,
    -1,-1,-1,-1,-1]], //+
  [[ 1, 1,-1,-1,-1,
     1,-1,-1,-1,-1,
     1,-1,-1,-1,-1,
     1,-1,-1,-1,-1,
     1, 1,-1,-1,-1]], // [
  [[-1,-1,-1,-1, 1,
    -1,-1,-1, 1,-1,
    -1,-1, 1,-1,-1,
    -1, 1,-1,-1,-1,
     1,-1,-1,-1,-1]], // /
];

//! MATH UTILS
function transpose(matrix) {
  let rows = matrix.length;
  let cols = matrix[0].length;
  let result = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j] = [];
      result[j][i] = matrix[i][j];
    }
  }
 return result;
}
function matrixMultiplication(matrix1, matrix2) {
  let matrix = [];
  for (let i = 0; i < matrix1.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < matrix2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < matrix1[0].length; k++) {
        sum += matrix1[i][k] * matrix2[k][j];
      }
      matrix[i][j] = sum;
    }
  }
  return matrix;
}


//! NETWORK
// init weight with zero value
let weights = new Array(NUMBER_OF_INPUTS);
for (let i = 0; i < weights.length; i++) {
  weights[i] = new Array(NUMBER_OF_INPUTS);
  for (let j = 0; j < weights[i].length; j++) {
    weights[i][j] = 0;
  }
}
// training
DATASET.forEach(sample => {
  let transposedSample = transpose(sample);
  let resultForSample = matrixMultiplication(transposedSample, sample);
  for (let i = 0; i < resultForSample.length; i++) {
    for (let j = 0; j < resultForSample[0].length; j++) {
      weights[i][j] += resultForSample[i][j];
    }
  }
});
for (let i = 0; i < weights.length; i++) {
  for (let j = 0; j < weights[i].length; j++) {
    weights[i][j] *= 1 / NUMBER_OF_INPUTS;
  }
}
let inputData = [];
inputData[0] = [];
document.querySelector('#recognize-button').addEventListener('click', function() {
  recognize();
});
function recognize() {
  INPUTS.forEach(pixel => {
    if (pixel.isSelected){
      inputData[0][pixel.number] = 1;
    } else {
      inputData[0][pixel.number] = -1;
    }
  });
  let result = matrixMultiplication(weights, transpose(inputData));
  for (let i = 0; i < result.length; i++) {
    result[i][0] = sign(result[i][0]);
  }
  output.innerHTML = "";
  result.forEach(outputPixel => {
    let outputPixelElement = document.createElement('p');
    outputPixelElement.className = "output-pixel pixel";
    if (outputPixel[0] == 1) {
      outputPixelElement.style.background = "#444444";
    }
    output.appendChild(outputPixelElement);
  });
}

function sign(x) {
  if (x >= 0) return 1;
  else return -1;
}
