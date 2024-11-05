
import { ColorPicker } from "./cp.js"

const btn2 = document.getElementById("parent")
const test = document.getElementById("test")
const light = document.getElementById("light")
const dark = document.getElementById("dark")
const container = document.createElement("div")

container.style.display="flex"
container.style.justifyContent="center"
container.style.alignItems="center"
container.style.flexWrap = "wrap"
container.style.width = "200px"
container.style.height = "100px"
container.style.overflow = "auto"
container.style.marginBottom = "10px"

for(let i =0;i<40;i++){
  let b = document.createElement("div")
  b.style.width= "20px"
  b.style.height= "20px"
  b.style.borderRadius = "20px"
  b.style.margin = "5px"
  b.style.cursor = "pointer"
  b.style.backgroundColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
  b.addEventListener("click",()=>{
    let InputColor = new CustomEvent("update-clp1",{detail:{input:b.style.backgroundColor}})
    document.dispatchEvent(InputColor)
  })
  container.appendChild(b) 
}


 let CLP1 = new ColorPicker({
  parent:btn2,
  colorFormat:"RGBA",
  name:"clp1",
  initialColor:"pink",
  draggable:true,
  styleSheet:{
    BG:"width:210px; background-color:white;",
    dragBar:"width:210px; background-color:rgb(235,235,235);",
    modal:"width:200px; height:100px; border-radius:5px;",
    textInputField:"width:200px;",
    colorDisplay:"margin-right:10px;",
    textInput:"box-shadow:1px 20px rgba(25, 25, 25, 0); outline:none;border-radius: 5px;text-align:center;width:75%;background-color:rgb(235,235,235); border:none; height:25px; color:rgb(25,25,40);",
    clipBoard:"width:200px;",
    clipBoardInputField:"width:200px; height:40px;",
    clipBoardTextInput:"outline:none; border-radius: 5px;width:100%;background-color:rgb(235,235,235); border:none;text-align:center;height:25px;rgb(25,25,40);",
    clipBoardSwatchContainer:"width:200px; box-shadow:1px 1px 50px rgba(23, 23, 23, 0.3); max-height:100px;",
    ranges:"width:200px; height:40px;",
    clipBoardSwatch:"width:15px;height:15px;",
    clipBoardSwatchCapsule:"width:30px;height:30px;box-shadow: 1px 1px 10px rgba(23, 23, 23, 0.3);"
  },
  layout:[
    {type:"modal"},
    {type:"custom",data:container},
    {type:"textInputField",layout:[{type:"colorDisplay"},{type:"textInput"},]},
    {type:"clipBoard",style:"width:200px;",layout:[
      {type:"clipBoardInputField",layout:[{type:"clipBoardTextInput"}]},
      {type:"clipBoardSwatchContainer",swatchLimit:20}
    ]},
    {type:"ranges", layout:[{type:"hueRange"},{type:"opacityRange"}]},
  ]
 })

  CLP1.init()

  document.addEventListener("clp1",(e)=>{
    test.style.backgroundColor = e.detail.rgba
  })


dark.addEventListener("click",()=>{
  CLP1.update({ 
    BG:"width:210px; background-color:rgb(35,45,45);",
    dragBar:"width:210px; background-color:rgb(235,235,235);background-color:rgb(45,55,55);",
    modal:"width:200px; height:100px; border-radius:5px;",
    textInputField:"width:200px;",
    colorDisplay:"margin-right:10px;",
    textInput:"color:white; box-shadow:1px 20px rgba(25, 25, 25, 0); outline:none;border-radius: 5px;text-align:center;width:75%;background-color:rgb(45,55,55); border:none; height:25px;",
    clipBoard:"width:200px;",
    clipBoardInputField:"width:200px; height:40px;",
    clipBoardTextInput:"color:white; outline:none; border-radius: 5px;width:100%;background-color:rgb(45,55,55); border:none;text-align:center;height:25px;rgb(25,25,40);",
    clipBoardSwatchContainer:"width:200px; box-shadow:1px 1px 50px rgba(23, 23, 23, 0.3); max-height:100px;",
    ranges:"width:200px; height:40px;",
    clipBoardSwatch:"width:15px;height:15px;",
    clipBoardSwatchCapsule:"width:30px;height:30px;box-shadow: 1px 1px 10px rgba(23, 23, 23, 0.3);"
  })
})

light.addEventListener("click",()=>{
  CLP1.update({ 
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
  })

})