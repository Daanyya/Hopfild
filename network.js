//Константы отображения интерфейса
const NUMBER_OF_INPUTS = 25;
const NUMBER_OF_PIXELS_IN_LINE = 5;
const PIXEL_SIZE = 50;

//Dataset
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

//Матрица весов
const INPUTS = new Array(NUMBER_OF_INPUTS).fill(0);
//Класс для управления элементом матрицы ввода
class InputPixel {
  constructor(number) {
    this.number = number;
    this.isSelected = false;
  }
  //Сделать пиксель активным
  pick() {
    this.isSelected = !this.isSelected;
  }
  //Сделать пиксель не активным 
  reset() {
    this.isSelected = false;
  }
  //Раскраска пикселя 
  display(elementOnPage) {
    if (this.isSelected) {
      elementOnPage.style.background = '#444444';
    } else {
      elementOnPage.style.background = '#ffffff';
    }
  }
}
//Инициализация матрицы ввода
for (let i = 0; i < INPUTS.length; i++) {
  INPUTS[i] = new InputPixel(i);
}
//Элементы HTML
let input = document.querySelector('#input');
//HTML элемент результирующей матрицы
let output = document.querySelector('#output');
//Кнопка очистки матрицы ввода
let clearButtonElement = document.querySelector('#clear-button');
clearButtonElement.addEventListener('click', function() {
  INPUTS.forEach(pixel => {
    pixel.reset();
    pixel.display(document.querySelector(`#pixel${pixel.number}`));
    output.innerHTML = "";
  });
});
document.querySelector('#recognize-button').addEventListener('click', function() {
  recognize();
});

//Отображение матрицы ввода
//Для каждого входного сигнала
INPUTS.forEach(pixel => {
  //Создание основного элемента
  let pixelElement = document.createElement('p');
  pixelElement.id = `pixel${pixel.number}`;
  pixelElement.className = "input-pixel pixel";
  input.appendChild(pixelElement);
  //Добавление элементу слушателя на событие click
  pixelElement.addEventListener('click', function() {
    //Изменение статуса элемента матрицы
    pixel.pick();
    //Отображение элемента матрицы
    pixel.display(document.querySelector(`#pixel${pixel.number}`));
  });
  //Отрисовать элемент
  pixel.display(pixelElement);
});





//Функция транспонирования матрицы
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
//Функция умножения матрицы на матрицу
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


//Функция предсказания
function recognize() {
  //Для каждого входного сигнала с матрицы ввода
  INPUTS.forEach(pixel => {
    //Кодирование входных сигналов -1 и 1 в матрицу входных сигналов
    if (pixel.isSelected){
      inputData[0][pixel.number] = 1;
    } else {
      inputData[0][pixel.number] = -1;
    }
  });
  //Умножение весов, полученных в результате обучения на транспонированную матрицу входных сигналов
  let result = matrixMultiplication(weights, transpose(inputData));
  //Применение функции активации к каждому элементу результирующей матрицы
  for (let i = 0; i < result.length; i++) {
    result[i][0] = sign(result[i][0]);
  }
  //Очистка HTML элемента результирующей матрицы
  output.innerHTML = "";
  //Для каждого элемента результирующей матрицы
  result.forEach(outputPixel => {
    //Создание основного элемента
    let outputPixelElement = document.createElement('p');
    outputPixelElement.className = "output-pixel pixel";
    //Отображение элемента матрицы
    if (outputPixel[0] == 1) {
      outputPixelElement.style.background = "#444444";
    }
    output.appendChild(outputPixelElement);
  });
}

//Функция активации
function sign(x) {
  if (x >= 0) return 1;
  else return -1;
}

//Реализация сети Хопфилда
//Инициализация весов 0
let weights = new Array(NUMBER_OF_INPUTS);
for (let i = 0; i < weights.length; i++) {
  weights[i] = new Array(NUMBER_OF_INPUTS);
  for (let j = 0; j < weights[i].length; j++) {
    weights[i][j] = 0;
  }
}
//Обучение
//Для каждого dataset
DATASET.forEach(sample => {
  //Транспонирование входной матрицы
  let transposedSample = transpose(sample);
  //Умножение транспонированной матрицы на исходную матрицу
  let resultForSample = matrixMultiplication(transposedSample, sample);
  //Суммирование весов
  for (let i = 0; i < resultForSample.length; i++) {
    for (let j = 0; j < resultForSample[0].length; j++) {
      weights[i][j] += resultForSample[i][j];
    }
  }
});
//Умножение матрицы на коэффициент 1 / NUMBER_OF_INPUTS
for (let i = 0; i < weights.length; i++) {
  for (let j = 0; j < weights[i].length; j++) {
    weights[i][j] *= 1 / NUMBER_OF_INPUTS;
  }
}

let inputData = [];
inputData[0] = [];