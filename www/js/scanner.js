document.getElementById("btnScanner").addEventListener("click", iniciarScanner);

function iniciarScanner(){

Quagga.init({

inputStream:{
name:"Live",
type:"LiveStream",
target:document.querySelector('#scanner'),
constraints:{
facingMode:"environment"
}
},

decoder:{
readers:["code_128_reader","ean_reader","ean_8_reader"]
}

},function(err){

if(err){
console.log(err);
return;
}

Quagga.start();

});

Quagga.onDetected(function(data){

let codigo = data.codeResult.code;

document.getElementById("referencia").value = codigo;

Quagga.stop();

});

}