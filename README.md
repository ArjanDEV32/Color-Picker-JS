# A ColorPicker in JavaScript

this module is a class with which you can make a colorpicker:
```typescript
class ColorPicker{
  parent: htmlElement //parent element of the color-picker
  initialColor: string // itial color of the color-picker
  name: string // name of the color-picker
  colorFormat: string // color format of color-picker which are "RGBA", "HSLA" and "HEX"
  layout: array[object]// layout of color-picker components
  draggable: boolean // makes the color-picker draggable
  width: number // width of the color-picker
  styleSheet: object[string] // a stylesheet for the components of the color-picker 
  intialClipBoardSwatches: array[string] // initial swacthes within the clipboard 
}
```

### layout

`layout` is an array of objects and those objects are components that determine the structure of the color-picker. 

these components are:
* `modal`: color gradient surface.

* `textInputField`: container for the text input.
  * `textInput`
  * `colorDisplay`

* `clipboard`: a color clipboard.
  * `clipBoardField`: container for the clipboard text-input.
    * `clipBoardTextInput`: text-input for the clipboard container. 
  * `clipBoardSwatchContainer`: container for clipboard swatches. 

* `ranges` : container for color sliders.
  * `hueRange`: slider that controls the hue of the current color.
  * `opacityRange`: slider that controls the opacity of the current color.

* `custom`: custom container that can be any html element.

### example
```javascript
[
  {type:"modal"},
  {type:"textInputField",layout:[{type:"colorDisplay"},{type:"textInput"},]},
  {type:"clipBoard",style:"width:200px;",layout:[
    {type:"clipBoardInputField",layout:[{type:"clipBoardTextInput"}]},
    {type:"clipBoardSwatchContainer",swatchLimit:20}
  ]},
  {type:"ranges", layout:[{type:"hueRange"},{type:"opacityRange"}]},
  {type:"custom",data:container},
]
```

### styleSheet
similar to layout, but it's instead an object of conponents
where each component is a string of custom `css` styles.

### example 
```javascript
:{
  BG:"width:210px; background-color:white;",
  dragBar:"width:210px; background-color:rgb(235,235,235);",
  modal:"width:200px; height:100px; border-radius:5px;",
  textInputField:"width:200px;",
  colorDisplay:"margin-right:10px;",
  textInput:"color:black; box-shadow:1px 20px rgba(25, 25, 25, 0); outline:none;border-radius: 5px;text-align:center;width:75%;background-color:rgb(235,235,235); border:none; height:25px;",
  clipBoard:"width:200px;",
  clipBoardInputField:"width:200px; height:40px;",
  clipBoardTextInput:"outline:none; border-radius: 5px;width:100%;background-color:rgb(235,235,235); border:none;text-align:center;height:25px;rgb(25,25,40);",
  clipBoardSwatchContainer:"width:200px; box-shadow:1px 1px 50px rgba(23, 23, 23, 0.3); max-height:100px;",
  ranges:"width:200px; height:40px;",
  clipBoardSwatch:"width:15px;height:15px;",
  clipBoardSwatchCapsule:"width:30px;height:30px;box-shadow: 1px 1px 10px rgba(23, 23, 23, 0.3);"
}
```

this class also consist of 2 function:
```javascript
function init() // initializes the color-picker
```

```typescript
function update(styleSheet:object) // updates the style of the color-picker
```

in order to recieve color data from the color-picker you must add an eventlistener to the document who's type should be the name that you've given to the color-picker.
### example
```javascript
document.addEventListener("colorpicker",(e)=>{
  component.style.backgroundColor = e.detail.rgba
})
```

in order to update the color-picker state with your own color input 
you must create a custom event who's type should be "update-" + (the name you've given to the color-picker). 

### example
```javascript
let InputColor = new CustomEvent("update-colorpicker",{detail:{input:"orange"}})
document.dispatchEvent(InputColor)
```

## Download
```
npm i arjandev32-color-picker
```

in order to use add the code below in your html
```html
  <link rel="stylesheet" href="cp.css"/>
  <script type="module" src="cp.js" defer></script>
```
