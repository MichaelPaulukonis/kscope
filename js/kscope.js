
/*  --------------------------------------------------------------------
    GLOBALS
    -------------------------------------------------------------------- */
  
function Tile (imageX, imageY, componentX, componentY, width, height, arrayX, arrayY) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.componentX = componentX;
    this.componentY = componentY;
    this.width = width;
    this.height = height;
    this.arrayX = arrayX;
    this.arrayY = arrayY;
}

var imageSliceData = [];

var imageList = [
    'images/A10470.jpg', 'images/A15353.jpg', 'images/polychrome.text.20190306.203330.png', 
'images/polychrome.text.20190306.202321.png', 'images/polychrome.text.20190306.203736.png',
'images/z1.jpg', 'images/z2.jpg', 'images/zardoz.gun.jpg',
 'images/Zardoz_704.jpg'
];

var imageListIndex = 0;

var baseImage = '';
var baseImageLoaded = false;

var kWidth = -1;
var kHeight = -1;
var displaySquareSize = 400;
var widthSquares = -1;
var heightSquares = -1;

const IMAGE_SHIFT_AMOUNT = 2;
var moveDirectionX = 'positive';
var moveDirectionY = 'positive';
var displayPaused = false;

/*  --------------------------------------------------------------------
    STANDARD PROCESSING/p5.js FUNCTIONS
    -------------------------------------------------------------------- */

function setup() {
  
    createCanvas(windowWidth - 25, windowHeight - 85);
    
    kWidth = (windowWidth - 25);
    kHeight = (windowHeight - 25);;
    widthSquares = (kWidth / displaySquareSize)  + 1;
    heightSquares = (kHeight / displaySquareSize) + 1;
  
    for (var x = 0; x < widthSquares; x++) {
        for (var y = 0; y < heightSquares; y++) {

            var tile = new Tile(0, 0, 
                                (x * displaySquareSize), (y * displaySquareSize), 
                                displaySquareSize, displaySquareSize, 
                                x, y);

            imageSliceData.push(tile);
        }  
    }
    
    baseImageLoaded = false;
    baseImage = loadImage(imageList[imageListIndex], render);
}

function draw() {
    
    if (baseImageLoaded == true) {
    
        var tile = imageSliceData[0];  
        
        var xOrY = Math.floor(Math.random() * 2);
        
        if (xOrY == 0) {
            if (moveDirectionX == 'positive') {
                tile.imageX = tile.imageX + IMAGE_SHIFT_AMOUNT;
            }
            else {
                tile.imageX = tile.imageX - IMAGE_SHIFT_AMOUNT;
            }
        }
        else {
            if (moveDirectionY == 'positive') {
                tile.imageY = tile.imageY + IMAGE_SHIFT_AMOUNT;
            }
            else {
                tile.imageY = tile.imageY - IMAGE_SHIFT_AMOUNT;
            }
        }
        
        if (tile.imageX < 0) {
            tile.imageX = 0;
            moveDirectionX = 'positive';
        }
        
        if (tile.imageY < 0) {
            tile.imageY = 0;
            moveDirectionY = 'positive';
        }
        
        if (tile.imageX > baseImage.width - tile.width/2- 1) {
            tile.imageX = baseImage.width - tile.width/2 - 1;  
            moveDirectionX = 'negative';
        }
        if (tile.imageY > baseImage.height - tile.height/2 - 1) {
            tile.imageY = baseImage.height - tile.height/2 - 1; 
            moveDirectionY = 'negative'; 
        }
        
        if (tile.imageX < 0) {
            tile.imageX = 0;
            moveDirectionX = 'positive';
        }
        
        if (tile.imageY < 0) {
            tile.imageY = 0;
            moveDirectionY = 'positive';
        }

        render();
    }
}

/*  --------------------------------------------------------------------
    MACHINERY TO ACTUALL DRAW THE IMAGE
    -------------------------------------------------------------------- */

function render() {
    
    baseImageLoaded = true;
    
    var firstTile = imageSliceData[0];
    
    var subImage = baseImage.get(firstTile.imageX, firstTile.imageY, firstTile.width / 2, firstTile.height / 2);
    
    var upsideDownImage = turnImageUpsideDown(subImage);
    var sidewaysImage = turnImageSideways(subImage);
    var upsideDownSidewaysImage = turnImageSideways(upsideDownImage);
    var resultImage = assembleTransform1(subImage, sidewaysImage, upsideDownImage, upsideDownSidewaysImage);
    
    for (var a = 0; a < imageSliceData.length; a++) {

        var tile = imageSliceData[a]

        image(resultImage, tile.componentX, tile.componentY);
    }
}

