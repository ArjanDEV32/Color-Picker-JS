
export class ColorPicker{ 

  constructor(props){
    this.parent = props.parent
    this.initialColor = props.initialColor || "rgb(255, 0, 0)"
    this.name = props.name
    this.colorFormat = props.colorFormat || "RGBA"
    this.layout = props.layout
    this.draggable = props.draggable
    this.width = props.width
    this.styleSheet = props.styleSheet
    this.intialClipBoardSwatches = props.intialClipBoardSwatches  
  }

  Flags = {
    palletClicked:false,
    textInputOn:false,
    dragBarClicked:false,
    hasInit:false
  }

  presentComponents={}
  Components = {}
  ModalInfo = {}
  pc = document.createElement("div")
  HSV = []; HSL = []; RGBA = [];
  clipboardSwatchLimit = 20
  DBIP = {x:0,y:0}
  DBLP = {x:0,y:0}
  

  #rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) h = s = 0; 
    else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [ h*360, s*100, l*100 ];
  }

  #GetHSV(r,g,b){
    r/=255, g/=255, b/=255      
    let min = Math.min(r,g,b), max = Math.max(r,g,b), diff = max-min  
    let h,s,v
    if(max==min) h=0
    if (max == r) h = (60 * ((g - b) / diff) + 360)%360 
    if (max == g) h = (60 * ((b - r) / diff) + 120)%360 
    if (max == b) h = (60 * ((r - g) / diff) + 240)%360 
    if (max == 0) s = 0 
    else s = (diff / max) * 100 
    v = max * 100;
    return [Math.round(h),Math.round(s),Math.round(v)]
  }

  #GetHex(RGBA){
    let a = parseFloat(RGBA[3] || 1)
    let r = Math.floor(a * RGBA[0] + (1 - a) * 255)
    let g = Math.floor(a * RGBA[1] + (1 - a) * 255)
    let b = Math.floor(a * RGBA[2] + (1 - a) * 255)
    return "#" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2);
  }

  #hsv2hsl(h,s,v){
    s/=100, v/=100
    let l = v-v*s/2, m = Math.min(l, 1-l) 
    return [h, Math.min(Math.round(((v-l)/m)*100),100) || 0, Math.round(l*100)]        
  }

  #GetRGBA(s){ 
    let a = s.split(",") 
    return [parseInt(a[0].split("(")[1]),parseInt(a[1]),parseInt(a[2]),parseFloat(a[3]||1)]   
  }

  updateColorFormat(format){this.colorFormat = format, this.#FormatConversion()}

  #FormatConversion(){
    let Color
    switch(this.colorFormat){
      case "RGBA":
        Color = `rgba(${this.RGBA[0]},${this.RGBA[1]},${this.RGBA[2]},${this.RGBA[3]})`
        if(this.presentComponents[4]) this.Components.textInput.setAttribute("placeholder", `${Color}`) 
      break
      case "HSLA":
        Color = `hsla(${Math.round(this.HSL[0])}deg, ${Math.round(this.HSL[1])}%, ${Math.round(this.HSL[2])}%, ${this.RGBA[3]})`
        if(this.presentComponents[4]) this.Components.textInput.setAttribute("placeholder", `${Color}`)
      break
      case "HEX":
        Color = this.#GetHex(this.RGBA)
        if(this.presentComponents[4]) this.Components.textInput.setAttribute("placeholder", `${Color}`)
      break 
    }

    let CPLEvent = new CustomEvent(`${this.name}`, {
      detail:{
        rgba: window.getComputedStyle(this.Components.colorDisplay).backgroundColor,
        hsla:`hsla(${this.HSL[0]}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, ${this.RGBA[3]})`,
        hex:this.#GetHex(this.RGBA),
        hsva:`hsva(${this.HSV[0]}deg, ${this.HSV[1]}%, ${this.HSV[2]}%, ${this.RGBA[3]})`,
      }
    })
    document.dispatchEvent(CPLEvent)  
  }

  #UpdateCP(color){
   
    this.pc.style.color = color
    if(this.presentComponents[5]) this.Components.colorDisplay.style.backgroundColor = window.getComputedStyle(this.pc).color
 
    this.RGBA=this.#GetRGBA(window.getComputedStyle(this.Components.colorDisplay).backgroundColor)
    this.HSL=this.#rgbToHsl(this.RGBA[0],this.RGBA[1],this.RGBA[2])
    this.HSV=this.#GetHSV(this.RGBA[0],this.RGBA[1],this.RGBA[2])
  
    if(this.presentComponents[1])this.Components.modalBG.style.backgroundColor =`hsl(${this.HSL[0]}deg 100% 50%)`
    if(this.presentComponents[1])this.Components.modalBG.style.boxShadow=`1px 1px 20px hsla(${this.HSL[0]}deg, 100%, 50%, 0.2)`
 
    if(this.presentComponents[5])this.Components.colorDisplay.style.boxShadow =`1px 1px 12px hsla(${this.HSL[0]}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, 0.5)`
    if(this.presentComponents[5])this.Components.colorDisplay.style.backgroundImage = `linear-gradient(${window.getComputedStyle(this.pc).color}, ${window.getComputedStyle(this.pc).color}), url("./assets/cdBG.png")`

    if(this.presentComponents[2])this.Components.hueRange.value = this.HSL[0]
    if(this.presentComponents[3])this.Components.opacityRange.value = this.RGBA[3]
    if(this.presentComponents[3])this.Components.opacityRange.style.backgroundImage = `linear-gradient(-10deg,  ${window.getComputedStyle(this.pc).color}, rgba(0,0,0,0)),url("./assets/otb.png")`

    if(this.presentComponents[1])this.Components.pallete.style.backgroundColor = `hsl(${this.HSL[0]}deg ${this.HSL[1]}% ${this.HSL[2]}%)`
    if(this.presentComponents[1])this.Components.pallete.style.transform = `translate(
      ${((this.HSV[1]/100)*(this.Components.modalBG.clientWidth-this.Components.pallete.clientWidth))}px,
      ${(1-(this.HSV[2]/100))*this.Components.modalBG.clientHeight}px 
    )`

    if(this.presentComponents[1])this.Components.pallete.style.transition="all 500ms"     
    if(this.presentComponents[1])setTimeout(()=>{this.Components.pallete.style.transition="none"},550)   
    this.#FormatConversion()
  } 



  #UpdateRanges(hvalue, ovalue){
   
    if(this.presentComponents[3]) this.Components.opacityRange.style.backgroundImage = `linear-gradient(-10deg,  hsl(${hvalue}deg ${this.HSL[1]}% ${this.HSL[2]}%), rgba(0,0,0,0)),url("./assets/otb.png")`

    if(this.presentComponents[5]){ 
      this.Components.colorDisplay.style.backgroundColor=`hsla(${hvalue}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, ${ovalue})`
      this.Components.colorDisplay.style.backgroundImage = `linear-gradient(hsla(${hvalue}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, ${ovalue}),hsla(${hvalue}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, ${ovalue})), url("./assets/cdBG.png")`
      this.Components.colorDisplay.style.boxShadow=`1px 1px 12px hsla(${hvalue}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, 0.5)`
    }
    if(this.presentComponents[1]){ 
      this.Components.modalBG.style.backgroundColor=`hsl(${hvalue}deg 100% 50%)`
      this.Components.modalBG.style.boxShadow=`1px 1px 20px hsla(${hvalue}deg, 100%, 50%, 0.2)`
    }
    
    if(this.presentComponents[1]) this.Components.pallete.style.backgroundColor = `hsla(${hvalue}deg ${this.HSL[1]}% ${this.HSL[2]}%)`
    this.pc.style.color = `hsla(${hvalue}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, ${ovalue})`
    this.RGBA=this.#GetRGBA(window.getComputedStyle(this.pc).color)
    this.HSL=this.#rgbToHsl(this.RGBA[0],this.RGBA[1],this.RGBA[2])
    this.#FormatConversion()
  }

  #MovePallete(x,y){
   
    let S, V 

    if(this.presentComponents[1]){ 
      S = Math.abs(100 * (x / this.Components.modalFG.clientWidth))
      V =  Math.floor(100 * (1 - (y / this.Components.modalFG.clientHeight)))
    }

    this.HSL = this.#hsv2hsl(Number(this.HSL[0]),S,V)
   
    if(this.presentComponents[1])this.Components.pallete.style.transform = `translate(${Math.max(x-5,-5)}px,${Math.max(y-5,-5)}px)`
    if(this.presentComponents[1])this.Components.pallete.style.backgroundColor = `hsla(${this.HSL[0]}deg ${this.HSL[1]}% ${this.HSL[2]}%)`
  
    if(this.presentComponents[5])this.Components.colorDisplay.style.backgroundColor = `hsla(${this.HSL[0]}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, ${this.RGBA[3]})`
    if(this.presentComponents[5])this.Components.colorDisplay.style.backgroundImage = `linear-gradient(${window.getComputedStyle(this.Components.colorDisplay).backgroundColor}, ${window.getComputedStyle(this.Components.colorDisplay).backgroundColor}), url("./assets/cdBG.png")`
    if(this.presentComponents[5])this.Components.colorDisplay.style.boxShadow=`1px 1px 12px hsla(${this.HSL[0]}deg, ${this.HSL[1]}%, ${this.HSL[2]}%, 0.5)`
  
    if(this.presentComponents[3])this.Components.opacityRange.style.backgroundImage = `linear-gradient(-10deg,  hsl(${this.HSL[0]}deg ${this.HSL[1]}% ${this.HSL[2]}%), rgba(0,0,0,0)),url("./assets/otb.png")`
  
    if(this.presentComponents[5])this.RGBA=this.#GetRGBA(window.getComputedStyle(this.Components.colorDisplay).backgroundColor)
    this.HSV = [this.HSL[0],S,V]
    this.#FormatConversion()
  }

  #createSwatch(color){
    let clipBoardSwatchCapsule = document.createElement("div")
    let clipBoardSwatch = document.createElement("div")
    let clipBoardSwatchDeleteButton = document.createElement("div")
    clipBoardSwatchCapsule.appendChild(clipBoardSwatch)
    clipBoardSwatchCapsule.appendChild(clipBoardSwatchDeleteButton)
    this.Components.clipBoardSwatchContainer.appendChild(clipBoardSwatchCapsule)
    clipBoardSwatchCapsule.classList.add("CP-clipBoardSwatchCapsule")
    clipBoardSwatch.classList.add("CP-clipBoardSwatch")
    clipBoardSwatchDeleteButton.classList.add("CP-clipBoardSwatchDeleteButton")
    clipBoardSwatch.style = this.styleSheet["clipBoardSwatch"]
    clipBoardSwatchCapsule.style = this.styleSheet["clipBoardSwatchCapsule"]
    clipBoardSwatch.style.backgroundColor = color
    clipBoardSwatchDeleteButton.innerText = "X"
    clipBoardSwatch.style.boxShadow = `0 0 30px ${color}`
    clipBoardSwatch.addEventListener("click",()=>{this.#UpdateCP(clipBoardSwatch.style.backgroundColor)})
    clipBoardSwatchDeleteButton.addEventListener("click",()=>{this.Components.clipBoardSwatchContainer.removeChild(clipBoardSwatchDeleteButton.parentElement)})
  }

  init(){
    if(this.Flags.hasInit) return
    this.Flags.hasInit = true
    document.body.appendChild(this.pc)
    this.pc.style.color = this.initialColor
    this.RGBA = this.#GetRGBA(window.getComputedStyle(this.pc).color)
    this.HSL = this.#rgbToHsl(this.RGBA[0], this.RGBA[1], this.RGBA[2]) 
    
    this.Components.BG = document.createElement("div")
    this.Components.BG.classList.add("CP-BG")
    this.Components.BG.style = this.styleSheet["BG"]
    if(this.parent!=undefined ) this.parent.appendChild(this.Components.BG)
    else document.body.appendChild(this.Components.BG)
  

    if(this.draggable){
      let dragbar = document.createElement("div")
      dragbar.classList.add("CP-dragBar")
      dragbar.style = this.styleSheet["dragBar"]
      dragbar.setAttribute("title","This is draggable")
   
      dragbar.addEventListener("touchmove",(e)=>{e.preventDefault()})
      dragbar.addEventListener("pointerdown",(e)=>{
        this.Flags.dragBarClicked=true
        dragbar.style.cursor="grabbing"
        this.DBIP.x= e.clientX-this.DBLP.x
        this.DBIP.y= e.clientY-this.DBLP.y 
      })
  

      document.addEventListener("pointerup",(e)=>{
        if(this.Flags.dragBarClicked==true){ 
          this.DBLP.x= e.clientX - this.DBIP.x
          this.DBLP.y= e.clientY - this.DBIP.y
        }
        this.Flags.dragBarClicked=false
        dragbar.style.cursor="grab"
      })
  
      document.addEventListener("pointermove",(e)=>{
        if(this.Flags.dragBarClicked==true) this.Components.BG.style.transform =` translate(${e.clientX - this.DBIP.x}px,${e.clientY-this.DBIP.y}px)`
      })
      this.Components.dragBar = dragbar 
      this.Components.BG.appendChild(dragbar)
    }

    for(const elem of this.layout){
      switch(elem.type) {
        case "custom":
          this.Components.BG.appendChild(elem.data)
        break
        case "modal":
          let modalBG = document.createElement("div")
          let modalFG = document.createElement("div")
          let pallete = document.createElement("div")
          this.presentComponents[1] = 1
          this.Components.modal  = document.createElement("div")
          this.Components.modalBG =  modalBG
          this.Components.modalFG =  modalFG
          this.Components.pallete =  pallete

          this.Components.BG.appendChild(this.Components.modal)
          this.Components.modal.style = this.styleSheet[elem.type]
          this.Components.modal.appendChild(modalBG)
          this.Components.modal.appendChild(modalFG)
          modalBG.appendChild(pallete)

          this.Components.modal.classList.add("CP-modal")
          modalBG.classList.add("CP-modalBG")
          modalFG.classList.add("CP-modalFG")
          pallete.classList.add("CP-pallete")
          modalBG.style.width = "100%"
          modalBG.style.height = "100%"
          modalFG.style.width = "100%"
          modalFG.style.height = "100%"
          modalBG.style.backgroundColor = `hsl(${this.HSL[0]}deg 100% 50%)`
          
          window.addEventListener("pointerup",()=>{this.Flags.palletClicked=false, modalFG.style.cursor="pointer"})
          modalFG.addEventListener("touchstart",(e)=>{e.preventDefault()})
          modalFG.addEventListener("touchmove",(e)=>{e.preventDefault()})
          window.addEventListener("pointermove",(e)=>{
            if(this.Flags.palletClicked){ 
              this.ModalInfo = modalFG.getBoundingClientRect()
              this.#MovePallete(Math.max((Math.min(e.clientX - this.ModalInfo.left, this.ModalInfo.width)), 0), Math.max((Math.min(e.clientY - this.ModalInfo.top, this.ModalInfo.height)), 0))
            }
          })

          modalFG.addEventListener("pointerdown",(e)=>{
            this.Flags.palletClicked=true
            this.#MovePallete(e.clientX - e.currentTarget.getBoundingClientRect().left,e.clientY - e.currentTarget.getBoundingClientRect().top)
            modalFG.style.cursor="grabbing"
          })

        break
        case "ranges":
          let hueRange = document.createElement("input")
          let opacityRange = document.createElement("input")
          this.Components.ranges = document.createElement("div")
          this.Components.BG.appendChild(this.Components.ranges)
          this.Components.ranges.style = this.styleSheet[elem.type]
          for(const rangeElem of elem.layout){
            if(rangeElem.type=="hueRange"){
              this.presentComponents[2] = 1
              this.Components.hueRange = hueRange
              hueRange.style = this.styleSheet[rangeElem.type]
              this.Components.ranges.appendChild(hueRange)
              hueRange.value = this.HSL[0]
              hueRange.addEventListener("input",()=>{this.#UpdateRanges(hueRange.value,this.RGBA[3])})
            }
            if(rangeElem.type=="opacityRange"){
              this.Components.opacityRange = opacityRange
              this.Components.ranges.appendChild(opacityRange) 
              opacityRange.style = this.styleSheet[rangeElem.type]
              this.presentComponents[3] = 1
              opacityRange.value = this.RGBA[3]
              opacityRange.addEventListener("input",()=>{this.#UpdateRanges(this.HSL[0],opacityRange.value)})
            }
          }
          
          hueRange.setAttribute("type","range")
          hueRange.setAttribute("max","360")
          hueRange.setAttribute("min","0")
          opacityRange.setAttribute("type","range")
          opacityRange.setAttribute("max","1")
          opacityRange.setAttribute("min","0")
          opacityRange.setAttribute("step","0.01")

          opacityRange.style.backgroundImage = `linear-gradient(-10deg,  hsl(${this.HSL[0]}deg ${this.HSL[1]}% ${this.HSL[2]}%), rgba(0,0,0,0)),url("./assets/otb.png")`

          this.Components.ranges.classList.add("CP-ranges")
          hueRange.classList.add("CP-hueRange")
          opacityRange.classList.add("CP-opacityRange")
        break
        case "textInputField":
          let textInput = document.createElement("input") 
          let colorDisplay = document.createElement("div")
          this.Components.textInputField = document.createElement("div")
          this.Components.BG.appendChild(this.Components.textInputField)
          this.Components.textInputField.style = this.styleSheet[elem.type]
          for(const tfElem of elem.layout){
            if(tfElem.type=="textInput"){
              this.Components.textInput = textInput
              this.Components.textInputField.appendChild(textInput)
              textInput.style = this.styleSheet[tfElem.type]
              this.presentComponents[4] = 1
            }
            if(tfElem.type=="colorDisplay"){
              this.Components.colorDisplay = colorDisplay
              this.Components.textInputField.appendChild(colorDisplay) 
              colorDisplay.style = this.styleSheet[tfElem.type]
              this.presentComponents[5] = 1
            }
          }
          this.Components.textInputField.classList.add("CP-textInputField")
          textInput.classList.add("CP-textInput")
          colorDisplay.classList.add("CP-colorDisplay")
          textInput.setAttribute("type","search")
          textInput.setAttribute("name","color text input")
          textInput.setAttribute("autocomplete","off")
          textInput.setAttribute("spellcheck","false")
          colorDisplay.style.backgroundColor = this.initialColor
          textInput.addEventListener("keypress",(k)=>{
            if(k.key=="Enter" && textInput.value!="") this.#UpdateCP(textInput.value), textInput.value = ""
          })
        break
        case "clipBoard":
          let clipBoardSwatchContainer = document.createElement("div")
          let clipBoardInputField = document.createElement("div")
          let clipBoardTextInput = document.createElement("input")
          this.Components.clipBoard = document.createElement("div")

          this.Components.BG.appendChild(this.Components.clipBoard)
          this.Components.clipBoard.style = elem.style
          for(const clbElem of elem.layout){
            if(clbElem.type=="clipBoardInputField"){
              this.Components.clipBoardInputField = clipBoardInputField
              this.Components.clipBoard.appendChild(clipBoardInputField)
              clipBoardInputField.style = this.styleSheet[clbElem.type]
              for(const clbfElem of clbElem.layout){ 
                if(clbfElem.type=="clipBoardTextInput"){ 
                  this.Components.clipBoardTextInput = clipBoardTextInput
                  this.Components.clipBoardInputField.appendChild(clipBoardTextInput)
                  clipBoardTextInput.style = this.styleSheet[clbfElem.type]
                }
              }
            }
            if(clbElem.type=="clipBoardSwatchContainer"){
              this.Components.clipBoardSwatchContainer = clipBoardSwatchContainer
              this.Components.clipBoard.appendChild(clipBoardSwatchContainer)
              clipBoardSwatchContainer.style = this.styleSheet[clbElem.type]
              this.clipboardSwatchLimit = clbElem.swatchLimit
            }
          }
          clipBoardTextInput.setAttribute("type","search")
          clipBoardTextInput.setAttribute("placeholder","clipboard input")
          clipBoardTextInput.setAttribute("name","color clipboard input")
          clipBoardTextInput.setAttribute("autocomplete","off")
          clipBoardTextInput.setAttribute("spellcheck","false")
          clipBoardTextInput.setAttribute("unselectable","on")
        
          this.Components.clipBoard.classList.add("CP-clipBoard")
          clipBoardInputField.classList.add("CP-clipBoardInputField")
          clipBoardTextInput.classList.add("CP-clipBoardTextInput")
          clipBoardSwatchContainer.classList.add("CP-clipBoardSwatchContainer")

          clipBoardTextInput.addEventListener("keypress",(k)=>{
            if(k.key=="Enter" && clipBoardTextInput.value!="" && clipBoardSwatchContainer.children.length<this.clipboardSwatchLimit){ 
              this.#createSwatch(clipBoardTextInput.value)
              clipBoardTextInput.value = ""
            }
          })
          if(this.intialClipBoardSwatches!=undefined) for(const c of this.intialClipBoardSwatches) this.#createSwatch(c)
        break 
      }
    }
   this.#UpdateCP(this.initialColor)
   document.addEventListener(`update-${this.name}`,(e)=>{this.#UpdateCP(e.detail.input)})

  }
  update(Data){
    for(const elem in Data) if(this.Components[elem]!=undefined) this.Components[elem].style = Data[elem]
    this.#UpdateCP(`rgba(${this.RGBA[0]},${this.RGBA[1]},${this.RGBA[2]},${this.RGBA[3]})`)
  }
}