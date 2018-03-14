# sliderFactory

Pre-styled SVG sliders created using version 4 of Mike Bostock's d3 library. Each slider needs a div to act as a placeholde to be called into. An SVG element is appended to the div and contains all the slider geometry.


### Prerequisites
You will need the [d3 library](https://d3js.org/) installed

## Installing
### Manually install

Download the repository. Move the sliders.js and styles.css into your project folder. To link the slider function and styles to your project insert the following code into your index.html header.
```
<script src="./slider.js"></script>
<link rel="stylesheet" type="text/css" href="./sliders.css">
```

### NPM install
This is not yet available

## Positioning

Horizontal slders are appended within an SVG element. All the gemoetry is held within  a 'g' element that is translated to x=zero+margin.left, y=zero plus the top margin. The default SVG height is set to 55px and margin.top is set at 20px, enough room for the handle and a scale underneath. When adding labels (Slider 4) you should adjust the height and margin.top. There is also a default margin.right parameter of 20px.

![alt tag](https://bobhaslett.github.io/d3-v4-sliders/images/slider.png)

Vertical sliders are appended at x=width/2+left.margin. This makes them easier to control when they are made responsive. They also need a larger top.margin when a label is added (slider4). This example is with a div that is 400px wide, margin,top(40) and margin.bottom(20)

![alt tag](https://bobhaslett.github.io/d3-v4-sliders/images/vertical.png)

## Examples

Wworking examples [here](https://bobhaslett.github.io/d3-v4-sliders/index.html). Includes how to make function calls and examples of working responsive sliders

### Slider1: default slider
```
const slider1 = sliderFactory();
let slideholder1 = d3.select('#holder1').call(slider1);
```
![alt tag](https://bobhaslett.github.io/d3-v4-sliders/images/slider1.png)

### Slider2: Adds a scale and sets .tick(30) so there are only two ticks
```
const slider2 = sliderFactory();
let slideholder2 = d3.select('#holder2').call(slider2.ticks(30).scale(true).range([0,30]) );
```
![alt tag](https://bobhaslett.github.io/d3-v4-sliders/images/slider2.png)

### Slider3: Using the .step() parameter to increment the handle moves by to 0.1
```
let slideholder3 = d3.select('#holder3').call(slider3.ticks(1).scale(true).range([0,4]).step(0.1));
```
### Slider4: Add labels and preset the value to 3
```
let slideholder4 = d3.select('#holder4').call(slider4.height(70).margin({top: 35, right: 15, bottom: 15, left: 15 }).value(30).ticks(10).scale(true).range([0,80]).step(1).label(true));
```
![alt tag](https://bobhaslett.github.io/d3-v4-sliders/images/slider4.png)

### Slider5: Vertical slider with label and scale
```
let slideholder5 = d3.select('#holder5').call(slider5.width(80).margin({top: 40, right: 15, bottom: 35, left: 15 }).height(300).scale(true).ticks(20).label(true).value(80).range([0,80]).orient("vertical").dragHandler(function(d) {test(d);}));
```
![alt tag](https://bobhaslett.github.io/d3-v4-sliders/images/slider5.png)

## Authors
* **Bob Haslett** - *Initial work*

## Acknowledgments

* Mike Bostock's [Drag slider](https://bl.ocks.org/mbostock/6452972)
* Inspiration- [D3 js slider](https://github.com/MasterMaps/d3-slider)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