function turnImageUpsideDown(inImage) {
    
    var resultImage = createImage(inImage.width, inImage.height);

    if (!inImage.loadPixels) debugger

    inImage.loadPixels();
    resultImage.loadPixels();
    
    for (var y = 0; y < inImage.height; y++) {
        for (var x = 0; x < inImage.width; x++) {
            
            var inImageI = (y * inImage.width * 4) + (x * 4);
            var resultImageI = ((inImage.height - 1 - y) * inImage.width * 4) + (x * 4);
            
            for (var a = 0; a < 4; a++) {
                resultImage.pixels[resultImageI + a] = inImage.pixels[inImageI + a];
            }
        }
    }
    
    resultImage.updatePixels();

    return resultImage;
}

function turnImageSideways(inImage) {

    var resultImage = createImage(inImage.width, inImage.height);

    inImage.loadPixels();
    resultImage.loadPixels();

    for (var x = 0; x < inImage.width; x++) {
        for (var y = 0; y < inImage.height; y++) {
            
            var inImageI = (y * inImage.width * 4) + (x * 4);
            var resultImageI = (y * inImage.width * 4) + ((inImage.width - 1 - x) * 4);
            
            for (var a = 0; a < 4; a++) {
                resultImage.pixels[resultImageI + a] = inImage.pixels[inImageI + a];
            }
        }
    }

    resultImage.updatePixels();

    return resultImage;
}

function assembleTransform1(subImage,
                            sidewaysImage,
                            upsideDownImage,
                            upsideDownSidewaysImage) {

    var resultImage = createImage(subImage.width * 2, subImage.height * 2);

    resultImage.loadPixels();

    for (var x = 0; x < subImage.width; x++) {
        for (var y = 0; y < subImage.height; y++) {
            
            var inImageI =      (y * subImage.width * 4) + 
                                    (x * 4);
            var resultImageI =  (y * resultImage.width * 4) + 
                                    (x * 4);
            
            for (var a = 0; a < 4; a++) {
                resultImage.pixels[resultImageI + a] = subImage.pixels[inImageI + a];
            }
        }
    }

    for (var x = 0; x < sidewaysImage.width; x++) {
        for (var y = 0; y < sidewaysImage.height; y++) {
            
            var inImageI =          (y * sidewaysImage.width * 4) + 
                                        (x * 4);
            var resultImageI =      (sidewaysImage.width * 4) + 
                                        (y * resultImage.width * 4) + 
                                        (x * 4);
            
            for (var a = 0; a < 4; a++) {
                resultImage.pixels[resultImageI + a] = sidewaysImage.pixels[inImageI + a];
            }
        }
    }
    
    for (var x = 0; x < upsideDownImage.width; x++) {
        for (var y = 0; y < upsideDownImage.height; y++) {
            
            var inImageI =      (y * upsideDownImage.width * 4) + 
                                    (x * 4);
            var resultImageI =  (resultImage.pixels.length / 2) +
                                    (y * resultImage.width * 4) + 
                                    (x * 4);
            
            for (var a = 0; a < 4; a++) {
                resultImage.pixels[resultImageI + a] = upsideDownImage.pixels[inImageI + a];
            }
        }
    }

    for (var x = 0; x < upsideDownSidewaysImage.width; x++) {
        for (var y = 0; y < upsideDownSidewaysImage.height; y++) {
            
            var inImageI =      (y * upsideDownSidewaysImage.width * 4) + 
                                    (x * 4);
            var resultImageI =  (resultImage.pixels.length / 2) +
                                (upsideDownSidewaysImage.width * 4) +
                                    (y * resultImage.width * 4) + 
                                    (x * 4);
            
            for (var a = 0; a < 4; a++) {
                resultImage.pixels[resultImageI + a] = upsideDownSidewaysImage.pixels[inImageI + a];
            }
        }
    }
        
    resultImage.updatePixels();

    return resultImage;
}

/*  --------------------------------------------------------------------
    
    -------------------------------------------------------------------- */

function mouseClicked() {

    if (displayPaused == true) {
        displayPaused = false;
        loop();
    }
    else {
        displayPaused = true;
        noLoop();
    }
}

function keyPressed() {
    
    noLoop();
    displayPaused = true
    
    imageListIndex = imageListIndex + 1;
    if (imageListIndex > imageList.length - 1) {
        imageListIndex = 0;
    }
    
    console.log(imageList[imageListIndex])

    baseImageLoaded = false;
    baseImage = loadImage(imageList[imageListIndex], render);
    
    for (var a = 0; a < imageSliceData.length; a++) {

        var tile = imageSliceData[a];  
        tile.imageX = 0;
        tile.imageY = 0;
    }
    
    displayPaused = false;
    loop();
}
